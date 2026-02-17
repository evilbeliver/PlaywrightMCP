const url = 'https://blog.silverandfit.com/tag/fitness/power-training';
const urlObj = new URL(url);
const pathname = urlObj.pathname;

const tagMatch = pathname.match(/^\/tag\/([^\/]+)\/([^\/]+)\/?$/);
console.log('pathname:', pathname);
console.log('tagMatch:', tagMatch);
if (tagMatch) {
  const slug = tagMatch[2];
  console.log('slug:', slug);
  console.log('has hyphen:', slug.includes('-'));
  console.log('length > 5:', slug.length > 5);
  console.log('length:', slug.length);
  console.log('RESULT: isBlogArticle =', slug && slug.includes('-') && slug.length > 5);
} else {
  console.log('RESULT: No match');
}
