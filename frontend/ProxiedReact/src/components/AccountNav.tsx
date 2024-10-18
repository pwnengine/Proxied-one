import styled from 'styled-components'
import { col_white, col_border } from '../colors'
import { VscAccount } from "react-icons/vsc";
import { VscKey } from "react-icons/vsc"
import { VscPersonAdd } from "react-icons/vsc"
import { CiMoneyCheck1 } from "react-icons/ci"

const Container = styled.div`
  
  background-color: ${col_white};
  height: 60%;
  border-radius: 8px;
  border: solid 1px;
  border-color: ${col_border};
  box-shadow: 0px 5px 10px 0px black;
  margin-top: 0px;
  padding-left: 2rem;
  padding-right: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  
  .option {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: 16px;
      height: 1rem;
      width: 100%;
      text-align: left;
      margin: 0px;
    }

  }

  .option:hover {
    gap: 0.2rem;
  }
  
`;

const AccountNav = () => {
  return (
    <Container>
      <div className="option">
        <VscAccount size={25} />
        <p>Account</p>
      </div>

      <div className="option">
        <VscKey size={25} />
        <p>API Key</p>
      </div>

      <div className="option">
        <VscPersonAdd size={25} />
        <p>Referals</p>
      </div>

      <div className="option">
        <CiMoneyCheck1 size={25} />
        <p>Billing</p>
      </div>
    </Container>
  )
}

export default AccountNav