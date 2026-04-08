document.addEventListener('DOMContentLoaded', () => {

  // ─── HELPER (defined first so it's available everywhere below) ────────────

  function setCardActive(card, isActive) {
    const statusText = card.querySelector('.status-text');
    if (isActive) {
      card.classList.add('active');
      statusText.textContent = 'ON';
    } else {
      card.classList.remove('active');
      statusText.textContent = 'OFF';
    }
  }




  const audioPlayers = {};  
  const soundCards   = document.querySelectorAll('.sound-card');

  soundCards.forEach(card => {
    const soundName = card.dataset.sound;
    if (!audioPlayers[soundName]) {
      const audio  = new Audio(`sounds/${soundName}.mp3`);
      audio.loop   = true;
      audio.volume = 0.5;
      audioPlayers[soundName] = audio;
    }
  });




  const STORAGE_KEY = 'soundscapeMixerState';
  const savedState  = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  // Sounds that were playing when the page was last closed
  const pendingResume = new Set();

  soundCards.forEach(card => {
    const soundName  = card.dataset.sound;
    const audio      = audioPlayers[soundName];
    const slider     = card.querySelector('.volume-slider');
    const muteToggle = card.querySelector('.mute-toggle');
    const state      = savedState[soundName];

    if (!state) return;

    // Restore volume
    const vol    = state.volume ?? 0.5;
    audio.volume = vol;
    slider.value = vol;

    // Restore mute
    if (state.muted) {
      audio.muted = true;
      muteToggle.classList.remove('bi-volume-up-fill');
      muteToggle.classList.add('bi-volume-mute-fill', 'muted');
    }

    // Restore visual playing state — actual audio resumes on first user click
    if (state.isPlaying) {
      pendingResume.add(soundName);
      setCardActive(card, true);
    }
  });

  

  soundCards.forEach(card => {
    const soundName  = card.dataset.sound;
    const audio      = audioPlayers[soundName];
    const playBtn    = card.querySelector('.play-btn');
    const pauseBtn   = card.querySelector('.pause-btn');
    const slider     = card.querySelector('.volume-slider');
    const muteToggle = card.querySelector('.mute-toggle');

    // PLAY — also flushes any pending-resume tracks on first interaction
    playBtn.addEventListener('click', () => {
      // Resume all tracks that were playing before page reload
      if (pendingResume.size > 0) {
        pendingResume.forEach(name => {
          audioPlayers[name].play().catch(() => {});
        });
        pendingResume.clear();
      }

      audio.play().catch(() => {});
      setCardActive(card, true);
    });

    // PAUSE
    pauseBtn.addEventListener('click', () => {
      audio.pause();
      setCardActive(card, false);
    });

    // VOLUME — live mapping
    slider.addEventListener('input', () => {
      audio.volume = parseFloat(slider.value);
    });

    // MUTE TOGGLE
    muteToggle.addEventListener('click', () => {
      audio.muted = !audio.muted;
      if (audio.muted) {
        muteToggle.classList.remove('bi-volume-up-fill');
        muteToggle.classList.add('bi-volume-mute-fill', 'muted');
      } else {
        muteToggle.classList.remove('bi-volume-mute-fill', 'muted');
        muteToggle.classList.add('bi-volume-up-fill');
      }
    });
  });




  window.addEventListener('beforeunload', () => {
    const state = {};
    soundCards.forEach(card => {
      const soundName = card.dataset.sound;
      const audio     = audioPlayers[soundName];
      const slider    = card.querySelector('.volume-slider');
      state[soundName] = {
        isPlaying : !audio.paused,
        volume    : parseFloat(slider.value),
        muted     : audio.muted,
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });

});