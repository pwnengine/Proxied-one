import styled from 'styled-components'
import Button from '../components/Button'
import Input from '../components/Input'
import { useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import InfoPopup from '../components/InfoPopup'
import { VscAccount } from 'react-icons/vsc'
import { col_border, col_white } from '../colors'

const Container = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  //transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  .login {
    flex-basis: 400px;
    background-color: ${col_white};
    ///margin: 5rem 0rem 5rem 0rem;
  
    border-radius: 8px;
    border: solid 1px;
    border-color: ${col_border};
    box-shadow: 0px 5px 10px 0px black;
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;


    
    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;


    .top-section {
      padding: 1rem;
    }

    .input-types {

    }
  }
`;

const Login = () => {
  const nav = useNavigate();

  const [show_login_error, set_show_login_error] = useState<string | null>(null);

  const login_error_close = () => {
    set_show_login_error(null);
  };

  const username_ref = useRef('username');
  const password_ref = useRef('password');

  const submit: () => void = () => {
    axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/login`, {
      username: username_ref.current, 
      password: password_ref.current,
    }, { withCredentials: true }).then((resp) => { 
      if(resp.data.login) {
        nav('/account');
        console.log(resp.data.username);
        console.log(resp.data.id);
      } else {
        set_show_login_error('The username, or password you have entered was not correct.');
      }
    }).catch(() => {
      set_show_login_error('Something went wrong while logging in. Please try again later.');
    });
  };

  return (
    <Container>

    <div className="login">

      <div className="top-section">
        <VscAccount size={80} />
        <h3>Login to your account.</h3>
      </div>

      
      <div className="input-types">
        <Input name="Username" value={username_ref} editable={true} styled={{width: '80%', margin: '6px'}} />

        <Input name="Password" value={password_ref} editable={true} styled={{width: '80%', margin: '6px'}} />

        <div>
          <Button name="Login" onclick={submit} styled={{width: '90%', margin: '15px'}} />
        </div>

        <div>
          <a style={{ color: 'blue' }} href="/signup">Create an account instead?</a>
        </div>
      </div>

    </div>

    {show_login_error && <InfoPopup title="Oh no..." width="500px" height="200px" on_close={login_error_close}> 
      <div>
        {show_login_error}
      </div>
    </InfoPopup>}

    </Container>
  )
}

export default Login