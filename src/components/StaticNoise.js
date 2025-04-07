function drawStaticNoise(ctx, image) {
  // Add image loading check
  if (!image.complete || image.naturalWidth === 0) {
    // Create a promise that resolves when the image loads
    return new Promise((resolve) => {
      image.onload = () => {
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        resolve();
      };
      image.onerror = () => {
        console.error('Error loading image');
        resolve();
      };
    });
  }
  
  // If image is already loaded, draw it immediately
  ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
  return Promise.resolve();
}

// Update the event handlers
const handleMouseEnter = async () => {
  const ctx = canvasRef.current.getContext('2d');
  await drawStaticNoise(ctx, noiseImage);
};

const handleMouseLeave = async () => {
  const ctx = canvasRef.current.getContext('2d');
  await drawStaticNoise(ctx, noiseImage);
}; 