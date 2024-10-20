import axios, { Axios, AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'
import { i_proxies, i_proxy } from './proxy-type.js'

interface i_scrape_data {
  proxies: i_proxies;
  res: AxiosResponse<any, any>;
}

const get_scrape_data: (url: string) => Promise<i_scrape_data> = async(url: string) => {
  let proxies: i_proxies = {
    proxy: [],
    error: false,
    status_code: 200,
    message: `Grabbed proxies from ${url} without issue.`,
  };

  let res: AxiosResponse<any, any>;

  try {
    console.log('trying to get ', url);
    res = await axios.get(url);
  } catch(error) {
    proxies.error = true;
    proxies.status_code = 500;
    proxies.message = error;

    console.error(error);
  }

  return { proxies, res };
};

const scrape_spys: (url: string, amount: number, type: string) => Promise<i_proxies> = async(url, amount, type) => {
  let scrape_data: i_scrape_data = 
  { 
    proxies: { 
      proxy: [], error: false, status_code: 200,  message: '' 
    },  
    res: undefined,
  };

  if(type === 'socks5') {

  } else if(type === 'https') {

  } else { // default is http
    scrape_data = await get_scrape_data(`${url}/en/http-proxy-list/`);
  }

  console.log(`Proxies: ${scrape_data.proxies}\n\nAxios Response: ${scrape_data.res?.data}`);


  return scrape_data.proxies;
};

const get_proxies: (origin: string, ip: string, amount: number, type: string, source: string) => Promise<i_proxies> = async(origin, ip, amount, type, source) => {
  if(type !== 'http' && type !== 'https' && type !== 'socks5')
    type = 'http'

  console.log(`New (/get-proxies) request from ${origin} | ${ip}\namount: ${amount}\ntype: ${type}\nsource: ${source}\n\n\n\n\n`);

  switch(source) {

    default:
      return await scrape_spys(`https://spys.one`, amount, type);
  }
};

export default get_proxies;