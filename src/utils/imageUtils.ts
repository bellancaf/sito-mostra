export const getImagePaths = (imagePath: string) => {
    if (!imagePath) return { thumbnail: '', full: '' };

    // Remove any leading slash and ensure clean path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // Use absolute paths from the root
    const paths = {
        thumbnail: `/images/thumbnails/${cleanPath}`,
        full: `/images/${cleanPath}`
    };

    // Debug logging
    console.log('Image Paths:', {
        originalPath: imagePath,
        cleanPath,
        paths,
        env: process.env.NODE_ENV
    });

    return paths;
};

// Simplified getBestImagePath
export const getBestImagePath = (paths: ReturnType<typeof getImagePaths>, isThumb = false) => {
    return isThumb ? paths.thumbnail : paths.full;
};

// Helper to determine if we should use thumbnail
export const shouldUseThumbnail = (context: 'grid' | 'preview' | 'detail' | 'lightbox') => {
    const shouldUse = ['grid', 'preview'].includes(context);
    
    // Debug logging
    console.log(`Thumbnail decision:
        Context: ${context}
        Using thumbnail: ${shouldUse}
    `);
    
    return shouldUse;
}; 