import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create testimonials grid container
  const gridContainer = document.createElement('div');
  gridContainer.className = 'testimonials-grid';
  
  // Process each testimonial
  [...block.children].forEach((testimonial) => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    moveInstrumentation(testimonial, testimonialCard);
    
    // Handle author image
    const img = testimonial.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'testimonial-image';
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageWrapper.appendChild(optimizedPic);
      testimonialCard.appendChild(imageWrapper);
    }
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'testimonial-content';
    
    // Handle quote
    const quote = testimonial.querySelector('p');
    if (quote) {
      const quoteText = document.createElement('blockquote');
      quoteText.className = 'testimonial-quote';
      quoteText.innerHTML = quote.innerHTML;
      moveInstrumentation(quote, quoteText);
      contentContainer.appendChild(quoteText);
    }
    
    // Handle author name
    const author = testimonial.querySelector('h4');
    if (author) {
      const authorName = document.createElement('cite');
      authorName.className = 'testimonial-author';
      authorName.textContent = author.textContent;
      moveInstrumentation(author, authorName);
      contentContainer.appendChild(authorName);
    }
    
    testimonialCard.appendChild(contentContainer);
    gridContainer.appendChild(testimonialCard);
  });
  
  // Replace block content
  block.textContent = '';
  block.appendChild(gridContainer);
} 