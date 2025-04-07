export const getImagePaths = (imagePath: string) => {
    if (!imagePath) return { full: '', thumbnail: '', webp: '', thumbnailWebp: '' };

    // For production, use CDN URLs
    if (process.env.NODE_ENV === 'production') {
        const cdnBase = process.env.REACT_APP_CDN_URL;
        return {
            full: `${cdnBase}/images/${imagePath}`,
            thumbnail: `${cdnBase}/thumbnails/${imagePath}`,
            webp: `${cdnBase}/images/${imagePath.replace(/\.[^.]+$/, '.webp')}`,
            thumbnailWebp: `${cdnBase}/thumbnails/${imagePath.replace(/\.[^.]+$/, '.webp')}`
        };
    }

    // For development, use local paths
    // Extract file info
    const pathInfo = imagePath.match(/^(.+)\/([^/]+)\.([^.]+)$/);
    if (!pathInfo) return { full: imagePath, thumbnail: '', webp: '', thumbnailWebp: '' };

    const [, basePath, fileName, ext] = pathInfo;
    const category = basePath.match(/\/images\/(books|collages)\//)?.[1] || '';

    // Generate all possible paths
    const paths = {
        full: imagePath,
        thumbnail: imagePath.replace(
            `/images/${category}/`,
            `/images/thumbnails/${category}/`
        ),
        webp: `${basePath}/${fileName}.webp`,
        thumbnailWebp: imagePath.replace(
            `/images/${category}/`,
            `/images/thumbnails/${category}/`
        ).replace(`.${ext}`, '.webp')
    };

    // Log in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`Image paths generated for ${fileName}:`, paths);
    }

    return paths;
};

// Helper to get the best available image format
export const getBestImagePath = (paths: ReturnType<typeof getImagePaths>, isThumb = false) => {
    // Check if browser supports WebP
    const supportsWebP = document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;

    if (supportsWebP) {
        return isThumb ? paths.thumbnailWebp : paths.webp;
    }
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