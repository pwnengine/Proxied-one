# Proxied.one 
### proxy provider that scapes publicly available proxies from the internet to server in a centralized api.

I build this project because I needed an api to get proxies for my app ```https://surfshield.me/```.

It's a full stack application that anyone could use by fetching from ```https://api.proxied.one/get-proxies```.
It's completely free to use, but you can purchase an api key to remove amount limits. You could also get an unlimted experience by self hosting as the project is completely open-source.

## Self Hosting
The ```Self Hosting``` branch is what you're looking for ```https://github.com/pwnengine/Proxied-one/tree/SelfHost``` if you just want a server that will scrape proxies for you.
Just grab the branch and keep in mind it contains the frontend for the project which you don't need so either ignore ```frontend/``` or ```rm -fr frontend```.

### Make sure you're in the ```backend``` directory!
1. Install deps with ```npm i```
2. Start the server ```npm run dev```

Now you have a local server running on port ```8080```.

## Documentation

Grabbing proxies is as simple as making a ```GET``` request to the server at the ```get-proxies``` endpoint with your query parameters.
The only required parameter is the source you want to scrape. 
An example is ```hide.mn``` so if you make a get request to ```http://localhost:8080/get-proxies?source=hide.mn```
you'll get a response with a proxy in JSON format by default.

The sources availble:
1. ```freeproxy.world```
Scrapes from [freeproxy.world](https://www.freeproxy.world/)

2. ```hide.mn```
Scrapes from [hide.mn](https://hide.mn/en/)

4. custom
Requires addition query parameters, but allows you to scrapes from any site that contains proxy data inside of it's HTML body in a ````<tr>```` -> ```<td>``` tag(s)
![screenshots-11](https://github.com/user-attachments/assets/8675d9fc-dc80-41df-8768-0ae50e8d3a9b)
The addition query parameters for custom scraping are:
- ```url```
  The full url of the target you wish to scrape.
- ```first_proxy_position```
  The first appearing proxy ip address ```<td>``` tag if you were to count them all.
- ```next_proxy_position_offset```
  The offset between proxy ip address ```<td>``` tags.
- ```port_offset```
  The offset between the ip address ```<td>``` tag and port ```<td>``` tag.
- ```type_offset```
  The offset between the ip address <td> tag and proxy type (i.e. HTTP) ```<td>``` tag.
### Example: ```http://localhost:8080/get-proxies?source=custom&url=https://hide.mn/en/proxy-list/&first_proxy_position=7&next_proxy_position_offset=7&port_offset=1&type_offset=4```
### Check the image above to see how the offsets translate to the html body code.

## More options
- type
  can be either ```http``` ```https``` ```socks4``` ```socks5```
  if not set all types will be scraped
- amount
  specify the max amount of proxies to scrape, max ```20```
- format
  the format you want the server to response with ```text``` or ```json```, but JSON is the default
- apikey
  Self hosting, so just put something random it doesn't matter
### If an apikey isn't specified the server will only scrape a maximum of 1 proxy! Set anything to stop that!




