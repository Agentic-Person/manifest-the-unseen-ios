const fs = require('fs');
const https = require('https');

// Function to download placeholder
function downloadPlaceholder(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', reject);
  });
}

// Download purple placeholders from placeholder services
async function createPlaceholders() {
  try {
    // Using placeholder.com with custom color (9333ea is purple)
    await downloadPlaceholder(
      'https://via.placeholder.com/1024/9333ea/FFFFFF?text=M',
      'icon.png'
    );
    
    await downloadPlaceholder(
      'https://via.placeholder.com/1242x2436/9333ea/FFFFFF?text=Manifest',
      'splash.png'
    );
    
    await downloadPlaceholder(
      'https://via.placeholder.com/1024/9333ea/FFFFFF?text=M',
      'adaptive-icon.png'
    );
    
    console.log('\nAll placeholder assets created successfully!');
    console.log('These are functional placeholders for Expo Go development.');
    console.log('Replace with professional assets before production.');
  } catch (error) {
    console.error('Error downloading placeholders:', error.message);
    console.log('Using existing minimal placeholders.');
  }
}

createPlaceholders();
