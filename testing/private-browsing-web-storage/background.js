// Required by shared.js
function log(line) {
  if (typeof line !== 'string')
    line = JSON.stringify(line);
  console.log(line);
}

////////////////////////////////////////////////////////////////////////////////
// Show the storage test page on Action button click

browser.action.onClicked.addListener(() => {
  openTestPage();
});

function openTestPage() {
  const incognito = browser.extension.inIncognitoContext;
  const url = browser.runtime.getURL('storage-test.html');

  browser.windows.create({ url, incognito });
}

////////////////////////////////////////////////////////////////////////////////
// Expose test operations as context menu options on the Action button

browser.runtime.onInstalled.addListener(async () => {
  await browser.contextMenus.removeAll();
  const contexts = ['action'];
  browser.contextMenus.create({
    title: 'Populate all',
    contexts,
    id: 'populate-all'
  });
  browser.contextMenus.create({
    title: 'Dump all',
    contexts,
    id: 'dump-all'
  });
  browser.contextMenus.create({
    // title: 'sep-1',
    contexts,
    type: 'separator',
    id: 'sep-1'
  });
  browser.contextMenus.create({
    title: 'Open test page',
    contexts,
    id: 'test-page'
  });

});

browser.contextMenus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case 'populate-all':
      storage.all.populate();
      break;
    case 'dump-all':
      storage.all.dump();
      break;
    case 'test-page':
      openTestPage();
      break;
    default:
      throw new Error(`Unknown context menu ID "${info.menuItemId}"`);
      break;
  }
});
