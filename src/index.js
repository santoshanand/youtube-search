const puppeteer = require('puppeteer');




async function YoutubeSearch(searchText) {
  let videos = [];
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setRequestInterception(true);
  
  page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font'){
          req.abort();
      }
      else {
          req.continue();
      }
  });
  
  await page.goto('https://www.youtube.com/results?search_query='+searchText, {waitUntil: 'networkidle0'});
  await page.waitForSelector('ytd-video-renderer');
  const elHandleArray = await page.$$('.ytd-item-section-renderer');
    for (let index = 0; index < elHandleArray.length; index++) {
      const el = elHandleArray[index];
      try {
        const videoId = await el.$eval('.ytd-thumbnail', a => a.getAttribute('href') );
        const linkThumb = await el.$eval('.yt-img-shadow', a => a.getAttribute('src'));
        const title = await el.$eval('#video-title', a => a.getAttribute('title'));
        videos.push({videoId: videoId, linkThumb: linkThumb, title: title});
      }catch(e) {}
    }
    await page.close();
    await browser.close();
    return videos;
}


/*
async function YoutubeSearch(searchText) {
  let videos = [];
  try {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('639839');
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: revisionInfo.executablePath,
      args: ['--window-size=1920,1080', '--disable-notifications'],
      userDataDir: './chrome-data',
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1280,
    });
    // await page.goto('https://youtube.com', {
    //   waitUntil: 'networkidle0',
    // });hyb 
    await page.goto('https://www.youtube.com/results?search_query='+searchText, {waitUntil: 'networkidle0'});
    await page.waitForSelector('ytd-video-renderer');
    await page.evaluate('window.scrollTo(0, 1000)')
    // await page.evaluate('window.scrollTo(1000, 2000)')
    // await page.evaluate('window.scrollTo(2000, 4000)')
    // await page.evaluate('window.scrollTo(1000, 0)')
    // await page.evaluate('window.scrollTo(2000, 1000)')
    // await page.evaluate('window.scrollTo(4000, 2000)')
    const elHandleArray = await page.$$('.ytd-item-section-renderer');
    for (let index = 0; index < elHandleArray.length; index++) {
      const el = elHandleArray[index];
      try {
        const videoId = await el.$eval('.ytd-thumbnail', a => a.getAttribute('href') );
        const linkThumb = await el.$eval('.yt-img-shadow', a => a.getAttribute('src'));
        const title = await el.$eval('#video-title', a => a.getAttribute('title'));
        videos.push({videoId: videoId, linkThumb: linkThumb, title: title});
      }catch(e) {}
    }
    return videos;
  } catch (e) {}
};
*/

module.exports = {YoutubeSearch: YoutubeSearch}

YoutubeSearch('demo')