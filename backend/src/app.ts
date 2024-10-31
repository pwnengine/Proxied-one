import express from 'express'
import get_proxies, { i_custom_data } from './scraper.js'
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

  let custom_data: i_custom_data;
  if(req_source === 'custom') {
    custom_data = {
      full_url: String(req.query?.url ?? ''),
      first_proxy_position: isNaN(Number(req.query?.first_proxy_position)) ? 0 : Number(req.query?.first_proxy_position),
      next_proxy_position_offset: isNaN(Number(req.query?.next_proxy_position_offset)) ? 0 : Number(req.query?.next_proxy_position_offset),
      port_offset: isNaN(Number(req.query?.port_offset)) ? 0 : Number(req.query?.port_offset),
      type_offset: isNaN(Number(req.query?.type_offset)) ? 0 : Number(req.query?.type_offset),
    }
  } 
  // check if we have a valid api key, if no then only allow for one proxy to be sent back.
  if(req.query.apikey === undefined || !check_token()) {
    req_amount = 1;
  } else if(Number.isNaN(req_amount) || req_amount > MAX_AMOUNT) { // check if the requested amount is higher than max and set to max if needed.
    req_amount = MAX_AMOUNT;
  }
  

  // grab the proxies now that we have everything and send as json or text
  if(req.query?.format === 'text') {
    const proxies = await get_proxies(req.header('Origin'), req.ip, req_amount, req_type, req_source, custom_data);
    let proxy_str: string = '';
    proxies.proxy.map((v) => {
      proxy_str = proxy_str.concat(v.type, ':', v.host, ':', String(v.port), '<br />');
    });
    res.send(proxy_str);
  } else {
    res.json((await get_proxies(req.header('Origin'), req.ip, req_amount, req_type, req_source, custom_data)));
  }
});

app.listen(8080, () => {
  console.log('backend running on port 8080');
});