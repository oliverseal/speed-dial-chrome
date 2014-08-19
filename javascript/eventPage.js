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

// Watches for url's that exist in localStorage and can add thumbnail data to
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.selected && tab.status === "complete") {
		var imageData = JSON.parse(localStorage.getItem("entry_images"));
		if (imageData[btoa(tab.url)] !== undefined) {
			if (imageData[btoa(tab.url)].data.length === 0 || imageData[btoa(tab.url)].refresh === true) {
				chrome.tabs.captureVisibleTab({ format: "png" }, function(dataUrl) {
					if (chrome.runtime.lastError === undefined) {
						var image = document.createElement("img");
						image.src = dataUrl;
						image.onload = function() {
							var canvas = document.createElement("canvas");
							var width = image.width / 2;
							var height = image.height / 2;
							canvas.width = width - 20; // -20 to chop off the scrollbar being captured
							canvas.height = height;
							canvas.getContext("2d").drawImage(image, 0, 0, width, height);
							imageData[btoa(tab.url)].data = canvas.toDataURL("image/webp");
							imageData[btoa(tab.url)].refresh = false;
							localStorage.setItem("entry_images", JSON.stringify(imageData));
						};
					} else {
						console.log("Runtime error was: " + chrome.runtime.lastError);
					}
				});
			}
		}
	}
});
