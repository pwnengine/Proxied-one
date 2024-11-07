import styled from 'styled-components'
import { col_border } from '../colors'
import { IoMdExit } from "react-icons/io"
import React from 'react';

const Container = styled.div`
  position: fixed;
  z-index: 2000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-color: ${col_border};
  box-shadow: 0px 5px 10px 0px black;
  text-align: center;
  background-color: white;
  border-radius: 10px;

  .information {
    padding: 2rem;
    height: 70%;
  }
  

  .top {
    width: 100%;
    border-color: ${col_border};
    border-radius: 10px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: #fdfcfc;

    display: flex;
    justify-content: end;

    .right {
      flex-basis: 70%;      
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title {      
        width: 200px;
        overflow: hidden;
      }

      button {
        background: none;
        width: 50px;
        height: 40px;
      }
    }
  }
`;

interface props {
  width: string;
  height: string;
  title: string;
  on_close: () => void;
  children: React.ReactNode;
}

const InfoPopup = ({ width, height, title, on_close, children }: props) => {
  return (
    <Container style={{ width, height }}>
      <div className="top">
        <div className="right">
          <h2 className="title">{title}</h2>
          <IoMdExit size={40} onClick={() => on_close()} />
        </div>

        
      </div>

      <div className="information">
        {children}

      </div>
    </Container>
  )
}

export default InfoPopup