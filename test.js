// Include Cropper.js library for image cropping
// Include ffmpeg.js (or manual trimming UI for videos)
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
await ffmpeg.load();


const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const uploadContainer = document.getElementById('uploadContainer');
const reactionContainer = document.getElementById('reactionContainer');
const editorContainer = document.getElementById('editorContainer'); // For cropping & trimming
const editCanvas = document.getElementById('editCanvas'); // Canvas for editing
let storyQueue = [];
let currentStoryIndex = 0;
let autoTimer;
const reactionCounts = {};

function toggleUploadOptions() {
  uploadContainer.style.display = uploadContainer.style.display === "none" ? "block" : "none";
}

function previewMedia(file) {
  const url = URL.createObjectURL(file);
  if (file.type.startsWith('image/')) {
    editImage(url, file);
  } else if (file.type.startsWith('video/')) {
    editVideo(url, file);
  }
}

function editImage(imageSrc, file) {
  editorContainer.style.display = 'block';
  const img = document.createElement('img');
  img.src = imageSrc;
  editCanvas.innerHTML = '';
  editCanvas.appendChild(img);
  
  const cropper = new Cropper(img, {
    aspectRatio: NaN,
    viewMode: 1,
    autoCropArea: 1,
    ready() {
      document.getElementById('applyEdit').onclick = function () {
        const croppedCanvas = cropper.getCroppedCanvas();
        croppedCanvas.toBlob(blob => {
          addStory(blob, 'image');
          editorContainer.style.display = 'none';
        });
      };
    }
  });
}

function editVideo(videoSrc, file) {
  editorContainer.style.display = 'block';
  editCanvas.innerHTML = `<video controls id='videoEditor'><source src='${videoSrc}' type='video/mp4'></video>`;
  
  document.getElementById('applyEdit').onclick = function () {
    const startTime = parseFloat(document.getElementById('startTime').value) || 0;
    const endTime = parseFloat(document.getElementById('endTime').value) || file.duration;
    
    // For advanced trimming, integrate ffmpeg.js here
    addStory(file, 'video');
    editorContainer.style.display = 'none';
  };
}

function addStory(file, type) {
  const storyElement = document.createElement('div');
  storyElement.classList.add('story');
  const url = URL.createObjectURL(file);

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = url;
    storyElement.appendChild(img);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = url;
    video.controls = false;
    storyElement.appendChild(video);
  }
  
  storyElement.addEventListener('click', () => showStory(url, type));
  storiesContainer.appendChild(storyElement);
}

function showStory(src, type) {
  storyViewerContent.innerHTML = '';
  storyViewerTitle.textContent = 'Viewing Story';
  
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    storyViewerContent.appendChild(img);
  } else {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    storyViewerContent.appendChild(video);
  }
  
  storyViewer.classList.add('active');
  reactionContainer.style.display = 'flex';
}
