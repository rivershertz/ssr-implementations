import {readdir, writeFile} from 'fs';
import {ssr} from './ssr.js';

export function addHtmlBoilerplate(txt) {
  const html = `
    <html>
        <head></head>
    <body>
    ${txt}
    </body>
    </html>
    `;
  // refers to the response object
  this.contentType = 'text/html';
  this.end(html);
}

export function renderHtmlPagesAndSaveThem(config) {
  readdir('./pages', async (err, files) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    for (const route of files) {
      const url =
        'http://' +
        config.server.host +
        ':' +
        config.server.port +
        '/' +
        route.replace('.js', '');
      const html = await ssr(url);
      saveRender(route, html);
    }
  });
}

function saveRender(route, html) {
  const targetPath = './public/' + route.replace('.js', '.html');
  console.log('Trying to save ', targetPath, '...');
  writeFile(targetPath, html, (err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    } else {
      console.log('File saved!');
    }
  });
}
