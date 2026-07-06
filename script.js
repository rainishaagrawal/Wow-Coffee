const videoBox = document.getElementById('video-splash');
const mainVideo = document.getElementById('intro-video'); 
const skipBtn = document.getElementById('skip-btn');     
const mainSite = document.getElementById('smooth-scroll-wrapper');
const buffer = document.getElementById('scroll-buffer');
const cardsContainer = document.querySelector('.main2 .cards');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const interactiveLinks = document.querySelectorAll('[data-target]');

let videoOver = false; 
let targetScroll = 0;
let currentScroll = 0;
const speedFactor = 0.08; 

document.body.classList.add('stop-scroll');

function closeVideo() {
  if (videoOver) return; 
  videoOver = true; 
  
  videoBox.style.opacity = '0';
  videoBox.style.visibility = 'hidden';
  mainSite.style.opacity = '1';
  mainSite.style.visibility = 'visible';
  
  document.body.classList.remove('stop-scroll');
  updateBufferHeight();

  if (mainVideo) {
    mainVideo.pause();
  }

  triggerVisibleItems();
}

function updateBufferHeight() {
  if (window.innerWidth > 1024 && mainSite && buffer) {
    const siteHeight = mainSite.getBoundingClientRect().height;
    buffer.style.height = siteHeight + "px";
  } else if (buffer) {
    buffer.style.height = "auto";
  }
}

function triggerVisibleItems() {
  const items = document.querySelectorAll('.fade-item');
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      item.classList.add('visible');
    }
  });
}

function doSmoothScroll() {
  if (videoOver === true) {
    if (window.innerWidth > 1024) {
      targetScroll = window.scrollY; 
      currentScroll = currentScroll + (targetScroll - currentScroll) * speedFactor;
      mainSite.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;
      updateBufferHeight();
    } else {
      mainSite.style.transform = "none";
    }
    
    triggerVisibleItems();
  }
  requestAnimationFrame(doSmoothScroll);
}

const getScrollAmount = () => {
  return window.innerWidth <= 600 ? 280 : 340;
};

window.addEventListener('resize', updateBufferHeight);

if (mainVideo) {
  mainVideo.addEventListener('ended', closeVideo);
}

if (skipBtn) {
  skipBtn.addEventListener('click', closeVideo);
}

if (cardsContainer && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cardsContainer.scrollBy({
      left: -getScrollAmount(),
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cardsContainer.scrollBy({
      left: getScrollAmount(),
      behavior: 'smooth'
    });
  });
}

window.addEventListener('scroll', () => {
  if (window.innerWidth <= 1024 && videoOver) {
    triggerVisibleItems();
  }
});

interactiveLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const targetId = link.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      if (window.innerWidth > 1024) {
        const targetTopPosition = targetSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetTopPosition,
          behavior: 'smooth'
        });
      } else {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

doSmoothScroll();