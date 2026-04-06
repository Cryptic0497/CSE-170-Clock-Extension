// background.js

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// Installation defaults
// ---------------------------------------------------------------------------
=======
let timerState = {
  isRunning: false,
  phase: 'WORK', // 'WORK' or 'BREAK'
  timeRemaining: 0,
  workDuration: 60 * 60, // Default 1 hour in seconds
  breakDuration: 20 * 60, // Default 20 mins in seconds
};

let timerInterval = null;
let inactivityNotificationActive = false;
const inactivityNotificationId = 'focusguard_inactivity';

// The heartbeat function
function tick() {
  if (timerState.timeRemaining > 0) {
    timerState.timeRemaining--;
  } else {
    switchPhase();
  }
}
>>>>>>> parent of f55c65f (Merge branch 'main' into main)

function switchPhase() {
  if (timerState.phase === 'WORK') {
    timerState.phase = 'BREAK';
    timerState.timeRemaining = timerState.breakDuration;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png', // Requires this icon in your folder
      title: 'FocusGuard',
      message: 'Great job! Time for a break.'
    });
  } else {
    timerState.phase = 'WORK';
    timerState.timeRemaining = timerState.workDuration;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'FocusGuard',
      message: 'Break is over. Time to focus!'
    });
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_STATE') {
    sendResponse(timerState);
  } 
  
  else if (message.action === 'START') {
    if (!timerState.isRunning) {
      // Update durations based on user input
      timerState.workDuration = message.workTime;
      timerState.breakDuration = message.breakTime;
      
      // Only reset the timeRemaining if we are starting fresh
      if (timerState.timeRemaining === 0) {
        timerState.timeRemaining = timerState.workDuration;
        timerState.phase = 'WORK';
      }
      
      timerState.isRunning = true;
      timerInterval = setInterval(tick, 1000);
      sendResponse({ status: "started" });
    }
  } 
  
  else if (message.action === 'STOP') {
    timerState.isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    sendResponse({ status: "stopped" });
  }

  else if (message.action === 'RESET') {
    timerState.isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    timerState.timeRemaining = 0;
    timerState.phase = 'WORK';
    sendResponse(timerState);
  }

<<<<<<< HEAD
  // --- Countdown: get state ---
  if (message.action === 'COUNTDOWN_GET_STATE') {
    chrome.storage.local.get(['countdownState'], ({ countdownState }) => {
      const state = countdownState || {
        isRunning: false, remainingSeconds: 0, duration: 1500,
      };
      if (state.isRunning && state.endTime) {
        state.remainingSeconds = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
      }
      sendResponse(state);
    });
    return true;
  }

  // --- Countdown: start / resume ---
  if (message.action === 'COUNTDOWN_START') {
    chrome.storage.local.get(['countdownState'], ({ countdownState }) => {
      const state = countdownState || {};
      if (!state.isRunning) {
        const duration = message.duration;
        // Resume from paused remainder, or start fresh
        const remaining = (state.remainingSeconds > 0) ? state.remainingSeconds : duration;
        countdownStart(duration, remaining);
        sendResponse({ status: 'started' });
      } else {
        sendResponse({ status: 'already_running' });
      }
    });
    return true;
  }

  // --- Countdown: pause ---
  if (message.action === 'COUNTDOWN_PAUSE') {
    chrome.alarms.clear('countdownEnd');
    chrome.storage.local.get(['countdownState'], ({ countdownState }) => {
      if (countdownState && countdownState.isRunning && countdownState.endTime) {
        const remaining = Math.max(0, Math.round((countdownState.endTime - Date.now()) / 1000));
        chrome.storage.local.set({
          countdownState: {
            ...countdownState, isRunning: false, endTime: null, remainingSeconds: remaining,
          },
        });
      }
      sendResponse({ status: 'paused' });
    });
    return true;
  }

  // --- Countdown: reset ---
  if (message.action === 'COUNTDOWN_RESET') {
    chrome.alarms.clear('countdownEnd');
    const reset = {
      isRunning: false, endTime: null, remainingSeconds: 0,
      duration: message.duration || 1500,
    };
    chrome.storage.local.set({ countdownState: reset });
    sendResponse(reset);
  }

  // --- Session toggle ---
  if (message.action === 'SET_SESSION') {
    chrome.storage.sync.set({ isSessionActive: message.isActive });
    sendResponse({ status: 'ok', isActive: message.isActive });
  }

  // --- Reserved ---
  if (message.type === 'SHOW_NOTIFICATION') {
    sendResponse({ success: true });
  }
});
=======
  else if (message.action === 'SHOW_INACTIVITY_NOTIFICATION') {
    if (!inactivityNotificationActive) {
      inactivityNotificationActive = true;
      chrome.notifications.create(inactivityNotificationId, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'FocusGuard',
        message: 'No activity detected. Get back to work when you\'re ready.',
        requireInteraction: true
      });
    } else {
      console.log('[background] Inactivity notification already active, skipping');
    }
  }

  else if (message.action === 'SHOW_ACTIVITY_RESUMED') {
    if (inactivityNotificationActive) {
      inactivityNotificationActive = false;
      chrome.notifications.clear(inactivityNotificationId);
      console.log('[background] Activity resumed, cleared inactivity notification');
    }
  }

  else if (message.action === 'SHOW_BREAK_NOTIFICATION') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'FocusGuard',
      message: 'Great job! Time for a break.'
    });
  }

  else if (message.action === 'SHOW_WORK_NOTIFICATION') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'FocusGuard',
      message: 'Break is over. Time to focus!'
    });
  }

  else if (message.action === 'SHOW_BLACKLIST_NOTIFICATION') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'FocusGuard',
      message: `Distraction detected on ${message.domain}. Consider focusing on your work instead.`
    });
  }

  else if (message.action === 'SHOW_WHITELIST_NOTIFICATION') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'FocusGuard',
      message: `Off-topic site detected. Stay on track with your goals.`
    });
  }

  // Keep the message channel open for async responses
  return true; 
});
>>>>>>> parent of f55c65f (Merge branch 'main' into main)
