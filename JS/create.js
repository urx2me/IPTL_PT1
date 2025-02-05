const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const uploadContainer = document.getElementById('uploadContainer');
const reactionContainer = document.getElementById('reactionContainer');
let storyQueue = [];
let currentStoryIndex = 0;
let autoTimer;
const storyReactions = {}; // Store reactions per story

function toggleUploadOptions() {
    uploadContainer.style.display = (uploadContainer.style.display === "none" || uploadContainer.style.display === "") ? "block" : "none";
}

function addStories() {
  const mediaInput = document.getElementById('mediaInput');
  const storyTitleInput = document.getElementById('storyTitle');
  const musicInput = document.getElementById('musicInput');
  const files = Array.from(mediaInput.files);
  const storyTitle = storyTitleInput.value.trim();
  const musicFile = musicInput.files[0];

  if (files.length === 0) {
      alert('Please select at least one image or video.');
      return;
  }

  files.forEach((file) => {
      const storyElement = document.createElement('div');
      storyElement.classList.add('story');
      const url = URL.createObjectURL(file);
      const title = storyTitle || "Untitled Story";  // Get the title for this specific story

      if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = url;
          storyElement.appendChild(img);
      } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = url;
          video.controls = false;
          storyElement.appendChild(video);
      } else {
          alert('Unsupported file type.');
          return;
      }

      // Add story with specific title to the queue
      storyQueue.push({
          src: url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          title: title,
          music: musicFile ? URL.createObjectURL(musicFile) : null
      });

      storyElement.addEventListener('click', () => {
          currentStoryIndex = storyQueue.findIndex(item => item.src === url);
          showStory(currentStoryIndex);
      });

      storiesContainer.appendChild(storyElement);
      storyTitleInput.value = '';
      mediaInput.value = '';
      musicInput.value = '';
  });
}

function handleReaction(reaction) {
    if (!storyQueue[currentStoryIndex]) return;

    const storyId = storyQueue[currentStoryIndex].src;
    if (!storyReactions[storyId]) {
        storyReactions[storyId] = {};
    }
    storyReactions[storyId][reaction] = (storyReactions[storyId][reaction] || 0) + 1;

    const totalStoryReactions = Object.values(storyReactions[storyId]).reduce((sum, count) => sum + count, 0);

    showCustomAlert(
        `You reacted with ${reaction}!<br>
        <strong>Total for this reaction:</strong> ${storyReactions[storyId][reaction]}<br>
        <strong>Total reactions for this story:</strong> ${totalStoryReactions}`
    );
}

function showCustomAlert(message) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.innerHTML = message;
    alertBox.style.display = "block";
}

function closeCustomAlert() {
    document.getElementById("customAlert").style.display = "none";
}

function showStory(index) {
    if (index < 0 || index >= storyQueue.length) {
        closeStory();
        return;
    }

    currentStoryIndex = index;
    const story = storyQueue[index];
    storyViewerContent.innerHTML = '';
    storyViewerTitle.textContent = story.title;

    if (story.type === 'image') {
        const img = document.createElement('img');
        img.src = story.src;
        storyViewerContent.appendChild(img);
    } else if (story.type === 'video') {
        const video = document.createElement('video');
        video.src = story.src;
        video.autoplay = true;
        video.controls = true;
        storyViewerContent.appendChild(video);
    }

    storyViewer.classList.add('active');
    reactionContainer.style.display = 'flex';
    displayStoryReactions(story.src);
}

function closeStory() {
    storyViewer.classList.remove('active');
    storyViewerContent.innerHTML = ''; 
    reactionContainer.style.display = 'none'; 
    clearTimeout(autoTimer);
}

function displayStoryReactions(storyId) {
  let reactionSummary = `<strong>Title: </strong>${storyQueue[currentStoryIndex].title}<br><strong>Reactions: </strong>`;
  if (storyReactions[storyId]) {
      for (const [reaction, count] of Object.entries(storyReactions[storyId])) {
          reactionSummary += `${reaction} (${count}) `;
      }
  } else {
      reactionSummary += "None yet!";
  }

  document.getElementById("storyViewerTitle").innerHTML = reactionSummary;
}

function resetAutoTimer() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
        navigateStory(1);
    }, 5000);
}

function navigateStory(direction) {
    currentStoryIndex += direction;
    showStory(currentStoryIndex);
}