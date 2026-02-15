import { test, expect, Page, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface LinkResult {
  originalUrl: string;
  foundOnPage: string;
  articleTitle: string;
  status: number | null;
  statusText: string;
  redirectedTo: string | null;
  isBroken: boolean;
  isTimeout: boolean;
  errorMessage: string | null;
}

interface ArticleInfo {
  url: string;
  title: string;
  referenceLinks: string[];
}

// Configure settings
// Set MAX_PAGES=0 for unlimited crawling (each page contains ~10 blog entries)
const MAX_PAGES_TO_CRAWL = parseInt(process.env.MAX_PAGES || '5'); // Default to 5 pages (~50 articles)
const CRAWL_TIMEOUT = parseInt(process.env.CRAWL_TIMEOUT || '30000');
const LINK_CHECK_TIMEOUT = parseInt(process.env.LINK_TIMEOUT || '10000');
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '2');

// Helper function to check a single link with retries and timeout handling
async function checkLinkWithRetry(
  request: APIRequestContext,
  url: string,
  timeout: number,
  maxRetries: number
): Promise<{ status: number | null; statusText: string; finalUrl: string | null; error: string | null; isTimeout: boolean }> {
  let lastError: string | null = null;
  let isTimeout = false;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await request.get(url, { 
        timeout: timeout,
        maxRedirects: 10,
      });
      
      return {
        status: response.status(),
        statusText: response.statusText(),
        finalUrl: response.url() !== url ? response.url() : null,
        error: null,
        isTimeout: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      lastError = errorMessage;
      isTimeout = errorMessage.toLowerCase().includes('timeout');
      
      // If it's a timeout and we have retries left, wait a bit and retry
      if (isTimeout && attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }
      
      // For non-timeout errors, don't retry
      if (!isTimeout) {
        break;
      }
    }
  }
  
  return {
    status: null,
    statusText: '',
    finalUrl: null,
    error: lastError,
    isTimeout: isTimeout,
  };
}

// Check if a URL is a blog article
// Blog articles on this site have URLs like: /tag/category/article-slug
function isBlogArticle(url: string): boolean {
  // Exclude non-article patterns
  const excludePatterns = [
    /\/author\//i,
    /\/page\/\d+/i,
    /\/page\/-?\d+/i,
    /\/category\//i,
    /\?/,  // Query parameters
    /\.(pdf|jpg|jpeg|png|gif|svg|webp|ico|zip|mp4|mp3|wav|css|js|json|xml|txt|woff|woff2|ttf|eot)$/i,
    /\/hubfs\//i,  // HubSpot file storage
    /\/hs-fs\//i,  // HubSpot file system
    /\/wp-content\//i,
    /\/wp-includes\//i,
    /\/#/,  // Hash links
    /javascript:/i,
    /mailto:/i,
  ];
  
  for (const pattern of excludePatterns) {
    if (pattern.test(url)) {
      return false;
    }
  }
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Blog articles have URLs like /tag/category/article-slug (3 parts: tag, category, slug)
    // e.g., /tag/fitness/revamp-cardio or /tag/nutrition/healthy-fats
    const tagMatch = pathname.match(/^\/tag\/([^\/]+)\/([^\/]+)\/?$/);
    if (tagMatch) {
      const slug = tagMatch[2];
      // Article slugs typically have hyphens and are descriptive
      if (slug && slug.includes('-') && slug.length > 5) {
        return true;
      }
    }
    
    // Also check for direct article URLs like /article-title-here
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    if (pathParts.length === 1 && pathParts[0].includes('-') && pathParts[0].length > 10) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

test.describe('Broken Link Tests', () => {
  test('Check for broken reference links in blog articles', async ({ page }) => {
    // Configure the target URL - can be parameterized via environment variable
    const targetUrl = process.env.TARGET_URL || 'https://blog.silverandfit.com/';
    const targetDomain = new URL(targetUrl).hostname;
    
    // Track pages and articles
    const visitedListPages = new Set<string>();
    const listPagesToVisit: string[] = [targetUrl];
    const articles: ArticleInfo[] = [];
    const allReferenceLinks = new Map<string, { articleUrl: string; articleTitle: string }>(); // url -> article info
    
    const crawlLimit = MAX_PAGES_TO_CRAWL === 0 ? 'unlimited' : MAX_PAGES_TO_CRAWL;
    console.log(`\n🔍 Starting blog reference link scan of ${targetUrl}`);
    console.log(`   Max listing pages to crawl: ${crawlLimit} (each page has ~10 articles)`);
    console.log(`   Link check timeout: ${LINK_CHECK_TIMEOUT}ms (with ${MAX_RETRIES} retries)`);
    console.log(`   Target domain: ${targetDomain}\n`);

    // Phase 1: Collect article URLs from listing pages
    console.log(`📚 Phase 1: Discovering blog articles...\n`);
    
    while (listPagesToVisit.length > 0 && (MAX_PAGES_TO_CRAWL === 0 || visitedListPages.size < MAX_PAGES_TO_CRAWL)) {
      const currentPageUrl = listPagesToVisit.shift()!;
      
      if (visitedListPages.has(currentPageUrl)) {
        continue;
      }
      
      visitedListPages.add(currentPageUrl);
      
      await test.step(`Scanning listing page: ${currentPageUrl}`, async () => {
        try {
          const response = await page.goto(currentPageUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: CRAWL_TIMEOUT 
          });
          
          if (!response || response.status() >= 400) {
            console.log(`   ⚠️ Could not load page: ${currentPageUrl} (Status: ${response?.status() || 'No response'})`);
            return;
          }
          
          // Find all article links on this listing page
          const articleLinks = await page.locator('a').all();
          let foundArticles = 0;
          
          for (const link of articleLinks) {
            const href = await link.getAttribute('href');
            if (href) {
              try {
                const absoluteUrl = new URL(href, currentPageUrl).href.split('#')[0];
                const linkDomain = new URL(absoluteUrl).hostname;
                
                // Only process internal links that are blog articles
                if ((linkDomain === targetDomain || linkDomain.endsWith('.' + targetDomain)) && 
                    isBlogArticle(absoluteUrl) &&
                    !articles.some(a => a.url === absoluteUrl)) {
                  articles.push({ url: absoluteUrl, title: '', referenceLinks: [] });
                  foundArticles++;
                }
              } catch (e) {
                // Invalid URL - skip
              }
            }
          }
          
          // Find pagination links to get more articles
          const paginationLinks = await page.locator('a[href*="/page/"]').all();
          for (const link of paginationLinks) {
            const href = await link.getAttribute('href');
            if (href) {
              try {
                const absoluteUrl = new URL(href, currentPageUrl).href;
                if (!visitedListPages.has(absoluteUrl) && !listPagesToVisit.includes(absoluteUrl)) {
                  listPagesToVisit.push(absoluteUrl);
                }
              } catch (e) {
                // Invalid URL - skip
              }
            }
          }
          
          console.log(`   📄 ${currentPageUrl}`);
          console.log(`      Found ${foundArticles} new article links`);
          
        } catch (error) {
          console.log(`   ❌ Error scanning ${currentPageUrl}: ${error instanceof Error ? error.message : String(error)}`);
        }
      });
    }

    console.log(`\n📊 Phase 1 complete:`);
    console.log(`   Listing pages scanned: ${visitedListPages.size}`);
    console.log(`   Articles discovered: ${articles.length}\n`);

    // Phase 2: Visit each article and extract reference links
    console.log(`📖 Phase 2: Extracting reference links from articles...\n`);
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      await test.step(`[${i + 1}/${articles.length}] Extracting references from: ${article.url}`, async () => {
        try {
          const response = await page.goto(article.url, { 
            waitUntil: 'domcontentloaded',
            timeout: CRAWL_TIMEOUT 
          });
          
          if (!response || response.status() >= 400) {
            console.log(`   ⚠️ Could not load article: ${article.url}`);
            return;
          }
          
          // Get article title
          const titleElement = await page.locator('h1').first();
          article.title = await titleElement.textContent() || article.url;
          article.title = article.title.trim();
          
          // Find the References section and extract links
          // Look for text containing "References" or "Reference" heading
          const referenceLinks = await page.evaluate(() => {
            const links: string[] = [];
            
            // Find all text nodes that contain "References" or "Reference"
            const walker = document.createTreeWalker(
              document.body,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let referenceSection: Element | null = null;
            let node: Text | null;
            
            while (node = walker.nextNode() as Text | null) {
              if (node.textContent && /^References?\s*$/i.test(node.textContent.trim())) {
                // Found a References heading - get the parent element
                referenceSection = node.parentElement;
                break;
              }
            }
            
            if (referenceSection) {
              // Get all links that appear after the References heading
              // Find the container that holds the references
              let container = referenceSection.parentElement;
              
              // Walk through siblings and descendants to find links
              let currentElement: Element | null = referenceSection;
              let foundLinks = false;
              
              // Get all links in the document after the reference section
              const allLinks = document.querySelectorAll('a[href]');
              const refPosition = referenceSection.getBoundingClientRect().top;
              
              allLinks.forEach(link => {
                const linkPosition = link.getBoundingClientRect().top;
                // Only get links that appear after "References" text but before the footer
                if (linkPosition > refPosition && linkPosition < refPosition + 500) {
                  const href = link.getAttribute('href');
                  if (href && href.startsWith('http') && !href.includes('silverandfit.com')) {
                    links.push(href);
                  }
                }
              });
            }
            
            return links;
          });
          
          article.referenceLinks = referenceLinks;
          
          // Add to master list
          for (const refLink of referenceLinks) {
            if (!allReferenceLinks.has(refLink)) {
              allReferenceLinks.set(refLink, { articleUrl: article.url, articleTitle: article.title });
            }
          }
          
          if (referenceLinks.length > 0) {
            console.log(`   📄 "${article.title.substring(0, 50)}..." - ${referenceLinks.length} references`);
          }
          
        } catch (error) {
          console.log(`   ❌ Error processing ${article.url}: ${error instanceof Error ? error.message : String(error)}`);
        }
      });
    }

    const articlesWithRefs = articles.filter(a => a.referenceLinks.length > 0);
    console.log(`\n📊 Phase 2 complete:`);
    console.log(`   Articles processed: ${articles.length}`);
    console.log(`   Articles with references: ${articlesWithRefs.length}`);
    console.log(`   Unique reference links to check: ${allReferenceLinks.size}\n`);

    test.info().attachments.push({ 
      name: 'articles-processed', 
      contentType: 'text/plain', 
      body: Buffer.from(articles.length.toString()) 
    });

    test.info().attachments.push({ 
      name: 'reference-links-count', 
      contentType: 'text/plain', 
      body: Buffer.from(allReferenceLinks.size.toString()) 
    });

    // Phase 3: Check all reference links
    console.log(`🔗 Phase 3: Checking reference links...\n`);
    
    const linkResults: LinkResult[] = [];
    const brokenLinks: LinkResult[] = [];
    const timeoutLinks: LinkResult[] = [];

    let checkedCount = 0;
    for (const [url, articleInfo] of allReferenceLinks) {
      checkedCount++;
      await test.step(`[${checkedCount}/${allReferenceLinks.size}] Checking: ${url}`, async () => {
        const result: LinkResult = {
          originalUrl: url,
          foundOnPage: articleInfo.articleUrl,
          articleTitle: articleInfo.articleTitle,
          status: null,
          statusText: '',
          redirectedTo: null,
          isBroken: false,
          isTimeout: false,
          errorMessage: null,
        };

        const checkResult = await checkLinkWithRetry(
          page.request,
          url,
          LINK_CHECK_TIMEOUT,
          MAX_RETRIES
        );
        
        result.status = checkResult.status;
        result.statusText = checkResult.statusText;
        result.redirectedTo = checkResult.finalUrl;
        result.errorMessage = checkResult.error;
        result.isTimeout = checkResult.isTimeout;
        
        if (checkResult.error) {
          if (checkResult.isTimeout) {
            result.isTimeout = true;
            timeoutLinks.push(result);
            console.log(`   ⏱️ Timeout: ${url}`);
          } else {
            result.isBroken = true;
            brokenLinks.push(result);
            console.log(`   ❌ Broken: ${url}`);
          }
        } else if (checkResult.status && checkResult.status >= 400) {
          result.isBroken = true;
          brokenLinks.push(result);
          console.log(`   ❌ Broken (${checkResult.status}): ${url}`);
          expect.soft(checkResult.status, `Reference link ${url} is broken (Status: ${checkResult.status})`).toBeLessThan(400);
        } else {
          console.log(`   ✅ OK: ${url}`);
        }
        
        linkResults.push(result);
      });
    }

    // Generate HTML report
    const reportHtml = generateHtmlReport(targetUrl, articles, linkResults, brokenLinks, timeoutLinks);
    
    // Ensure reports directory exists
    const reportsDir = path.join(process.cwd(), 'broken-link-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save report with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportsDir, `reference-links-report-${timestamp}.html`);
    fs.writeFileSync(reportPath, reportHtml);

    // Also attach report to test results
    test.info().attachments.push({
      name: 'reference-links-report.html',
      contentType: 'text/html',
      body: Buffer.from(reportHtml),
    });

    // Log summary
    console.log(`\n📊 Reference Link Check Summary:`);
    console.log(`   Articles scanned: ${articles.length}`);
    console.log(`   Articles with references: ${articlesWithRefs.length}`);
    console.log(`   Total reference links checked: ${linkResults.length}`);
    console.log(`   Broken links found: ${brokenLinks.length}`);
    console.log(`   Timeout links: ${timeoutLinks.length}`);
    console.log(`   Report saved to: ${reportPath}\n`);

    // Attach JSON summary
    test.info().attachments.push({
      name: 'link-results.json',
      contentType: 'application/json',
      body: Buffer.from(JSON.stringify({ 
        articlesScanned: articles.map(a => ({ url: a.url, title: a.title, referenceCount: a.referenceLinks.length })),
        linkResults, 
        brokenLinks,
        timeoutLinks 
      }, null, 2)),
    });
  });
});

function generateHtmlReport(targetUrl: string, articles: ArticleInfo[], allLinks: LinkResult[], brokenLinks: LinkResult[], timeoutLinks: LinkResult[]): string {
  const timestamp = new Date().toLocaleString();
  const workingLinks = allLinks.filter(link => !link.isBroken && !link.isTimeout);
  const redirectedLinks = allLinks.filter(link => link.redirectedTo !== null && !link.isBroken && !link.isTimeout);
  const articlesWithRefs = articles.filter(a => a.referenceLinks.length > 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reference Links Report - ${targetUrl}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 2em;
      margin-bottom: 10px;
    }
    .meta {
      opacity: 0.9;
      font-size: 0.9em;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card h3 {
      font-size: 2.5em;
      margin-bottom: 5px;
    }
    .stat-card.articles h3 { color: #9b59b6; }
    .stat-card.total h3 { color: #667eea; }
    .stat-card.broken h3 { color: #e74c3c; }
    .stat-card.timeout h3 { color: #95a5a6; }
    .stat-card.working h3 { color: #27ae60; }
    .stat-card.redirected h3 { color: #f39c12; }
    .stat-card p {
      color: #666;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    section {
      background: white;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #eee;
    }
    h2.broken { border-color: #e74c3c; }
    h2.timeout { border-color: #95a5a6; }
    h2.redirected { border-color: #f39c12; }
    h2.working { border-color: #27ae60; }
    h2.articles { border-color: #9b59b6; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9em;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #555;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .url {
      word-break: break-all;
      max-width: 400px;
    }
    .article-title {
      max-width: 300px;
      font-style: italic;
      color: #666;
    }
    .status {
      font-weight: 600;
    }
    .status.error { color: #e74c3c; }
    .status.timeout { color: #95a5a6; }
    .status.redirect { color: #f39c12; }
    .status.ok { color: #27ae60; }
    a {
      color: #667eea;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #888;
    }
    .collapsible {
      cursor: pointer;
    }
    .collapsible:after {
      content: ' ▼';
      font-size: 0.8em;
    }
    .collapsed:after {
      content: ' ▶';
    }
    .content {
      display: block;
    }
    .content.hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📚 Reference Links Report</h1>
      <p class="meta">Target: ${targetUrl}</p>
      <p class="meta">Generated: ${timestamp}</p>
      <p class="meta">Scope: References section in blog articles only</p>
    </header>

    <div class="summary">
      <div class="stat-card articles">
        <h3>${articlesWithRefs.length}</h3>
        <p>Articles w/ Refs</p>
      </div>
      <div class="stat-card total">
        <h3>${allLinks.length}</h3>
        <p>Reference Links</p>
      </div>
      <div class="stat-card broken">
        <h3>${brokenLinks.length}</h3>
        <p>Broken</p>
      </div>
      <div class="stat-card timeout">
        <h3>${timeoutLinks.length}</h3>
        <p>Timeouts</p>
      </div>
      <div class="stat-card redirected">
        <h3>${redirectedLinks.length}</h3>
        <p>Redirects</p>
      </div>
      <div class="stat-card working">
        <h3>${workingLinks.length}</h3>
        <p>Working</p>
      </div>
    </div>

    ${brokenLinks.length > 0 ? `
    <section>
      <h2 class="broken">❌ Broken Reference Links (${brokenLinks.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Reference URL</th>
            <th>Status</th>
            <th>Article</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          ${brokenLinks.map(link => `
          <tr>
            <td class="url"><a href="${link.originalUrl}" target="_blank">${link.originalUrl}</a></td>
            <td class="status error">${link.status || 'Error'}</td>
            <td class="article-title"><a href="${link.foundOnPage}" target="_blank">${link.articleTitle || 'Unknown'}</a></td>
            <td>${link.errorMessage || link.statusText || '-'}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
    ` : ''}

    ${timeoutLinks.length > 0 ? `
    <section>
      <h2 class="timeout">⏱️ Timeout Links (${timeoutLinks.length})</h2>
      <p style="margin-bottom: 15px; color: #666;">These links did not respond within the timeout period after ${MAX_RETRIES} retries.</p>
      <table>
        <thead>
          <tr>
            <th>Reference URL</th>
            <th>Article</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          ${timeoutLinks.map(link => `
          <tr>
            <td class="url"><a href="${link.originalUrl}" target="_blank">${link.originalUrl}</a></td>
            <td class="article-title"><a href="${link.foundOnPage}" target="_blank">${link.articleTitle || 'Unknown'}</a></td>
            <td class="status timeout">${link.errorMessage || 'Timeout'}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
    ` : ''}

    ${redirectedLinks.length > 0 ? `
    <section>
      <h2 class="redirected collapsible" onclick="toggleSection(this)">🔀 Redirected Links (${redirectedLinks.length})</h2>
      <div class="content">
        <table>
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Redirected To</th>
              <th>Article</th>
            </tr>
          </thead>
          <tbody>
            ${redirectedLinks.map(link => `
            <tr>
              <td class="url"><a href="${link.originalUrl}" target="_blank">${link.originalUrl}</a></td>
              <td class="url"><a href="${link.redirectedTo}" target="_blank">${link.redirectedTo}</a></td>
              <td class="article-title"><a href="${link.foundOnPage}" target="_blank">${link.articleTitle || 'Unknown'}</a></td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
    ` : ''}

    <section>
      <h2 class="articles collapsible" onclick="toggleSection(this)">📖 Articles Scanned (${articlesWithRefs.length} with references)</h2>
      <div class="content">
        <table>
          <thead>
            <tr>
              <th>Article Title</th>
              <th>URL</th>
              <th>References</th>
            </tr>
          </thead>
          <tbody>
            ${articlesWithRefs.map(article => `
            <tr>
              <td>${article.title}</td>
              <td class="url"><a href="${article.url}" target="_blank">${article.url}</a></td>
              <td>${article.referenceLinks.length}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    ${workingLinks.length > 0 ? `
    <section>
      <h2 class="working collapsible collapsed" onclick="toggleSection(this)">✅ Working Links (${workingLinks.length})</h2>
      <div class="content hidden">
        <table>
          <thead>
            <tr>
              <th>Reference URL</th>
              <th>Status</th>
              <th>Article</th>
            </tr>
          </thead>
          <tbody>
            ${workingLinks.map(link => `
            <tr>
              <td class="url"><a href="${link.originalUrl}" target="_blank">${link.originalUrl}</a></td>
              <td class="status ok">${link.status}</td>
              <td class="article-title"><a href="${link.foundOnPage}" target="_blank">${link.articleTitle || 'Unknown'}</a></td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
    ` : ''}
  </div>

  <script>
    function toggleSection(header) {
      header.classList.toggle('collapsed');
      const content = header.nextElementSibling;
      content.classList.toggle('hidden');
    }
  </script>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
