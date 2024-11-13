import express from 'express'
import session from 'express-session'
import cors from 'cors'
import get_proxies, { i_custom_data } from './scraper.js'
import { check_token } from './auth.js'
import { check_proxy } from './check_proxy.js'
import bitcore from 'bitcore-lib'
import { check_balance, create_wallet, i_wallet, usd_to_btc } from './bitcoin/wallet.js'
import sql from './db.js'
import dotenv from 'dotenv'
import genFunc from 'connect-pg-simple'
import * as bcrypt from 'bcrypt'
import crypto from 'crypto'

const SALT_ROUND = 10;

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      apikey: string;
    };
  }
}

dotenv.config();

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    wallet TEXT,
    api_access BOOLEAN
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS apikeys (
    id SERIAL PRIMARY KEY,
    key TEXT,
    uid INT, 
    CONSTRAINT fk_uid FOREIGN KEY (uid) REFERENCES users (id)
  )
`;

await sql`
 CREATE TABLE IF NOT EXISTS public.session (
  sid character varying PRIMARY KEY NOT NULL,
  sess json NOT NULL,
  expire timestamp(6) without time zone NOT NULL
  )
`;

const MAX_AMOUNT: number = 20;

const app = express();

app.use(express.json());

/*
app.use((req, res, next) => {
  if(req.method === 'GET') { // anyone can make simple requests to the api
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  } else {                     // change this later so that only the website can make preflight requests...
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if(req.method === 'OPTIONS') {
      res.status(200);
      res.statusMessage = 'ok';
      res.end();
      return;
    }
  }

  next();
});
*/

app.use((req, res, next) => {
    if(req.method === 'OPTIONS') {
      res.status(200);
      res.statusMessage = 'ok';
      res.end();
      next();
    }
})

app.use(cors({
  orgin: process.env.FRONTEND_URL,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
}));

const pg_store = genFunc(session);
const session_store = new pg_store({
  conString: process.env.POSTGRES_URL,
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: session_store,
  cookie: {
    secure: false,
  }
 })
);

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
  if(req.query.apikey === undefined || !(await check_token(req.query?.apikey))) {
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

app.post('/user', async(req, res) => {
  if(req.session.user?.id && req.session.user?.username) {
    console.log(req.session?.user);
    res.json(req.session?.user);

    if(req.body?.new_username) {
      await sql`UPDATE users SET username = ${req.body?.new_username} WHERE id = ${req.session.user?.id}`;
      req.session.user.username = req.body?.new_username;
      req.session.save();
    }
    if(req.body?.new_password) {
      bcrypt.hash(req.body?.new_password, SALT_ROUND, async(error, hash) => {
        await sql`UPDATE users SET password = ${hash} WHERE id = ${req.session.user?.id}`;  
      });
      
    }

    res.status(200);
    res.end();
  } else {
    res.status(401);
    res.end();
  }
});

app.post('/signup', async(req, res) => {
  if(req.body?.username === undefined || req.body?.password === undefined) {
    res.json({ login: false, status: 401, username: req.body?.username, password: req.body?.password });
    res.status(401);
    res.end();
    return;
  }

  const user_exists = await sql`
    SELECT * FROM users WHERE username = ${req.body?.username}
  `;

  if(user_exists.length > 0) {
    res.json({ login: false, status: 401, username: req.body?.username, password: req.body?.password });
    res.status(401);
    res.end();
    return;
  }

  await bcrypt.hash(req.body?.password, SALT_ROUND, async(error, hash) => {
    const new_wallet: i_wallet = create_wallet();
    await sql`
      INSERT INTO users (username, password, wallet, api_access)
      VALUES(${String(req.body?.username)}, ${hash}, ${new_wallet.address + ':' + new_wallet.private_key}, false)
    `;

    const auth = await sql`
      SELECT * FROM users WHERE username = ${String(req.body?.username)}
    `;
  
    req.session.user = {
      id: Number(auth[0].id), 
      username: String(auth[0].username),
      apikey: '',
    }
    req.session.save();

    res.status(200);
    res.json({login: true, status: 200, username: req.session.user?.username, id: req.session.user?.username});
  });
});

app.post('/login', async(req, res) => { 
  if(req.body?.username === undefined || req.body?.password === undefined) {
    res.json({ login: false, status: 401, username: req.body?.username, password: req.body?.password });
    res.status(401);
    res.end();
    return;
  }

  const auth = await sql`
    SELECT * FROM users WHERE username = ${req.body?.username}
  `;

  if(auth.length < 1 || !(await bcrypt.compare(req.body?.password, auth[0].password))) {
    res.json({ login: false, status: 401, username: req.body?.username, password: req.body?.password });
    res.end();
    return;
  }

  req.session.user = {
    id: Number(auth[0]?.id), 
    username: String(auth[0]?.username),
    apikey: '',
  };

  req.session.save();

  res.status(200);
  res.json({login: true, status: 200, username: req.session.user?.username, id: req.session.user?.username});
});

app.post('/genapikey', async(req, res) => {
  const username: string | undefined = req.session.user?.username;
  if(username === undefined) {
    res.status(401);
    res.end();
    return;
  }

  const user = await sql`
    SELECT * FROM users WHERE (username) = ${username}
  `;
  
  if(!user[0].api_access) {
    res.status(401);
    res.end();
    return;
  }

  const key = crypto.randomBytes(32).toString('hex');
  
  await sql`
    INSERT INTO apikeys (key, uid) 
    VALUES(
      ${key},
      ${String(req.session.user?.id)}
    )
  `;

  req.session.user.apikey = key;
  req.session.save();
  console.log('hey');

  res.end();
});

app.get('/apikey', async(req, res) => {
  const username: string | undefined = req.session.user?.username;
  if(username === undefined) {
    res.status(401);
    res.end();
    return;
  }

  const check = await sql`
    SELECT * FROM users JOIN apikeys ON apikeys.uid = users.id WHERE username = ${username}
  `;

  if(check.length < 1) {
    res.status(401);
    res.end();
    return;
  }

  res.json({ key: check[0].key });
});

app.post('/checkbalance', async(req, res) => {
  if(req.session.user?.username === undefined) {
    res.status(401);
    res.end();
    return;
  }

  const btc_amount: number = await usd_to_btc(10.00);
  if(btc_amount === -1) {
    res.status(500);
    res.send('Problem grabbing current Bitcoin price.');
    res.end();
    return;
  }
  
  const user = await sql`
    SELECT * FROM users WHERE (username) = ${req.session.user?.username}
  `;
  const user_wallet: string = String(user[0].wallet).split(':')[0];
  console.log(user_wallet);

  const balance: number = await check_balance(user_wallet);
  if(balance === -1) {
    res.status(500);
    res.send('Problem grabbing your wallet balance.');
    res.end();
    return;
  }

  if(balance >= btc_amount) {
    await sql`
      UPDATE users SET (api_access) = true WHERE (id) = ${req.session.user?.id}
    `;

    res.status(200);
    res.json({ api_access: true, btc_amount, user_wallet, balance });
    res.end();
  } else {
    res.status(200);
    res.json({ api_access: false, btc_amount, user_wallet, balance });
    res.end();
  }
});

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.listen(8080, () => {
  console.log('backend running on port 8080');
});

export default app;