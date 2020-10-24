const { YoutubeSearch, InitBrowser } = require('.');

InitBrowser().then(async (res) => {
  const videos = await YoutubeSearch('rihana')
  const videoss = await YoutubeSearch('golang')
  console.log('res ', videos);
  console.log('res ', videoss);
});
