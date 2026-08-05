import fs from 'node:fs';

const README_PATH = './README.md';
const API_URL = 'https://dummyjson.com/quotes/random';

const FALLBACK_QUOTE = {
  quote: 'The only way to do great work is to love what you do.',
  author: 'Steve Jobs',
};

async function fetchQuote() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.quote || !data.author) {
      throw new Error('API response missing quote or author');
    }
    return data;
  } catch (error) {
    console.warn('Falling back to default quote:', error.message);
    return FALLBACK_QUOTE;
  }
}

function updateReadme(quote) {
  const readme = fs.readFileSync(README_PATH, 'utf-8');
  const markerRegex = /<!-- START_QUOTE -->[\s\S]*<!-- END_QUOTE -->/;

  if (!markerRegex.test(readme)) {
    throw new Error('README is missing START_QUOTE/END_QUOTE markers.');
  }

  const escapedQuote = quote.quote.replace(/"/g, '\\"');
  const formattedContent = `> "${escapedQuote}"  \n> — **${quote.author}**`;

  const updatedReadme = readme.replace(
    markerRegex,
    `<!-- START_QUOTE -->\n${formattedContent}\n<!-- END_QUOTE -->`
  );

  fs.writeFileSync(README_PATH, updatedReadme);
}

async function main() {
  try {
    const quote = await fetchQuote();
    updateReadme(quote);
    console.log('README successfully updated with new quote.');
  } catch (error) {
    console.error('Failed to update README:', error.message);
    process.exit(1);
  }
}

main();
