import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'
import { i_proxies, i_proxy } from './proxy-type.js'

interface i_scrape_data {
  proxies: i_proxies;
  res: AxiosResponse<any, any>;
}

const get_scrape_data: (url: string, method: 'GET' | 'POST', config?: AxiosRequestConfig<any>) => Promise<i_scrape_data> = async(url: string, method: 'GET' | 'POST', config?: AxiosRequestConfig) => {
  let proxies: i_proxies = {
    proxy: [],
    error: false,
    status_code: 200,
    message: `Grabbed proxies from ${url} without issue.`,
  };

  let res: AxiosResponse<any, any>;

  try {
    console.log('trying to get ', url);
    if(method == 'GET') {
      res = await axios.get(url);
    } else if(method == 'POST') {
      res = await axios.post(url, {}, config);
    }
    
  } catch(error) {
    proxies.error = true;
    proxies.status_code = 500;
    proxies.message = error;

    console.error(error);
  }

  return { proxies, res };
};

const scrape_hide: (url: string, amount: number, type: string) => Promise<i_proxies> = async(url, amount, type) => {
  let scrape_data: i_scrape_data = 
  { 
    proxies: { 
      proxy: [], error: false, status_code: 200,  message: '' 
    },  
    res: undefined,
  };

  scrape_data = await get_scrape_data(`${url}/en/proxy-list/`, 'GET');
  const $ = cheerio.load(String(scrape_data.res?.data));

  const TD_START: number = 7;
  const PORT_OFFSET: number = 1;
  const PROXY_TYPE_OFFSET: number = 4;
  for(let q: number = 7; q <= (amount * TD_START); q += TD_START) {
    const grabbed_proxy: string = $('td', 'tr').eq(q).text();
    const grabbed_port: number = Number($('td', 'tr').eq(q + PORT_OFFSET).text());
    const grabbed_type: string = $('td', 'tr').eq(q + PROXY_TYPE_OFFSET).text();

    if(type === 'all') {
      scrape_data.proxies.proxy.push({ type: grabbed_type, host: grabbed_proxy, port: grabbed_port });
    } else if(grabbed_type.includes(type)) {
      scrape_data.proxies.proxy.push({ type: grabbed_type, host: grabbed_proxy, port: grabbed_port });
    } 
  }
 
  return scrape_data.proxies;
};

const get_proxies: (origin: string, ip: string, amount: number, type: string, source: string) => Promise<i_proxies> = async(origin, ip, amount, type, source) => {
  if(type !== 'http' && type !== 'https' && type !== 'socks5')
    type = 'all'

  console.log(`New (/get-proxies) request from ${origin} | ${ip}\namount: ${amount}\ntype: ${type}\nsource: ${source}\n\n\n\n\n`);

  switch(source) {

    default:
      return await scrape_hide(`https://hide.mn`, amount, type);
  }
};

export default get_proxies;