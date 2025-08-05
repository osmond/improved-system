const fs = require('fs');
const path = require('path');
const { getReadingSpeed } = require('../server/services/kindleService');

function main() {
  const data = getReadingSpeed();
  const outPath = path.join(__dirname, '..', 'src', 'data', 'kindle', 'reading-speed.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${data.length} records to ${outPath}`);
}

if (require.main === module) {
  main();
}
