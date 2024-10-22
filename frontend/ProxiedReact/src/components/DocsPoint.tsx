import styled from 'styled-components'

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

interface props {
  children: React.ReactNode;
  title: string;
}

const DocsPoint = ({ children, title }: props) => {
  return (
    <Container>
      <div>
        <h3>{title}</h3>
        { children }
      </div>
    </Container>
  )
}

export default DocsPoint