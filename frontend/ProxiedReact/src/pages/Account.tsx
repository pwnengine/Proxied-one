import styled from 'styled-components'
import MainSection from '../components/MainSection'
import AccountNav from '../components/AccountNav'
import { useWindowSize } from '../hooks/useWindowSize'
import SectionPoint from '../components/SectionPoint'
import { useRef } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'

const Container = styled.div`
  .nav {
    position: fixed;
    top: 20%;
    left: 16%;
    height: 100%;
    padding: 1.2rem;
    z-index: 1000;
  }

  .small-nav {
    left: 0px;
  }

  .nav-smaller {
    left: -10%;
  }

  .page {
    position: absolute;
    top: 20%;
    left: 15%;
    width: 81%;
    min-height: 100%;
    display: flex;
    justify-content: center;
  }

  .small-page {
    left: 50%;
    transform: translateX(-50%);
  }

  .page-smaller {
    left: 70%;
    transform: translateX(-70%);
    width: 100%;
  }

  .page-point {
    background-color: #fffefe;
    padding: 1.4rem;
    border: solid 1px;
    border-color: #929191;
    border-radius: 5px;
  }


`;

const Account = () => {

  const { x } = useWindowSize();

  const account_ref = useRef<HTMLDivElement>(null);
  const apikey_ref = useRef<HTMLDivElement>(null);
  const referrals_ref = useRef<HTMLDivElement>(null);
  const billing_ref = useRef<HTMLDivElement>(null);

  const username_input = useRef<string>('this is a username');
  const password_input = useRef<string>('this is a password');

  const api_key_input = useRef<string>('api key');

  return (
    <Container>

      <div className={ x > 600 ? (x < 1250 ? 'nav small-nav' : 'nav') : ('nav nav-smaller')}>
        <AccountNav nav_array={ [ account_ref, apikey_ref, referrals_ref, billing_ref ] } />
      </div>

      <div className={ x > 600 ? (x < 1250 ? 'page small-page' : 'page') : ('page page-smaller')}>
        <MainSection name={'Settings'}>
            <SectionPoint title="Account Details">
              <div ref={account_ref} className="page-point">
              <Input name="Username" value={username_input} editable={true} />
              <Input name="Password" value={password_input} editable={true} />
              <Button name="Update" />
              </div>
            </SectionPoint>
              
            <SectionPoint title="API Key">
              <div ref={apikey_ref} className="page-point">
                <Input name="API Key" value={api_key_input} editable={false} />
                <Button name="Generate" />
              </div>
            </SectionPoint>

            <SectionPoint title="Referrals">
              <div ref={referrals_ref} className="page-point">
                <div>Work in progress...</div>
              </div>
            </SectionPoint>

            <SectionPoint title="Billing">
              <div ref={billing_ref} className="page-point">
                <div>
                  Payments can be made with Bitcoin to activate your account.<br /> 
                  Once the transaction is verified (usually less than one hour) you will automatically be able to generate API keys.
                  
                  
                </div>
              </div>
            </SectionPoint>
        </MainSection>
      </div>
      
        

    </Container>
  )
}

export default Account