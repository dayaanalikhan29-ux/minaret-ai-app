const fs = require('fs');
const path = require('path');

// Read the Quran data files
const arEnData = JSON.parse(fs.readFileSync(path.join(__dirname, '../MinaretApp/data/ar-en.json'), 'utf8'));
const urData = JSON.parse(fs.readFileSync(path.join(__dirname, '../MinaretApp/data/ur.json'), 'utf8'));
const transliterationData = JSON.parse(fs.readFileSync(path.join(__dirname, '../MinaretApp/data/en.transliteration.json'), 'utf8'));

// Create output directory
const outputDir = path.join(__dirname, '../MinaretApp/data/quran-surahs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Group verses by surah
const surahGroups = {};

// Process ar-en data
arEnData.forEach(verse => {
  const surahNum = verse.chapter_number;
  if (!surahGroups[surahNum]) {
    surahGroups[surahNum] = { arEn: [], ur: [], transliteration: [] };
  }
  surahGroups[surahNum].arEn.push(verse);
});

// Process ur data
urData.forEach(surah => {
  const surahNum = surah.id;
  if (!surahGroups[surahNum]) {
    surahGroups[surahNum] = { arEn: [], ur: [], transliteration: [] };
  }
  surahGroups[surahNum].ur = surah.verses || [];
});

// Process transliteration data
transliterationData.forEach(surah => {
  const surahNum = surah.id;
  if (!surahGroups[surahNum]) {
    surahGroups[surahNum] = { arEn: [], ur: [], transliteration: [] };
  }
  surahGroups[surahNum].transliteration = surah.verses || [];
});

// Write split files
Object.keys(surahGroups).forEach(surahNum => {
  const surahData = surahGroups[surahNum];
  const fileName = `surah-${parseInt(surahNum).toString().padStart(3, '0')}.json`;
  const filePath = path.join(outputDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2));
  console.log(`Created ${fileName} with ${surahData.arEn.length} verses`);
});

console.log(`\nSplit Quran data into ${Object.keys(surahGroups).length} surah files`);
console.log(`Output directory: ${outputDir}`);
