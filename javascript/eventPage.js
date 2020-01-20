// because tabs sometimes redirect
const LOADING_TABS = {};

// Restore settings from chrome.storage.sync API
function restoreFromSync() {
  chrome.storage.sync.get(null, function(sync_object) {
    Object.keys(sync_object).forEach(function(key) {
      localStorage.setItem(key, sync_object[key]);
    });
    window.location.reload();
  });
}

// Sync settings to chrome.storage.sync API
function syncToStorage() {
  var settings_object = {};
  Object.keys(localStorage).forEach(function(key) {
    if (key !== "entry_images") {
      settings_object[key] = localStorage[key];
    }
  });
  chrome.storage.sync.set(settings_object);
}

// Listen for sync events and update from synchronized data
if (localStorage.getItem("enable_sync") === "true") {
  chrome.storage.onChanged.addListener(function() {
    restoreFromSync();
  });
}

chrome.runtime.onMessage.addListener(function({type, canvasData, urlHash}, sender, sendResponse) {
  if (type === "tabPreviewImageReady") {
    const bookmarksDataset = JSON.parse(localStorage.getItem("entry_images"));
    bookmarksDataset[urlHash].data = canvasData;
    bookmarksDataset[urlHash].updated = new Date().valueOf();
    localStorage.setItem("entry_images", JSON.stringify(bookmarksDataset));
  }
});

// Watches for url's that exist in localStorage and can add thumbnail data to
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  const bookmarksDataset = JSON.parse(localStorage.getItem("entry_images"));
  const tabURLHash = btoa(tab.url);
  const tabPreviewData = bookmarksDataset[tabURLHash];
  const now = new Date().valueOf();
  // sometimes tab redirect from the bookmark, so we track it until it gets there.
  if (tabPreviewData !== undefined && LOADING_TABS[tab.id] === undefined && tab.status === "loading") {
    LOADING_TABS[tab.id] = {
      started: now,
      urlHash: tabURLHash,
    };
  } else if (LOADING_TABS[tab.id] && tab.status === "complete") {
    const loadedTab = LOADING_TABS[tab.id];
    const bookmarkData = bookmarksDataset[loadedTab.urlHash];
    // sometimes the tab might redirect, so in about 1 second, then we'll use this same tab to render the screenshot.
    if (bookmarkData !== undefined) {
      // default to a day
      const refreshRate = (parseInt(localStorage.getItem("preview_refresh_rate"), 10) || 86400) * 1000;
      let shouldRefresh = bookmarkData.refresh ||
        (now - (bookmarkData.updated || now - refreshRate)) >= refreshRate

      if (bookmarkData.data.length === 0 || shouldRefresh) {
        const entryRatio = bookmarkData.entryRatio || (10/16);
        // short timeout so we can let scrolling/redirecting finish up
        setTimeout(function(){
          chrome.tabs.executeScript(tabId, {
            file: "javascript/html2canvas.min.js"},
            () => {
              // after the page is loaded for a second or so (to allow for anchor jumping), screenshot it at the scroll
              chrome.tabs.executeScript(tabId, {
                  code: `setTimeout(html2canvas(document.body, {
                    height: ${Math.floor(1280 * entryRatio)},
                    width: 1280,
                    scrollX: window.pageXOffset,
                    scrollY: window.pageYOffset,
                    logging: false,
                    imageTimeout: 4000,
                    removeContainer: true,
                    async: true,
                  }).then(canvas => {chrome.runtime.sendMessage({
                    type: "tabPreviewImageReady",
                    tabId: ${tabId},
                    urlHash: "${loadedTab.urlHash}",
                    canvasData: canvas.toDataURL("image/webp"),
                  })}), 2000);`
                },
                // callback is here for debugging
                () => {}
              );
            }
          );
        }, 500);
      }
    }
    delete LOADING_TABS[tab.id];
  }
});
