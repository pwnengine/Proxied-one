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
The only required parameter is the source you want to scrape. An example is ```hide.mn``` so if you make a get request to ```http://localhost:8080/get-proxies?source=hide.mn```
you'll get a response with a proxy in JSON format by default.

