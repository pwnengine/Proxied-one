import Code from "../components/Code";
//import MainSection from "../components/MainSection"
import styled from 'styled-components'
import MainSection from "../components/MainSection"
import Button from '../components/Button'
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  

  .cta {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -30%);
    text-align: center;
    h1 {
      font-size: 48px;
      font-weight: 600;
    }

    h4 {
      font-size: 32px;
      font-weight: 400;
      margin-bottom: 5px;
    }

    .docs-btn {
      margin-top: 0;
      margin-bottom: 50px;
    }

    .code-container {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 125%;
      display: flex;
      justify-content: center;
      position: absolute;
      
      
      margin: 0px;
    }
  }
`;


const Home = () => {
  const nav = useNavigate();

  return (
   <Container>
      
      <section className="cta">
        <h1>
          Why Proxied.one?
        </h1>

        <h4>
          Proxied.one is an easy to use proxy api that scapes the internet for proxies.
        </h4>

        <div className="docs-btn">
        <Button onclick={() => nav('/docs')} name="Documentation"/>
        </div>

        <div className="code-container">
        <MainSection name="Try it youself!">
        <Code title="As easy as a simple curl command" language="curl" code="curl https://api.proxied.one?format=text&amount=1&type=http" />
        </MainSection>
        </div>


      </section>
   </Container>
  )
}

export default Home