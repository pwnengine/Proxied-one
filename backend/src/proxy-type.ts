export interface i_proxies {
  proxy: i_proxy[];
  error: boolean;
  status_code: number;
  message: string;
}

export interface i_proxy {
  type: string;
  host: string;
  port: number;
}

