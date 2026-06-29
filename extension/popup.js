const iframe = document.getElementById("shelf-frame");
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "flex";
  loader.style.opacity = "1";
  iframe.classList.remove("loaded");
}

function loadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    
    let url = "";
    let title = "";

    // Check if we can access the URL and it's not a restricted browser system page
    if (tab && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://") && !tab.url.startsWith("about:")) {
      url = encodeURIComponent(tab.url);
      title = encodeURIComponent(tab.title || "");
    }

    const baseUrl = "http://localhost:5174/";
    let frameUrl = `${baseUrl}?source=extension&layout=sidepanel`;
    if (url) {
      frameUrl += `&add_url=${url}&add_title=${title}`;
    }

    // Avoid redundant reloading if the iframe is already pointing to this URL
    if (iframe.src === frameUrl) return;

    showLoader();
    iframe.src = frameUrl;
  });
}

// When iframe loads, fade out loader
iframe.addEventListener("load", () => {
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
    iframe.classList.add("loaded");
  }, 250);
});

// Initial Load on opening sidebar
loadActiveTab();

// Listen for tab switching (user clicks on a different tab)
chrome.tabs.onActivated.addListener(() => {
  loadActiveTab();
});

// Listen for tab updates (user navigates to a new URL inside the current active tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    loadActiveTab();
  }
});
