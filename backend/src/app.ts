import express from 'express'
import get_proxies from './scraper.js'
import { check_token } from './auth.js'
import { check_proxy } from './check_proxy.js'

const MAX_AMOUNT: number = 20;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/check-proxy', async(req, res) => {
  res.json((await check_proxy(String(req.query?.ip))));
});

app.get('/get-proxies', async(req, res) => {
  let req_amount: number = (req.query?.amount === undefined ? MAX_AMOUNT : Number(req.query?.amount));
  let req_type: string = String(req.query.type ?? 'all');
  let req_source: string = String(req.query.source ?? 'default');

  // check if we have a valid api key, if no then only allow for one proxy to be sent back.
  if(req.query.apikey === undefined || !check_token()) {
    req_amount = 1;
  } else if(Number.isNaN(req_amount) || req_amount > MAX_AMOUNT) { // check if the requested amount is higher than max and set to max if needed.
    req_amount = MAX_AMOUNT;
  }
  

  // grab the proxies now that we have everything and send as json or text
  res.json((await get_proxies(req.header('Origin'), req.ip, req_amount, req_type, req_source)));
});

app.listen(8080, () => {
  console.log('backend running on port 8080');
});