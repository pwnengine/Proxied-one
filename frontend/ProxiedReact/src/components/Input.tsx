import styled, { CSSProperties } from 'styled-components'

const Container = styled.div`
  p {
    font-size: 16px;
    margin: 0px;
  }

  input {
    margin: 0px;
    padding: 0.5rem;
    outline: none;
  }

  input:focus {
    outline: none;
  }

`;

interface props {
  name: string;
  styled?: CSSProperties;
  value: React.MutableRefObject<string>;
  editable: boolean;
}

const Input = ({ name, styled, value, editable }: props) => {
  return (
    <Container>
      <p>{name}</p>
      { editable ? <input placeholder={value.current} style={styled} onChange={(e) => value.current = e.currentTarget.value} /> :
        <input value={value.current} style={styled} />
      }
    </Container>
  )
}

export default Input