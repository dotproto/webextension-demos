# Web storage in private browsing mode

This extension was created in order to better understand how Firefox's "private browsing mode" (PBM) affects web storage APIs and data retention. This mode is enabled by navigating to `about:settings#privacy` and changing the "History" option to "Never remember history".

In order to test PBM behavior, this extension has a set of functions that write data to (populate) and read data from (dump) the following storage APIs:

* WebExtensions: [`storage.local`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local)
* Web: [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
* Web: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
* Web: [Origin Private File System](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) (OPFS)

## Test procedure - Pre-test prep

In order to test data retention across mode switches, you will need to use [Firefox Nightly](https://www.firefox.com/en-US/download/all/desktop-nightly/) or [Firefox Developer Edition](https://www.firefox.com/en-US/download/all/desktop-developer/). After you have installed and started this version of the browser, you will need to **temporarily** disable XPI verification by navigating to `about:config`, searching for `xpinstall.signatures.required` and changing this setting to `false`.

Next, navigate to `about:addons`. In order to install this extension, you must first create a Zip archive of the contents of this directory. Once you've created that file, you can drag-and-drop it onto the `about:addons` page to install the extension.

Finally, you must grant the extension access to private browsing windows. Click the "Private Browsing Web Storage Test" extension on the `about:addons` page to view the extension's settings and make sure the "Run in Private Windows" option is set to "Allow".

## Test procedure

Very rough instructions

1. When testing from the extension's background context, use DevTools to execute `storage.all.populate()` and `storage.all.dump()` in the console.
2. To test a standalone page, click the extension's action button to open a test page. Use the "Populate" and "Dump" buttons to run tests. Storage output will be shown in-page.

## Compat note

In Chrome 150, you can only navigate ta tab to an extension page in incognito mode if:

1. The extension is set to use `"incognito": "split"`
2. The user has allowed the extension to run in incognito.
