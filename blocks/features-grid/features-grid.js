import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Create grid container
  const gridContainer = document.createElement('div');
  gridContainer.className = 'features-grid-container';
  
  // Process each feature
  [...block.children].forEach((row) => {
    const feature = document.createElement('div');
    feature.className = 'feature-item';
    
    // Handle image
    const img = row.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }]);
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'feature-icon';
      imageWrapper.appendChild(optimizedPic);
      feature.appendChild(imageWrapper);
    }
    
    // Handle text content
    const textContent = document.createElement('div');
    textContent.className = 'feature-content';
    while (row.firstChild) {
      if (!row.firstChild.querySelector('img')) {
        textContent.appendChild(row.firstChild);
      } else {
        row.removeChild(row.firstChild);
      }
    }
    feature.appendChild(textContent);
    
    gridContainer.appendChild(feature);
  });
  
  // Replace block content
  block.textContent = '';
  block.appendChild(gridContainer);
} 