import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ImageProcessorConfig {
    categories: string[];  // e.g., ['books', 'collages']
    sizes: {
        thumbnail: {
            width: number;
            height: number;
        };
    };
    formats: {
        webp: {
            quality: number;
        };
    };
}

const DEFAULT_CONFIG: ImageProcessorConfig = {
    categories: ['books', 'collages'],
    sizes: {
        thumbnail: {
            width: 300,
            height: 400
        }
    },
    formats: {
        webp: {
            quality: 80  // Good balance between quality and file size
        }
    }
};

export const generateThumbnails = async (config: ImageProcessorConfig = DEFAULT_CONFIG) => {
    const { categories, sizes, formats } = config;
    const rootDir = process.cwd();  // This gets the project root directory

    for (const category of categories) {
        const sourcePath = path.join(rootDir, 'public', 'images', category);
        const thumbnailPath = path.join(rootDir, 'public', 'images', 'thumbnails', category);

        // Ensure source directory exists
        if (!fs.existsSync(sourcePath)) {
            console.log(`Skipping ${category} - source directory doesn't exist`);
            continue;
        }

        // Create thumbnail directory
        fs.mkdirSync(thumbnailPath, { recursive: true });

        // Process all images in the category
        const files = fs.readdirSync(sourcePath);
        
        for (const file of files) {
            if (!/\.(jpg|jpeg|png|gif)$/i.test(file)) continue;

            const sourceFile = path.join(sourcePath, file);
            const fileNameWithoutExt = path.parse(file).name;

            // Define output paths
            const thumbnailJpg = path.join(thumbnailPath, file);
            const thumbnailWebp = path.join(thumbnailPath, `${fileNameWithoutExt}.webp`);
            const originalWebp = path.join(sourcePath, `${fileNameWithoutExt}.webp`);

            // Skip if all files exist and are up to date
            if (fs.existsSync(thumbnailJpg) && 
                fs.existsSync(thumbnailWebp) && 
                fs.existsSync(originalWebp)) {
                const sourceStats = fs.statSync(sourceFile);
                const thumbJpgStats = fs.statSync(thumbnailJpg);
                const thumbWebpStats = fs.statSync(thumbnailWebp);
                const origWebpStats = fs.statSync(originalWebp);

                if (thumbJpgStats.mtime > sourceStats.mtime &&
                    thumbWebpStats.mtime > sourceStats.mtime &&
                    origWebpStats.mtime > sourceStats.mtime) {
                    console.log(`Skipping ${file} - all versions are up to date`);
                    continue;
                }
            }

            try {
                // Create thumbnail JPG
                await sharp(sourceFile)
                    .resize(sizes.thumbnail.width, sizes.thumbnail.height, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .toFile(thumbnailJpg);

                // Create thumbnail WebP
                await sharp(sourceFile)
                    .resize(sizes.thumbnail.width, sizes.thumbnail.height, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .webp({ quality: formats.webp.quality })
                    .toFile(thumbnailWebp);

                // Create original WebP
                await sharp(sourceFile)
                    .webp({ quality: formats.webp.quality })
                    .toFile(originalWebp);

                console.log(`Generated all versions for ${file}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
};

// Example usage:
// generateThumbnails({
//     sourcePath: path.join(process.cwd(), 'public/images/books'),
//     thumbnailPath: path.join(process.cwd(), 'public/images/thumbnails/books'),
//     thumbnailSize: { width: 300, height: 400 }
// }); 