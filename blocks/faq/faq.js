export default function decorate(block) {
  // Create FAQ list container
  const faqList = document.createElement('dl');
  faqList.className = 'faq-list';

  // Process each FAQ item
  [...block.children].forEach((row) => {
    const [questionDiv, answerDiv] = row.children;
    
    // Create question element
    const dt = document.createElement('dt');
    dt.className = 'faq-question';
    
    // Create h3 for the question
    const h3 = document.createElement('h3');
    h3.innerHTML = questionDiv.innerHTML;
    dt.appendChild(h3);
    
    // Create answer element
    const dd = document.createElement('dd');
    dd.className = 'faq-answer';
    dd.innerHTML = answerDiv.innerHTML;
    
    // Add click handler to toggle answer visibility
    dt.addEventListener('click', () => {
      const isExpanded = dt.getAttribute('aria-expanded') === 'true';
      dt.setAttribute('aria-expanded', !isExpanded);
      dd.setAttribute('aria-hidden', isExpanded);
    });
    
    // Set initial ARIA attributes
    dt.setAttribute('aria-expanded', 'false');
    dd.setAttribute('aria-hidden', 'true');
    
    // Add elements to FAQ list
    faqList.appendChild(dt);
    faqList.appendChild(dd);
  });

  // Replace block content with the new FAQ list
  block.textContent = '';
  block.appendChild(faqList);
} 