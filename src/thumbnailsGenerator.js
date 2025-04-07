const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseDir = path.join(__dirname, 'public/Quadri');
const thumbnailDir = path.join(baseDir, 'thumbnails');

// Ensure the thumbnails directory exists
if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
}

fs.readdirSync(baseDir).forEach((year) => {
    const yearPath = path.join(baseDir, year);
    const yearThumbnailPath = path.join(thumbnailDir, year);

    if (fs.lstatSync(yearPath).isDirectory()) {
        // Ensure the year thumbnails directory exists
        if (!fs.existsSync(yearThumbnailPath)) {
            fs.mkdirSync(yearThumbnailPath, { recursive: true });
        }

        fs.readdirSync(yearPath).forEach((file) => {
            const inputPath = path.join(yearPath, file);
            const outputPath = path.join(yearThumbnailPath, file);

            // Generate thumbnail
            sharp(inputPath)
                .resize(150, 150)
                .toFile(outputPath)
                .then(() => console.log(`Thumbnail created: ${outputPath}`))
                .catch((err) => console.error(`Error creating thumbnail: ${err}`));
        });
    }
});
