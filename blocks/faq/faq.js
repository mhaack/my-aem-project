import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create FAQ list container as ul
  const faqList = document.createElement('ul');
  faqList.className = 'faq-list';
  

  // Process each FAQ item
  [...block.children].forEach((row) => {
    const [questionDiv, answerDiv] = row.children;
  
    // Create list item to contain both question and answer
    const li = document.createElement('li');
    li.className = 'faq-item';
    
    // Create question element as a button
    const questionBtn = document.createElement('button');
    moveInstrumentation(row, li);
    questionBtn.className = 'faq-question';
    questionBtn.innerHTML = questionDiv.innerHTML; // Direct use of question content
    
    // Create answer element as div
    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.innerHTML = answerDiv.innerHTML;
    
    // Add click handler to toggle answer visibility
    questionBtn.addEventListener('click', () => {
      const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';
      questionBtn.setAttribute('aria-expanded', !isExpanded);
      answer.setAttribute('aria-hidden', isExpanded);
    });
    
    // Set initial ARIA attributes
    questionBtn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    
    moveInstrumentation(questionDiv, questionBtn);
    moveInstrumentation(answerDiv, answer);
    
    // Add elements to list item
    li.appendChild(questionBtn);
    li.appendChild(answer);
    faqList.appendChild(li);
  });

  // Replace block content with the new FAQ list
  block.textContent = '';
  block.appendChild(faqList);
} 