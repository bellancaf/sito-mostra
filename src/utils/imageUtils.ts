export const getImagePaths = (imagePath: string) => {
    if (!imagePath) return { thumbnail: '', full: '' };

    // For production, assume images are in the public directory
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.PUBLIC_URL || ''
        : '';

    // Remove any leading slash to ensure proper path joining
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    const paths = {
        thumbnail: `${baseUrl}/images/thumbnails/${cleanPath}`,
        full: `${baseUrl}/images/${cleanPath}`
    };

    // Add debug logging
    console.log('Image Paths:', {
        originalPath: imagePath,
        baseUrl,
        cleanPath,
        paths,
        env: process.env.NODE_ENV,
        publicUrl: process.env.PUBLIC_URL
    });

    return paths;
};

// Simplified getBestImagePath that doesn't rely on WebP
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