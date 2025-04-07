import { generateThumbnails } from './imageProcessor.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testImageProcessing = async () => {
    // Test configuration with WebP support
    const config = {
        categories: ['books', 'collages'],
        sizes: {
            thumbnail: {
                width: 300,
                height: 400
            }
        },
        formats: {
            webp: {
                quality: 80
            }
        }
    };

    try {
        // Get the project root directory (2 levels up from scripts folder)
        const rootDir = path.resolve(__dirname, '../../');
        
        // 1. Create test directories if they don't exist
        const testDirs = [
            path.join(rootDir, 'public/images/books'),
            path.join(rootDir, 'public/images/collages'),
            path.join(rootDir, 'public/images/thumbnails/books'),
            path.join(rootDir, 'public/images/thumbnails/collages')
        ];

        testDirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        });

        // 2. Generate thumbnails and WebP versions
        await generateThumbnails(config);
        console.log('Image processing completed');

        // 3. Verify results
        const verifyImages = (category: string) => {
            const sourcePath = path.join(rootDir, 'public', 'images', category);
            const thumbnailPath = path.join(rootDir, 'public', 'images', 'thumbnails', category);

            if (!fs.existsSync(sourcePath)) {
                console.log(`Source directory ${sourcePath} does not exist`);
                return;
            }

            const sourceFiles = fs.readdirSync(sourcePath)
                .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

            console.log(`\nVerifying ${category}:`);
            console.log(`Source files: ${sourceFiles.length}`);

            sourceFiles.forEach(file => {
                const fileNameWithoutExt = path.parse(file).name;
                const results = {
                    thumbnail: fs.existsSync(path.join(thumbnailPath, file)),
                    thumbnailWebp: fs.existsSync(path.join(thumbnailPath, `${fileNameWithoutExt}.webp`)),
                    originalWebp: fs.existsSync(path.join(sourcePath, `${fileNameWithoutExt}.webp`))
                };

                console.log(`\nFile: ${file}`);
                console.log(`✓ Original: ${formatFileSize(path.join(sourcePath, file))}`);
                console.log(`${results.thumbnail ? '✓' : '✗'} Thumbnail JPG: ${formatFileSize(path.join(thumbnailPath, file))}`);
                console.log(`${results.thumbnailWebp ? '✓' : '✗'} Thumbnail WebP: ${formatFileSize(path.join(thumbnailPath, `${fileNameWithoutExt}.webp`))}`);
                console.log(`${results.originalWebp ? '✓' : '✗'} Original WebP: ${formatFileSize(path.join(sourcePath, `${fileNameWithoutExt}.webp`))}`);
            });
        };

        // Helper to format file sizes
        const formatFileSize = (filePath: string): string => {
            try {
                const stats = fs.statSync(filePath);
                const size = stats.size / 1024; // Convert to KB
                return `${size.toFixed(2)} KB`;
            } catch {
                return 'not found';
            }
        };

        config.categories.forEach(verifyImages);

    } catch (error) {
        console.error('Error during test:', error);
    }
};

testImageProcessing(); 