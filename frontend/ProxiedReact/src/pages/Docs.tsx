import MainSection from "../components/MainSection"
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 27%;
  transform: translate(-50%, -30%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Docs = () => {
  return (
    <Container>
     
    <MainSection name="Let's build something cool">
      <div>
        hello
      </div>

    </MainSection>
    </Container>
  )
}

export default Docs