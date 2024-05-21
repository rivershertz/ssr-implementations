import express from 'express';
import {addHtmlBoilerplate, renderHtmlPagesAndSaveThem} from './htmlUtils.js';
import config from './package.json' assert {type: 'json'};
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.static('public'));

app.get('/:name', async (req, res) => {
  // defining our HTML rendering function on the res object
  res.html = addHtmlBoilerplate.bind(res);
  // get route name
  let routePath = req.params.name;
  try {
    console.log('looking for: ', routePath);
    // import js file that corresponds with the route
    const pkg = await import('./pages/' + routePath + '.js');
    // return created HTML string based on request of users
    return await pkg.handler(req, res);
  } catch (e) {
    console.log(e);
    console.log('[ERR] Route not found: ', req.url);
    res.statusCode = 404;
    res.end('Route not found');
  }
});

app.post('/:name', async (req, res) => {
  // get route name
  let routePath = req.params.name;
  try {
    console.log('looking for (post): ', routePath);
    //   import js file that corresponds with the route
    const pkg = await import('./pages/' + routePath + '.js');
    // returns fetched JSON data
    return res.end(JSON.stringify(await pkg.getData()));
  } catch (e) {
    console.log('[ERR] Route not found: ', req.url);
    res.statusCode = 404;
    res.end('Route not found');
  }
});
const port = config.server.port || 3000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

renderHtmlPagesAndSaveThem(config);
