import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-hero-container';
  
  // Create video element
  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  
  // Get all direct child divs
  const rows = [...block.children];
  
  // First div contains video URL
  const videoLink = rows[0]?.querySelector('a');
  if (videoLink) {
    const source = document.createElement('source');
    source.src = videoLink.href;
    source.type = 'video/mp4';
    video.appendChild(source);
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'video-hero-overlay';
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'video-hero-content';
  
  // Second div contains subtitle
  const subtitle = rows[1]?.querySelector('div');
  if (subtitle) {
    const heading = document.createElement('h2');
    heading.textContent = subtitle.textContent.trim();
    heading.className = 'video-hero-subtitle';
    content.appendChild(heading);
  }
  
  // Third div contains main title
  const titleElement = rows[2]?.querySelector('h1');
  if (titleElement) {
    const title = document.createElement('div');
    title.className = 'video-hero-title';
    title.innerHTML = titleElement.innerHTML;
    content.appendChild(title);
  }
  
  // Assemble the block
  videoContainer.appendChild(video);
  block.textContent = '';
  block.appendChild(videoContainer);
  block.appendChild(overlay);
  block.appendChild(content);
} 