import Code from "../components/Code";
import SectionPoint from "../components/SectionPoint";
import MainSection from "../components/MainSection"
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
`;

const Docs = () => {
  return (
    <Container>
      <MainSection name="Let's build something cool">

      <SectionPoint title={'Features'}>
          <div>
            <p>
            With the Proxied API you can grab proxies programmatically with http requests.
            Simply make a request with your language of choice to: <span style={ { display: 'block', fontWeight: '600' } }>https://api.proxied.one/get-proxies</span> to 
            grab some proxies. You can even give query parameters to specify the type of proxies you want.
            </p>
            <ul>
            <li>Grab HTTP, HTTPS, or SOCKS</li>
            <li>Scrape the proxies from your choice of source</li>
            <li>Try to scape a certain amount</li>
            </ul>
          </div>
        </SectionPoint>
      
        <SectionPoint title={'API Keys'}>
          <div>
            <p>
            An API key is not a needed, but without one you are limited to grabbing <span style={ { display: 'inline', fontWeight: '600' } }>only 1</span> proxy per request;
            Rate limting is applied.
            </p>
          </div>
          <div>
            <h4 style={ { margin: '0px' } }>Purchasing an API Key.</h4>
            <p>
            You can purchase an API key through with a one-time payment of $5 dollars through the account section under API keys.
            </p>
          </div>
        </SectionPoint>

        <SectionPoint title={'Grab With Curl'}>
          <div>
            <p>
            It can be as simple as a curl request.
            </p>
          </div>
          <Code language="curl" code="curl https://api.proxied.one/get-proxies?format=text&amount=1&type=http" title="" />
        </SectionPoint>

        <SectionPoint title={'Or Javascript'}>
          <Code language="javascript" code="fetch('https://api.proxied.one/get-proxies?format=json&type=http')" title="" />
        </SectionPoint>

        <SectionPoint title={'Customizing Your Query'}>
          <div>
            <p>Let's customize the query to get exactly what you want!</p>
          </div>

          <ul>
            <li>
              <span style={ { display: 'block', fontWeight: '600' } }>apikey</span> 
              is going to equal your API key, or you can not use it, but you're limted to one proxy being returned.
            </li>
            <li>
              <span style={ { display: 'block', fontWeight: '600' } }>format</span> format can either be <span style={{fontWeight: 'bold'}}>'json'</span>, or <span style={{fontWeight: 'bold'}}>'text'</span> 
              depending on how you want the API to serve the proxies.
              If an invalid type is specified the api will return json by default.
            </li>
            <li>
              <span style={ { display: 'block', fontWeight: '600' } }>amount</span> 
              used to specify the max amount of proxies you want returned. 
              If an invalid amount is specified, or no amount is specified it will return the max amount of proxies which is 20.
            </li>
            <li>
              <span style={ { display: 'block', fontWeight: '600' } }>type</span> 
              the proxy types are <span style={{fontWeight: 'bold'}}>'http'</span>,
              <span style={{fontWeight: 'bold'}}>'https'</span>, 
              <span style={{fontWeight: 'bold'}}>'socks5'</span>, 
              <span style={{fontWeight: 'bold'}}>'all'</span>. 
              By default it will return all proxy types.
            </li>
          </ul>

          <Code title="Python Request using every query parameter" language="python" 
            code="import urllib.request
contents = urllib.request.urlopen('https://api.proxied.one/get-proxies?apikey=myapikey&format=text&amount=3&type=all').read()
print(contents)"
            />
        </SectionPoint>

      </MainSection>
    </Container>
  )
}

export default Docs