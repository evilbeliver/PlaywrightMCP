const { execSync } = require('child_process');
const fs = require('fs');

// Helper to validate article URL (must be /tag/category/article-slug format)
function isValidArticleUrl(url) {
  // Must have exactly 2 path segments after /tag/: category and article-slug
  const match = url.match(/^https:\/\/blog\.silverandfit\.com\/tag\/([^\/]+)\/([a-z0-9-]+)$/);
  if (!match) return false;
  // Article slug must contain a hyphen (to distinguish from category pages)
  return match[2].includes('-');
}

// Extract articles from report (those with references)
const reportPath = '/Users/davidcristinzio/Desktop/PlaywrightMCP/broken-link-reports/reference-links-report-2026-02-16T23-17-42-263Z.html';
const reportHtml = fs.readFileSync(reportPath, 'utf8');

const reportArticles = new Set();
// Match URLs in href attributes
const articleRegex = /href="(https:\/\/blog\.silverandfit\.com\/tag\/[^"]+)"/g;
let match;
while ((match = articleRegex.exec(reportHtml)) !== null) {
  const url = match[1];
  if (isValidArticleUrl(url)) {
    reportArticles.add(url);
  }
}

console.log(`Articles in report (with references): ${reportArticles.size}`);

// Collect all articles from site
const allSiteArticles = new Set();

for (let i = 0; i <= 19; i++) {
  try {
    process.stdout.write(`\rFetching page ${i}/19...`);
    const html = execSync(`curl -s "https://blog.silverandfit.com/page/${i}"`, { encoding: 'utf8' });
    // Extract URLs from href attributes
    const hrefRegex = /href="(https:\/\/blog\.silverandfit\.com\/tag\/[^"]+)"/g;
    let m;
    while ((m = hrefRegex.exec(html)) !== null) {
      const url = m[1];
      if (isValidArticleUrl(url)) {
        allSiteArticles.add(url);
      }
    }
  } catch (e) {
    console.error(`Error on page ${i}: ${e.message}`);
  }
}

console.log(`\nTotal articles on site: ${allSiteArticles.size}`);

// Find articles NOT in report
const missingArticles = [...allSiteArticles].filter(url => !reportArticles.has(url)).sort();

console.log(`\n${'='.repeat(60)}`);
console.log(`  ${missingArticles.length} ARTICLES WITHOUT REFERENCES SECTION`);
console.log(`${'='.repeat(60)}\n`);

// For each missing article, check if it actually has a References section
const { execSync: exec2 } = require('child_process');
console.log('Checking each article for actual References section...\n');

missingArticles.forEach((url, i) => {
  try {
    const html = exec2(`curl -s "${url}"`, { encoding: 'utf8' });
    const hasReferences = html.includes('>References<') || html.includes('>Reference<');
    const marker = hasReferences ? '❌ HAS REFS (BUG!)' : '✓ No refs';
    console.log(`${String(i+1).padStart(2)}. ${marker} - ${url}`);
  } catch (e) {
    console.log(`${String(i+1).padStart(2)}. ERROR - ${url}`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Articles marked "HAS REFS (BUG!)" have references but were not scanned.`);
console.log(`${'='.repeat(60)}\n`);
