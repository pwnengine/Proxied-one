import axios from 'axios'

export const check_proxy: (ip: string) => Promise<string> = async(ip) => {
  const resp = await axios.get(`http://ip-api.com/json/${ip}`);
  return resp.data;
};