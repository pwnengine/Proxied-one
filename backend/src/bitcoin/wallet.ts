import bitcore from 'bitcore-lib'
import axios from 'axios'

export interface i_wallet {
  address: string;
  private_key: string;
}

export const create_wallet: () => i_wallet = () => {
  const private_key: bitcore.PrivateKey = new bitcore.PrivateKey();
  const address: bitcore.Address = private_key.toAddress();
  return (
    { address: String(address), private_key: String(private_key) } as i_wallet
  );
};

export const btc_price: (currency: 'usd' | 'eur') => Promise<number> = async(currency: 'usd' | 'eur') => {
  return axios.get('https://api.coindesk.com/v1/bpi/currentprice.json').then((res) => {
    return currency === 'usd' ? Number(res.data?.bpi?.USD?.rate_float) : Number(res.data?.bpi?.EUR?.rate_float);
  }).catch((error) => {
    return -1;
  });
}

export const usd_to_btc: (amount: number) => Promise<number> = async(amount: number) => {
  const price: number = await btc_price('usd');
  if(price === -1)
    return price;

  return (amount / (await btc_price('usd')));
};

export const check_balance: (wallet_address: string) => Promise<number> = async(wallet_addrs: string) => {
  const res = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${wallet_addrs}/balance`);
  if(res.data?.balance === undefined) 
    return -1;

  let balance: number = Number(res.data?.balance);
  const length = (''+balance).length;
  const decimals_length: number = 8;

  if(length < decimals_length) {
    var new_balance: string = `${balance.toString()}`;
    for(let q: number = 0; q < (decimals_length - length); ++q) {
      new_balance = ('0'+new_balance);
    }
    new_balance = ('0.'+new_balance);
    console.log(new_balance);
    balance = Number(new_balance);
  }

  return balance;
};