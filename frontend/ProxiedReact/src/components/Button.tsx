import styled from 'styled-components'
import React from 'react';
import { col_white } from '../colors';

const Container = styled.div`
  .styled-btn {
    border-radius: 5px;
    padding: 0.5rem;
    outline: none;
    border: 1.4px solid;
    border-color: #929191;
    background-color: ${col_white};
  }

  button:hover {
    outline: none;
    padding: 0.505rem;
    cursor: pointer;
  }

  button:focus {
    outline: none;
  }
`;

interface props {
  name: string;
  styled?: React.CSSProperties;
  onclick?: () => void;
}

const Button = ({ name, styled, onclick }: props) => {
  return (
    <Container>
      <button onClick={onclick} style={styled} className="styled-btn">{name}</button>
    </Container>
  )
}

export default Button