const fs = require('fs');
const path = require('path');

const inputFile = 'C:\\Users\\jimmy\\.claude\\projects\\C--projects-mobileApps-manifest-the-unseen-ios\\464e3499-9bcc-4bdd-8929-b03c6b5f437a\\tool-results\\mcp-playwright-browser_run_code-1768884634449.txt';
const outputFile = path.join(__dirname, 'prayers-raw.csv');

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const csvText = data[0].text.replace('### Result\n', '');
fs.writeFileSync(outputFile, csvText);

console.log(`✅ CSV extracted to: ${outputFile}`);
console.log(`   Size: ${Math.round(csvText.length / 1024)} KB`);
