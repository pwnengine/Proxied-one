import styled from 'styled-components'
import MainSection from '../components/MainSection'
import AccountNav from '../components/AccountNav'
import { useWindowSize } from '../hooks/useWindowSize'
import SectionPoint from '../components/SectionPoint'
import { useEffect, useRef, useState} from 'react'
import axios from 'axios'
import Input from '../components/Input'
import Button from '../components/Button'
import InfoPopup from '../components/InfoPopup'
import { useNavigate } from 'react-router-dom'
import { i_user, useUserQuery } from '../hooks/useUserQuery'

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

  const username_input = useRef<string>('username');
  const password_input = useRef<string>('password');

  const api_key_input = useRef<string>('api key');

  const [show_bitcoin_wallet_popup, set_show_bitcoin_wallet_popup] = useState<boolean>(false);

  const update_user_details = () => {
    axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user`, { new_username: username_input.current, new_password: password_input.current }, {withCredentials: true});
  };

  const fetch_user = (): Promise<i_user> => {
    return axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user`, {}, {withCredentials: true}).then((res) => {
      return res.data
    });
  };

  const { user, error, loading, refetch } = useUserQuery(fetch_user);

  const nav = useNavigate();
  useEffect(() => {
    if(!loading && (user?.id === undefined || user?.id === undefined)) {
      nav('/login');
      console.error('not authenticated.');
    }
  }, [user, nav, loading]);
  /*
  

  console.log(data);
*/
  return (
    <Container>

      <div className={ x > 600 ? (x < 1250 ? 'nav small-nav' : 'nav') : ('nav nav-smaller')}>
        <AccountNav nav_array={ [ account_ref, apikey_ref, referrals_ref, billing_ref ] } />
      </div>
      { !loading &&
      <div className={ x > 600 ? (x < 1250 ? 'page small-page' : 'page') : ('page page-smaller')}>
        <MainSection name={'Settings'}>
            <SectionPoint title="Account Details">
              <div ref={account_ref} className="page-point">
              <Input name="Username" placeholder={user?.username} value={username_input} editable={true} />
              <Input name="Password" placeholder={'*********'} value={password_input} editable={true} />
              <Button name="Update" onclick={update_user_details} />
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
                  Once the transaction is verified (usually less than one hour) you will automatically be able to generate API keys. <br />
                  The USD price is $10 for lifetime api use.
                  
                </div>
                <Button name="Pay with Bitcoin" onclick={() => set_show_bitcoin_wallet_popup(true)} />
              </div>
            </SectionPoint>
        </MainSection>
      </div>}
      
        
      { show_bitcoin_wallet_popup && 
        <InfoPopup width="500px" height="500px" title="Bitcoin Wallet" on_close={() => set_show_bitcoin_wallet_popup(false)}> 
          <div>
            A bitcoin address has been create for this transaction. <br /> Please Send exactly 
          </div>
        </InfoPopup>
      }
    </Container>
  )
}

export default Account