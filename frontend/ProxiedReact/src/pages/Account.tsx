import styled from 'styled-components'
import MainSection from '../components/MainSection'
import AccountNav from '../components/AccountNav'
import { useWindowSize } from '../hooks/useWindowSize';

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


`;

const Account = () => {

  const { x } = useWindowSize();

  return (
    <Container>

      <div className={ x > 600 ? (x < 1250 ? 'nav small-nav' : 'nav') : ('nav nav-smaller')}>
        <AccountNav />
      </div>

      <div className={ x > 600 ? (x < 1250 ? 'page small-page' : 'page') : ('page page-smaller')}>
        <MainSection name={'Settings'}>
          <div>
            hello
          </div>
        </MainSection>
      </div>
      
        

    </Container>
  )
}

export default Account