import styled from 'styled-components'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import InfoPopup from '../components/InfoPopup'
import * as yup from 'yup'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { col_border, col_white } from '../colors'
import { VscAccount } from "react-icons/vsc"


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
  form {
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

    .form-input {
      p {
        color: red;
        font-size: 14px;
      }
      .styled-btn {
        width: 100%;
        margin-top: 20px;
        border-radius: 5px;
        padding: 0.5rem;
        outline: none;
        border: 1.4px solid;
        border-color: #929191;
        background-color: ${col_white};
      }

      .styled-btn:hover {
        outline: none;
        padding: 0.55rem;
        cursor: pointer;
      }

      .styled-button:focus {
        outline: none;
      }


      .input-type {
        width: 90%;
        margin: 6px;
        padding: 0.5rem;
        outline: none;
      }

      .input-type:focus {
        outline: none;
      }
    }
  }
`;

const Register = () => {

  const validation_schema = yup.object().shape({
    username: yup.string().min(1).max(12).required('Choose a valid username'),
    password: yup.string().min(6).required('Choose a valid password'),
    password_repeated: yup.string().oneOf([yup.ref('password')], 'Passwords must match.').required('Must confirm password.'),
  });

  const use_form = useForm({
    resolver: yupResolver(validation_schema),
  });

  const nav = useNavigate();

  const [show_login_error, set_show_login_error] = useState<string | null>(null);

  const login_error_close = () => {
    set_show_login_error(null);
  };

  const submit: ({ username, password }: FieldValues) => void = async({ username, password }) => {
    console.log('heyyy');
    const resp = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/signup`, {
      username, 
      password,
    }, { withCredentials: true });
    
    if(!resp.data) {
      set_show_login_error('Something went wrong while registering your account in. Please try again later.');
    }

    if(resp.data.login) {
      nav('/account');
    } else {
      set_show_login_error('A user with that username already exists.');
    } 
    
  };

  return (
    <Container>
      <form onSubmit={use_form.handleSubmit(submit)}>

        <div className="top-section">
          <VscAccount size={80} />
          <h3>Register a new account.</h3>
        </div>


        <div className="form-input">
          <p>{use_form.formState.errors?.username?.message || use_form.formState.errors?.password?.message || use_form.formState.errors?.password_repeated?.message || 'Create account.'}</p>
          
          <div>  
            <input className="input-type" placeholder="Username" type="text" {...use_form.register('username')} />
          </div>


          <div>
            <input className="input-type" placeholder="Password" type="password" {...use_form.register('password')} />
          </div>


          <div>
            <input className="input-type" placeholder="Confirm Password" type="password" {...use_form.register('password_repeated')} />
          </div>

          <div>
            <input className="styled-btn" type="submit" />
          </div>
        </div>
      </form>

      {show_login_error && <InfoPopup title="Oh no..." width="500px" height="200px" on_close={login_error_close}> 
        <div>
          {show_login_error}
        </div>
      </InfoPopup>}

    </Container>
  )
}

export default Register