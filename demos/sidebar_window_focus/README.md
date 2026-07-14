# Sidebar Window Focus Demo

This demo provides a concrete implementation of

## Browser compatibility

Browser | Tested in | Works? | Notes
------- | --------- | ------ | ---
Chrome  | 150       | ❌     | Blocked by https://crbug.com/40925107
Firefox | 152       | ✅     | ---
Safari  | 26.5      | ❌     | Doesn't support any sidebar APIs

## Implementation constraints

In Firefox, the `sidebarAction` namespace doesn't have `onOpened` or `onClosed`
events. We can't work around this by adding bookkeeping logic to `open()` and
`close()` calls because those methods are not the only way to trigger those
operations. We could poll `runtime.getContexts()` for changes, but that's
unnecessarily wasteful.

In order for a `windows.onFocusChanged` listener to determine the current
focused sidebar, we need a way to corelate `windowId` received with a specific
sidebar context and to notify sidebar. Unfortunately, there's currently no good
cross-browser way to do this. It's possible to use `runtime.getContexts()` to
get a list of sidebars contexts, but sidebars don't currently have meaningful
`windowId` values in Chrome (crbug.com/40925107). As a result, we can't limit
the `getContexts()` call to a specific `windowId` and if we get all sidebar
contexts, we can't check the `windowId` on the returned context objects. These
objects have `contextId` properties in Chrome and Firefox, but there are no
other APIs that work with those IDs.

To wok around this limitation, this demo currently uses a hack to uniquely
identify each sidebar: a `uuid` query parameter. When the sidebar page loads, it
will execute `redirect.js`, which checks if the current page has a `uuid`
parameter and if not immediately loads the same URL with that parameter. This
should occur before any other page scripts execute, preventing incomplete loads
from having unintended side effects.
