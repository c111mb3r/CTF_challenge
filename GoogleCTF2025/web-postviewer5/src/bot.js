const puppeteer = require("puppeteer"); // ^22.10.0

const FLAG = process.env.FLAG || "CTF{dummy_flag}";
const PAGE_URL = "http://localhost:1338";

console.log(FLAG)

const sleep = (d) => new Promise((r) => setTimeout(r, d));

let browser;

const visit = async (url, log = () => { }) => {
  if (browser) {
    await browser.close();
    await sleep(2000);
    log("Terminated ongoing job.");
  }
  try {
    browser = await puppeteer.launch({
      browser: "chrome",
      headless: true,
      args: [
        "--user-data-dir=/tmp/chrome-userdata",
        "--breakpad-dump-location=/tmp/chrome-crashes",
        "--disable-features=HttpsFirstBalancedModeAutoEnable"
      ]
    });

    const ctx = await browser.createBrowserContext();

    const page = await ctx.newPage();
    await page.goto(PAGE_URL, {
      timeout: 2000,
    });

    const pageStr = await page.evaluate(
      () => document.documentElement.innerHTML
    );

    if (!pageStr.includes("Postviewer v5")) {
      const msg =
        "Error: Failed to load challenge page. Please contact admins.";
      log(msg);
      console.error(`Page:${pageStr}`);
      throw new Error(msg);
    }

    log("Adding admin's flag.");
    await page.evaluate((flag) => {
      const blob = new Blob([flag], { type: "text/plain" });

      window.postMessage(
        {
          type: "share",
          files: [
            {
              blob,
              cached: false,
              name: "flag.txt",
            },
          ],
        },
        "*"
      );
    }, FLAG);

    await sleep(1000);

    const bodyHTML = await page.evaluate(
      () => document.documentElement.innerHTML
    );

    if (!bodyHTML.includes("file-") && bodyHTML.includes(".txt")) {
      const msg = "Error: Something went wrong while adding the flag.";
      console.error(`Page:${bodyHTML}`);
      throw new Error(msg);
    }

    log("Successfully added the flag.");
    await page.close();

    log(`Visiting ${url}`);
    const playerPage = await ctx.newPage();

    await playerPage.goto(url, {
      timeout: 2000,
    });

    await sleep(5 * 60 * 1000);
  } catch (err) {
    log("Browser error");
    console.log(err);
  } finally {
    log("Browser closing");
    if (browser) await browser.close();
    browser = null;
  }
};

module.exports = { visit };
