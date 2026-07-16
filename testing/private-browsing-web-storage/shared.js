const storage = {};

storage.all = {

  async populate() {
    const keys = Object.keys(storage).filter(k => k != 'all');
    log(`## Populating storage areas (incognito: ${browser.extension.inIncognitoContext}) ##`)
    for (const storageType of keys) {
      log(`Populating ${storageType}`);
      try {
        await storage[storageType].populate();
      } catch (e) {
        log(`${e.name}: ${e.message}`);
        console.error(e);
      }
    }
  },

  async dump() {
    const keys = Object.keys(storage).filter(k => k != 'all');
    log(`## Dumping storage areas (incognito: ${browser.extension.inIncognitoContext}) ##`)
    for (const storageType of keys) {
      log(`Dumping ${storageType}`);
      try {
        const data = await storage[storageType].dump();
        log(data);
      } catch (e) {
        log(`${e.name}: ${e.message}`);
        console.error(e);
      }
    }
  },

};

storage['browser.storage'] = {

  async populate() {
    return browser.storage.local.set({
      area: 'browser.storage',
      key: 'value',
      timestamp: Date.now(),
    });
  },

  async dump() {
    const data = await browser.storage.local.get(['area', 'key', 'timestamp']);
    return Object.entries(data);
  },

};

storage.localStorage = {

  async populate() {
    if (typeof self.localStorage === 'undefined')
      return log('Error: localStorage is undefined');

    self.localStorage.setItem("area", "localStorage");
    self.localStorage.setItem("key", "value");
    self.localStorage.setItem("timestamp", Date.now());
  },

  async dump() {
    const entries = [];
    let i = 0;
    let key;
    while (true) {
      key = self.localStorage.key(i++);
      if (key === null) {
        break;
      }
      const value = self.localStorage.getItem(key);
      entries.push([key, value]);
    }
    return entries;
  },

};

storage.idb = {

  async populate() {
    const request = self.indexedDB.open("idb-test", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("store");
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const trans = db.transaction(["store"], "readwrite");
      const store = trans.objectStore("store");
      store.put("idb", "area");
      store.put("value", "key");
      store.put(Date.now(), "timestamp");
    };
  },

  async dump() {
    return new Promise(resolve => {
      const request = self.indexedDB.open("idb-test", 1);
      request.onsuccess = (event) => {
        const entries = [];
        const db = event.target.result;

        const trans = db.transaction(["store"], "readwrite");
        const store = trans.objectStore("store");
        const cursorReq = store.openCursor();

        cursorReq.onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
              entries.push([cursor.key, cursor.value]);
              cursor.continue();
          }
        };

        trans.oncomplete = () => {
          resolve(entries);
        };
      };
    });
  },

};

storage.opfs = {

  async populate() {
    const root = await navigator.storage.getDirectory();

    const entries = [
      ['area', 'opfs'],
      ['key', 'value'],
      ['timestamp', Date.now()],
    ];

    for (const [name, contents] of entries) {
      const fileHandle1 = await root.getFileHandle(name, { create: true });
      const writable1 = await fileHandle1.createWritable();
      await writable1.write(contents);
      await writable1.close();
    }
  },

  async dump() {
    const entries = [];
    const root = await navigator.storage.getDirectory();
    const textDecoder = new TextDecoder();

    for await (const [name, handle] of root) {
      const file = await handle.getFile();
      const content = await file.text();
      entries.push([name, content]);
    }
    return entries;
  },

};
