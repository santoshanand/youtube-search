const puppeteer = require('puppeteer');
const videos = [];
async function YoutubeSearch(searchText) {
  try {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('639839');
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: revisionInfo.executablePath,
      args: ['--window-size=1920,1080', '--disable-notifications'],
      userDataDir: './chrome-data',
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1280,
    });
    await page.goto('https://youtube.com', {
      waitUntil: 'networkidle0',
    });
    await page.goto('https://www.youtube.com/results?search_query='+searchText);
    await page.waitForSelector('ytd-video-renderer');
    await page.evaluate('window.scrollTo(0, 1000)')
    await page.evaluate('window.scrollTo(1000, 2000)')
    await page.evaluate('window.scrollTo(2000, 4000)')
    await page.evaluate('window.scrollTo(1000, 0)')
    await page.evaluate('window.scrollTo(2000, 1000)')
    await page.evaluate('window.scrollTo(4000, 2000)')
    const elHandleArray = await page.$$('.ytd-item-section-renderer');
    elHandleArray.forEach(async el => {
      try {
        const videoId = await el.$eval('.ytd-thumbnail', a => a.getAttribute('href') );
        const linkThumb = await el.$eval('.yt-img-shadow', a => a.getAttribute('src'));
        const title = await el.$eval('#video-title', a => a.getAttribute('title'));
        console.log(videoId, linkThumb, title);
      }catch(e) {}
    })
  } catch (e) {}
};

module.exports = {YoutubeSearch: YoutubeSearch}
