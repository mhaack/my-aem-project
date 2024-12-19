import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create container
  const container = document.createElement('div');
  container.className = 'product-showcase-container';
  
  // Create tabs container
  const tabList = document.createElement('div');
  tabList.className = 'product-tabs';
  tabList.setAttribute('role', 'tablist');
  
  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'product-content';
  
  // Process each product section
  [...block.children].forEach((row, index) => {
    const [titleDiv, imageDiv, contentDiv] = row.children;
    
    // Create tab button
    const tab = document.createElement('button');
    tab.className = 'product-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.setAttribute('id', `tab-${index}`);
    tab.setAttribute('aria-controls', `panel-${index}`);
    tab.textContent = titleDiv.textContent.trim();
    moveInstrumentation(titleDiv, tab);
    
    // Create panel
    const panel = document.createElement('div');
    panel.className = 'product-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', `panel-${index}`);
    panel.setAttribute('aria-labelledby', `tab-${index}`);
    panel.hidden = index !== 0;
    
    // Handle image
    const img = imageDiv.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]);
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'product-image';
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageWrapper.appendChild(optimizedPic);
      panel.appendChild(imageWrapper);
    }
    
    // Handle content
    const content = document.createElement('div');
    content.className = 'product-description';
    content.innerHTML = contentDiv.innerHTML;
    moveInstrumentation(contentDiv, content);
    panel.appendChild(content);
    
    // Add tab and panel
    tabList.appendChild(tab);
    contentContainer.appendChild(panel);
    
    // Add click handler
    tab.addEventListener('click', () => {
      // Update tabs
      tabList.querySelectorAll('button').forEach((t) => {
        t.setAttribute('aria-selected', 'false');
      });
      tab.setAttribute('aria-selected', 'true');
      
      // Update panels
      contentContainer.querySelectorAll('.product-panel').forEach((p) => {
        p.hidden = true;
      });
      panel.hidden = false;
    });
  });
  
  // Assemble block
  container.appendChild(tabList);
  container.appendChild(contentContainer);
  block.textContent = '';
  block.appendChild(container);
} 