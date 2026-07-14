const sidebarStateEl = document.getElementById('sidebar-state');
let lastFocusedSidebarUrl = '';
let sidebarActiveState = true;

// The core of the demo: this function handles changes between "active" and
// "inactive" states in the sidebar.
function updateActiveState(isActive) {
  sidebarActiveState = isActive;

  if (isActive) {
    document.body.style.background = 'LightGreen';
    sidebarStateEl.innerText = 'ACTIVE';
  } else {
    document.body.style.background = 'LightSalmon';
    sidebarStateEl.innerText = 'INACTIVE';
  }
}

// Set initial active state on page load
async function main() {
  const [focused, current] = await Promise.all([
    browser.windows.getLastFocused(),
    browser.windows.getCurrent()
  ]);

  sidebarActiveState = current.id === focused.id;
  updateActiveState(sidebarActiveState);
}
main();

// Handle messages from the background when the current focused window changes
browser.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'set-active-window') {
    lastFocusedSidebarUrl = message.currentUrl;
    const isActive = lastFocusedSidebarUrl === window.location.href;
    updateActiveState(isActive);
  }
});

// "active" state can also be affected by the sidebar's visibility (window is
// minimized, virtual desktop no longer visible, etc.)
const visibilityStateEl = document.getElementById('visibility-state');
document.addEventListener('visibilitychange', (event) => {
  if (document.visibilityState === 'hidden') {
    visibilityStateEl.innerText = document.visibilityState.toUpperCase();
    updateActiveState(false);
  } else if (document.visibilityState === 'visible') {
    const isActive = lastFocusedSidebarUrl === window.location.href;
    updateActiveState(isActive);
  }
});
