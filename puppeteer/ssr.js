import puppeteer from 'puppeteer';

export async function ssr(url) {
  console.log('Trying to SSR ', url, '...');
  const browserOptions = {
    headless: true,
  };
  try {
    const browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    await page.waitForSelector('body');
    await page.$eval('body', ({dataset}) => {
      dataset.rendered = true;
    });

    const serializedHtml = await page.content();
    await browser.close();
    return serializedHtml;
  } catch (error) {
    console.error('SSR Error', error);
    return 'Problem rendering on the server.';
  }
}
