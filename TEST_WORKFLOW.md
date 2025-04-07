# Image Processing Test Workflow

1. **Prepare Test Images**
   - Place test images in:
     - `public/images/books/`
     - `public/images/collages/`
   - Use various sizes and formats (jpg, png)

2. **Run Tests**
   ```bash
   # Generate thumbnails and verify
   npm run test:images

   # Start development server
   npm run start
   ```

3. **Visual Verification**
   - Visit these routes to verify images:
     - `/books` - Check grid view thumbnails
     - `/books/{id}` - Check full-size images
     - `/collages` - Check grid view thumbnails
     - `/collages/{id}` - Check full-size images

4. **Performance Testing**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Check image loading times
   - Verify thumbnail sizes are smaller than originals

5. **Error Cases**
   - Remove some source images
   - Add invalid image files
   - Check error handling 