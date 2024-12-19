import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  
  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-hero-container';
  
  // Create video element
  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  
  // Add source if provided
  if (config.videoUrl) {
    const source = document.createElement('source');
    source.src = config.videoUrl;
    source.type = 'video/mp4';
    video.appendChild(source);
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'video-hero-overlay';
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'video-hero-content';
  
  // Move existing content
  while (block.firstChild) {
    content.appendChild(block.firstChild);
  }
  
  // Assemble the block
  videoContainer.appendChild(video);
  block.appendChild(videoContainer);
  block.appendChild(overlay);
  block.appendChild(content);
} 