const puppeteer = require('puppeteer');

/**
 * This code runs the same as running the following in the browser console
 *
 * document.querySelector('#iframewrapper iframe')
 *  .contentDocument.querySelector('body > iframe')
 *  .contentDocument.querySelector('div.w3-bar > div > a:nth-child(2)')
 *  .click();
 */

/**
 * @param {import('puppeteer').ElementHandle} iframe The IFrame for which to
 * return a content frame
 */
async function contentFrame(iframe) {
  return (await iframe) && (await iframe).contentFrame();
}

async function main() {
  // Headless: false makes the browser visible
  const browser = await puppeteer.launch({ headless: false });

  try {
    const page = await browser.newPage();
    console.log('Waiting for page to load...');
    await page.goto(
      'https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_iframe'
    );

    console.log('Find the root IFrame');
    const iframe1 = await contentFrame(await page.$('#iframewrapper iframe'));
    if (!iframe1) return console.log('IFrame 1 not found');

    console.log('Find the child IFrame');
    const iframe2 = await contentFrame(await iframe1.$('body > iframe'));
    if (!iframe2) return console.log('IFrame 2 not found');

    console.log('Find the button');
    const button = await iframe2.waitForSelector(
      'div.w3-bar > div > a:nth-child(2)',
      { visible: true, timeout: 500 }
    );
    if (!button) return console.log('Button not found');

    // Click the button and wait a second (5 times)
    for (let i = 0; i < 5; i++) {
      console.log('Click the button');
      await button.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error(error);
  }

  console.log('Close the browser');
  await browser.close();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
