import styled from 'styled-components'
import MainSection from '../components/MainSection'
import AccountNav from '../components/AccountNav'
import { useWindowSize } from '../hooks/useWindowSize'
import SectionPoint from '../components/SectionPoint'
import { useEffect, useRef, useState} from 'react'
import axios from 'axios'
import Code from '../components/Code'
import Input from '../components/Input'
import Button from '../components/Button'
import InfoPopup from '../components/InfoPopup'
import { useNavigate } from 'react-router-dom'
import { i_user, useUserQuery } from '../hooks/useUserQuery'
import ReactLoading from 'react-loading'

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

type bitcoin_payments = { api_access: boolean, btc_amount: number, user_wallet: string, balance: number };  

const Account = () => {
  const { x } = useWindowSize();

  const account_ref = useRef<HTMLDivElement>(null);
  const apikey_ref = useRef<HTMLDivElement>(null);
  const referrals_ref = useRef<HTMLDivElement>(null);
  const billing_ref = useRef<HTMLDivElement>(null);

  const username_input = useRef<string>('username');
  const password_input = useRef<string>('password');

  const [show_bitcoin_wallet_popup, set_show_bitcoin_wallet_popup] = useState<boolean>(false);
  const [show_api_error_popup, set_show_api_error_popup] = useState<boolean>(false);
  const [show_payment_popup, set_show_payment_popup] = useState<boolean>(false);
  const [payment_message, set_payment_message] = useState<string>('');

  const [btc_option, set_btc_option] = useState<bitcoin_payments>();

  const gen_apikey = () => {
    axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/genapikey`, {}, { withCredentials: true }).then((resp) => {
      if(resp.status !== 401) {
        refetch();
      }
    }).catch(() => {
      set_show_api_error_popup(true);
    });
    
    
  };

  const update_user_details = () => {
    axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user`, { new_username: username_input.current, new_password: password_input.current }, {withCredentials: true});
  };

  const fetch_user = (): Promise<i_user> => {
    return axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user`, {}, {withCredentials: true}).then((res) => {
      return res.data
    });
  };

  const { user, loading, refetch } = useUserQuery(fetch_user);

  const nav = useNavigate();
  useEffect(() => {
    if(!loading && (user?.id === undefined || user?.id === undefined)) {
      nav('/login');
      console.error('not authenticated.');
    }
  }, [user, nav, loading]);

  return (
    <Container>

      <div className={ x > 600 ? (x < 1250 ? 'nav small-nav' : 'nav') : ('nav nav-smaller')}>
        <AccountNav nav_array={ [ account_ref, apikey_ref, referrals_ref, billing_ref ] } />
      </div>

      { loading && 
        <div className={ x > 600 ? (x < 1250 ? 'page small-page' : 'page') : ('page page-smaller')}>
          <MainSection name="">
            
              <div style={{ height: '35rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ margin: '3rem', width: '80px' }}>
                <ReactLoading type="spinningBubbles" color="black" />
                </div>
              </div>

            
          </MainSection>
        </div>

      }

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
                <Input name="API Key" value={{current: String(user?.apikey)}} editable={false} />
                <Button name="Generate" onclick={gen_apikey} />
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
                <Button name="Pay with Bitcoin" onclick={async() => {
                    const res = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/checkbalance`, {}, { withCredentials: true });//.then((res: AxiosResponse<bitcoin_payments>) => {
                    if(res.status === 500) {
                      console.log(res.data);
                    } else {
                      set_btc_option(res.data as bitcoin_payments);
                      set_show_bitcoin_wallet_popup(true);
                    }
                      
                  }} />
              </div>
            </SectionPoint>
        </MainSection>
      </div>}
      
        
      { show_bitcoin_wallet_popup && 
        <InfoPopup width="500px" height="450px" title="Bitcoin Wallet" on_close={() => set_show_bitcoin_wallet_popup(false)}> 
          <div>
            <p>The wallet address below is your account's wallet...</p>
            <p>Send exactly <span style={{ backgroundColor: '#dbd0d0', borderRadius: '5px', padding: '3px' }}>{btc_option?.btc_amount}</span> btc. <br /> ($10 dollars).</p>
            <Code language="curl" code={String(btc_option?.user_wallet)} title="" />
            Current wallet balance: {btc_option?.balance}
            <br /> Click 'check blockchain' button after transaction has been verified on blockchain.
            <div style={{ margin: '50px' }}>
              <Button name="Check blockchain" styled={{ width: '100%' }} onclick={async() => {
                const res = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/checkbalance`, {}, { withCredentials: true });
                if(res.status === 200) {
                  const data: bitcoin_payments = res.data;
                  set_btc_option(data);
                  if(data.api_access === true) {
                    set_payment_message('Success! You now have api access.');
                  } else {
                    set_payment_message('Payment not verified yet, please wait a little longer.');
                  }

                  set_show_payment_popup(true);
                }
              }} />
            </div>
          </div>

          
        </InfoPopup>
      }

      { show_payment_popup &&
        <InfoPopup width="280px" height="200px" title="Check payment" on_close={() => set_show_payment_popup(false)} >
          <div>
            {payment_message}
          </div>
        </InfoPopup>
      }

      { show_api_error_popup && 
        <InfoPopup width="280px" height="200px" title="API Error" on_close={() => set_show_api_error_popup(false)} >
          <div>
            You do not have api access.
          </div>
        </InfoPopup>
      }
    </Container>
  )
}

export default Account