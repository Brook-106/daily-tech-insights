import fs from 'node:fs';

const README_PATH = './README.md';
const API_URL = 'https://dummyjson.com/quotes/random';

async function fetchQuoteAndUpdate() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const formattedContent = `> "${data.quote}"  \n> — **${data.author}**`;

    const readme = fs.readFileSync(README_PATH, 'utf-8');
    const updatedReadme = readme.replace(
      /<!-- START_QUOTE -->[\s\S]*<!-- END_QUOTE -->/,
      `<!-- START_QUOTE -->\n${formattedContent}\n<!-- END_QUOTE -->`
    );

    fs.writeFileSync(README_PATH, updatedReadme);
    console.log('README successfully updated with new quote.');
  } catch (error) {
    console.error('Failed to update README:', error);
    process.exit(1);
  }
}

fetchQuoteAndUpdate();
