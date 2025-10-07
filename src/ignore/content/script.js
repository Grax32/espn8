const selectedItemKey = "selectedItemKey";

function getSelectedTab() {
    return localStorage ? localStorage.getItem(selectedItemKey) : null;
}

function setSelectedTab(tabId) {
    if (localStorage) {
        localStorage.setItem(selectedItemKey, tabId);
    }
}

function forEachElement(selector, action) {
    var qry = document.querySelectorAll(selector);
    for (var i = 0; i < qry.length; i++) {
        action(qry[i]);
    }
}

function selectTab(tabSelector) {
    forEachElement(".tab", (el) => el.classList.remove("selected"));
    forEachElement(".tabButtons a", (el) => el.classList.remove("selected"));

    document.querySelector(".tabs " + tabSelector).classList.add("selected");
    document.querySelector(".tabButtons " + tabSelector).classList.add("selected");

    setSelectedTab(tabSelector);
}

window.addEventListener("load", function() {
    const tabId = getSelectedTab();
    if (tabId) {
        selectTab(tabId);
    }

    ["tab1", "tab2", "tab3", "tab4"].forEach((key) => {
        document.getElementsByClassName(key)[0].addEventListener("click", () => {
            selectTab("." + key);
        });
    });
});