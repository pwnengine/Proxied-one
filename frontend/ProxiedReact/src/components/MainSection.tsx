import { ReactNode } from 'react';
import styled from 'styled-components'
import { col_white, col_border } from '../colors'

const Container = styled.div`
 // z-index: 1000;
  background-color: ${col_white};
  ///margin: 5rem 0rem 5rem 0rem;
  width: 61%;
  border-radius: 8px;
  border: solid 1px;
  border-color: ${col_border};
  box-shadow: 0px 5px 10px 0px black;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  margin: 20px;
  h2{
    text-align: center;

  }

  div {
   
    
  }
`;

interface props {
  children: ReactNode;
  name: string;
}

const MainSection = ({ children, name }: props) => {
  return (
    <Container>
      <h2>{name}</h2>
      <div>
      {children}
      </div>
    </Container>
  )
}

export default MainSection