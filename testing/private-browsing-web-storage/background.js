browser.action.onClicked.addListener(() => {
  browser.tabs.create({url: browser.runtime.getURL('options.html')})
});

function log(line) {
  if (typeof line !== 'string')
    line = JSON.stringify(line);
  console.log(line);
}
