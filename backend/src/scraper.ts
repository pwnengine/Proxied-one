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

const scrape: (url: string, amount: number, type: string, starting_proxy_position: number, next_starting_proxy_offset: number, port_offset: number, type_offset: number) => Promise<i_proxies> = async(url, amount, type, starting_proxy_position, next_starting_proxy_offset, port_offset, type_offset) => {
  let scrape_data: i_scrape_data = 
  { 
    proxies: { 
      proxy: [], error: false, status_code: 200,  message: '' 
    },  
    res: undefined,
  };

  scrape_data = await get_scrape_data(url, 'GET');
  const $ = cheerio.load(String(scrape_data.res?.data));

  const TD_START: number = starting_proxy_position;
  const TD_NEXT_START: number = next_starting_proxy_offset;
  const PORT_OFFSET: number = port_offset;
  const PROXY_TYPE_OFFSET: number = type_offset;
  for(let q: number = TD_START; q < (amount * TD_NEXT_START); q += TD_NEXT_START) {
    const grabbed_proxy: string = $('td', 'tr').eq(q).text().trim();
    const grabbed_port: number = Number($('td', 'tr').eq(q + PORT_OFFSET).text());
    const grabbed_type: string = $('td', 'tr').eq(q + PROXY_TYPE_OFFSET).text().trim();

    if(type === 'all') {
      scrape_data.proxies.proxy.push({ type: grabbed_type.toUpperCase(), host: grabbed_proxy, port: grabbed_port });
    } else if(grabbed_type.includes(type.toUpperCase())) {
      scrape_data.proxies.proxy.push({ type: grabbed_type, host: grabbed_proxy, port: grabbed_port });
    } else if(grabbed_type.includes(type)) {
      scrape_data.proxies.proxy.push({ type: grabbed_type.toUpperCase(), host: grabbed_proxy, port: grabbed_port });
    }
  }
 
  return scrape_data.proxies;
};

const get_proxies: (origin: string, ip: string, amount: number, type: string, source: string) => Promise<i_proxies> = async(origin, ip, amount, type, source) => {
  if(type !== 'http' && type !== 'https' && type !== 'socks5' && type !== 'socks4')
    type = 'all'

  console.log(`New (/get-proxies) request from ${origin} | ${ip}\namount: ${amount}\ntype: ${type}\nsource: ${source}\n\n\n\n\n`);

  let proxies: i_proxies;
  switch(source) {
    case 'freeproxy.world':
      proxies = await scrape(`https://www.${source}/`, amount, type, 0, 8, 1, 5);
      break;

    case 'hide.mn':
      proxies = await scrape(`https://${source}/en/proxy-list/`, amount, type, 7, 7, 1, 4);

    default:
      proxies = { proxy: [], error: true, status_code: 400, message: `source: ${source}, does not exist.` }
  }
  
  if(proxies.proxy.length < amount) {
    proxies.error = true;
    proxies.message = 'Could not scrape the amount of proxies specified.';
  }

  return proxies;
};

export default get_proxies;