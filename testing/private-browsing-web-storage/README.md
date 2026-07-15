# Web storage in private browsing mode

## Instructions

Very rough instructions

1. When testing from the extension's background context, use DevTools to execute `storage.all.populate()` and `storage.all.dump()` in the console.
2. To test a standalone page, click the extension's action button to open a test page. Use the "Populate" and "Dump" buttons to run tests. Storage output will be shown in-page.

## Compat note

In Chrome 150, you can only navigate to an extension page in incognito mode if:

1. The extension is set to use `"incognito": "split"`
2. The user has allowed the extension to run in incognito.
