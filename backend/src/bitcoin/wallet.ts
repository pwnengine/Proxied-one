import bitcore from 'bitcore-lib'

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