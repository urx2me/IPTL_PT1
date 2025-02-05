const storiesContainer = document.getElementById('storiesContainer');
    const storyViewer = document.getElementById('storyViewer');
    const storyViewerContent = document.getElementById('storyViewerContent');
    const storyViewerTitle = document.getElementById('storyViewerTitle');
    const uploadContainer = document.getElementById('uploadContainer');
    const reactionContainer = document.getElementById('reactionContainer');
    let storyQueue = [];
    let currentStoryIndex = 0;
    let autoTimer;
    const reactionCounts = {};

    function toggleUploadOptions() {
      if (uploadContainer.style.display === "none" || uploadContainer.style.display === "") {
        uploadContainer.style.display = "block";
      } else {
        uploadContainer.style.display = "none";
      }
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
        const title = storyTitle || "Untitled Story";

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

        storyElement.addEventListener('click', () => {
          storyQueue = Array.from(storiesContainer.children)
            .filter(child => child !== storiesContainer.children[0])
            .map(child => ({
              src: child.querySelector('img, video').src,
              type: child.querySelector('img') ? 'image' : 'video',
              title: title,
              music: musicFile ? URL.createObjectURL(musicFile) : null
            }));

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
      reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1; 
      alert(`You reacted with ${reaction}! Total: ${reactionCounts[reaction]}`);
    }

    function showStory(index) {
      if (index < 0 || index >= storyQueue.length) {
        closeStory();
        return;
      }

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
    }

    function closeStory() {
      storyViewer.classList.remove('active');
      clearTimeout(autoTimer);
      storyViewerContent.innerHTML = ''; 
      reactionContainer.style.display = 'none'; 
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