document.getElementById('display-private').innerText = browser.extension.inIncognitoContext;
const logDisplay = document.getElementById('display-log');
const clearButton = document.getElementById('clear-log');
clearButton.addEventListener('click', () => {
  logDisplay.innerText = '';
});

function log(line) {
  if (typeof line !== 'string')
    line = JSON.stringify(line);
  logDisplay.innerText += '\n' + line;
}

const populateAllButton = document.getElementById('populate-all');
populateAllButton.addEventListener('click', () => storage.all.populate());

const dumpAllButton = document.getElementById('dump-all');
dumpAllButton.addEventListener('click', () => storage.all.dump());
