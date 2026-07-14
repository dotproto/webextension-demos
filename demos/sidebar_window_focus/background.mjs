// Send sidebar updates when the background context starts
async function main() {
  const current = await browser.windows.getCurrent();
  sendCurrentSidebarUrlUpdate(current.id);
}
main();

// Open panel on action click
if (browser.sidebarAction) {
  // FIREFOX
  browser.action.onClicked.addListener(() => {
    browser.sidebarAction.toggle();
  });
} else if (browser.sidePanel) {
  // CHROME
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

browser.runtime.onInstalled.addListener(async () => {
  // Try to show the sidebar on install in Chrome. As of writing this
  // (2026-07-10) Chrome requires user activation, but that may change in the
  // future.
  try {
    await browser.sidePanel?.open({});
  } catch (error) {
    if (error.message === '`sidePanel.open()` may only be called in response to a user gesture.') {
      // Expected, noop
    }
    throw error;
  }
});

// We register a listener for this event so that each individual sidebar page
// doesn't have to.
browser.windows.onFocusChanged.addListener(async (windowId) => {
  // Window ID may be <= 0 when DevTools or other special windows are focused
  if (windowId > 0)
    sendCurrentSidebarUrlUpdate(windowId)
});

// Send the current window's sidebar URL to all open sidebars.
async function sendCurrentSidebarUrlUpdate(windowId) {
  // BROWSER BUG (crbug.com/40925107): `current.windowId` is always -1 in
  // Chrome.
  const [current] = await browser.runtime.getContexts({
    windowIds: [windowId],
    contextTypes: [browser.runtime.ContextType.SIDE_PANEL],
  });

  browser.runtime.sendMessage({
    type: "set-active-window",
    currentUrl: current?.documentUrl,
  }).catch(async (error) => {
    if (error.message === 'Could not establish connection. Receiving end does not exist.') {
      // We will get this error if there are no other open extension contexts to
      // receive the message. Let's validate that.
      const all = await browser.runtime.getContexts({
        contextTypes: [browser.runtime.ContextType.SIDE_PANEL],
      });
      if (all.length !== 0) {
        throw new Error(`Could not establish connection, but ${all.length} sidebars are open.`);
      }
    } else {
      // Unexpected error, re-throw to surface it
      throw error;
    }
  });
}
