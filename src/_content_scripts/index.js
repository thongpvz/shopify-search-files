import jsStringEscape from "js-string-escape";
import "@src/scss/main.scss";

document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="tool-shopify-wrap">
        <div id="tool-shopify-count-file">
            <span id="tool-shopify-total-current-file"></span>
            /
            <span id="tool-shopify-total-file"></span>
        </div>

        <div id="tool-shopify-alert">Not found data!</div>

        <ul id="tool-shopify-display"></ul>

        <button id="tool-shopify-btn">Get Files</button>

        <div id="tool-shopify-search">
            <input type="text" />
        </div>
    </div>`
);

const excludeExtension = [
    ".svg",
    ".svg.liquid",
    ".png",
    ".png.liquid",
    ".js",
    ".scss",
    ".scss.liquid",
    ".css",
    ".css.liquid",
    ".js.liquid",
    ".json",
    ".json.liquid",
    ".oet",
    ".oet.liquid",
    ".eot",
    ".eot.liquid",
    ".ttf",
    ".ttf.liquid",
    ".woff",
    ".woff.liquid",
    ".jpg",
    ".jpg.liquid",
    ".gif",
    ".gif.liquid",
    ".jpeg",
    ".jpeg.liquid"
];

function filterFileExtension(fileName) {
    for (var i = 0; i < excludeExtension.length; i++) {
        if (fileName.indexOf(excludeExtension[i]) > -1) {
            return false;
        }
    }

    return true;
}

let arrFiles = [];
// let totalFile = 0;
let totalCurrentFile = 0;

const elTotalCurrentFile = document.getElementById(
    "tool-shopify-total-current-file"
);
const elTotalFileWrap = document.getElementById("tool-shopify-count-file");
const elTotalFile = document.getElementById("tool-shopify-total-file");
const elDisplay = document.getElementById("tool-shopify-display");
const elAlert = document.getElementById("tool-shopify-alert");
const elBtn = document.getElementById("tool-shopify-btn");
const elSearch = document.getElementById("tool-shopify-search");
const elInput = document.querySelector("#tool-shopify-search input");

elBtn.addEventListener("click", async () => {
    const aList = document.querySelectorAll(".asset-listing-theme-file");

    const files = [...aList].filter(item => {
        const dataAssetKey = item.getAttribute("data-asset-key");
        const isExclude = filterFileExtension(dataAssetKey);
        return isExclude;
    });

    if (files.length === 0) {
        elAlert.style.display = "block";
        elSearch.style.display = "none";
    } else {
        elAlert.style.display = "none";
        await fetchFile(files);
        elBtn.style.cssText = `opacity: 0.5; pointer-events: none;`;
        elSearch.style.display = "block";
    }
});

elInput.addEventListener("keyup", e => {
    let value = jsStringEscape(e.target.value.trim());
    value = value.replace(/</g, "\\u003c");
    value = value.replace(/>/g, "\\u003e");
    value = value.replace(/\//g, "\\/");

    const tempArrayFiles = [...arrFiles];
    elDisplay.innerHTML = "";

    const result = tempArrayFiles.filter(contentTextFile => {
        if (contentTextFile.data.indexOf(value) > -1) {
            renderFile(contentTextFile.name, elDisplay);
            return true;
        }
    });

    elTotalCurrentFile.innerHTML = result.length;
});

elTotalFileWrap.addEventListener("click", () => {
    elDisplay.classList.toggle("hide");
});

function renderFile(text, contain) {
    const node = document.createElement("LI");
    const textnode = document.createTextNode(text);
    node.appendChild(textnode);
    contain.appendChild(node);

    node.addEventListener("click", e => {
        const fileName = e.target.textContent;
        const elFile = document.querySelector(
            `a[data-asset-key="${fileName}"]`
        );
        elFile.click();
    });
}

async function fetchFile(files) {
    const shopID = await getShopID();

    if (!shopID) {
        elAlert.style.display = "block";
        return;
    }

    elTotalFile.innerHTML = files.length;
    elTotalFileWrap.style.display = "inline";

    const dataFiles = await Promise.all(
        files.map(file => {
            return new Promise(async resolve => {
                const dataAssetKey = file.getAttribute("data-asset-key");
                const response = await getDOMFromFile(shopID, dataAssetKey);

                if (response) {
                    renderFile(dataAssetKey, elDisplay);
                    totalCurrentFile++;
                    elTotalCurrentFile.innerHTML = totalCurrentFile;

                    arrFiles.push({
                        name: dataAssetKey,
                        data: response
                    });
                }

                resolve(response);
            });
        })
    );

    return dataFiles;
}

async function getDOMFromFile(shopID, dataAssetKey) {
    const url = `https://${window.location.host}/admin/themes/${shopID}/assets`;
    const _url = new URL(url);
    _url.searchParams.append("asset[key]", dataAssetKey);

    try {
        const result = await fetch(_url, {
            cache: "no-cache",
            headers: {
                Accept: "application/json, text/javascript, */*; q=0.01",
                Connection: "keep-alive",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-Shopify-Web": 1
            }
        });

        var response = await result.text();
        return response;
    } catch (error) {
        console.log("Error: ", error);
        return false;
    }
}

async function getShopID() {
    try {
        const url = `https://${window.location.host}/shop.json`;
        const result = await fetch(url);
        const res = await result.text();

        const regex = /Shopify.theme = (.*?);$/m;
        const ex = regex.exec(res);
        const shopID = JSON.parse(ex[1]).id;

        return shopID;
    } catch (error) {
        return null;
    }
}
