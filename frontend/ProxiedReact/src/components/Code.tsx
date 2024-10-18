import SyntaxHighlighter from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/atelier-cave-dark';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useState } from 'react';

interface props {
  language: string;
  code: string;
  title: string;
}

const Container = styled.div`
  @keyframes copy-animation {
    from {
      font-size: 0px;
    }
    to {
      font-size: 14px;
    }

  }
  display: flex;
  flex-direction: column;
  gap: 0px;

  .copied-animation {
    text-align: center;
    animation-name: copy-animation;
    animation-duration: 500ms;
  }

  div {
    display: flex;
    justify-content: space-between;
  .title {
    margin: 0px;
    padding: 0px;
  }

  button {
    flex-basis: 30px;
    margin: 0px;  
    border: none;
    font-weight: 550;
  }
  button:hover {
    cursor: pointer;
    font-weight: 650;
    margin-bottom: 2px;
    
  }
  button:focus {
    outline: none;
  }
}

`;

const Code = ({ language, code, title }: props) => {
  const [play_copy_animation, set_play_copy_animation] = useState<boolean>(false);

  return (
    <Container>
      <div>
      <h3 className="title">{title}</h3>
      <button>
        <CopyToClipboard text={code} onCopy={() => set_play_copy_animation(true)}>
          
            {play_copy_animation ? <div className="copied-animation">Copied</div> : <div>Copy</div> }
          
        </CopyToClipboard>
      </button>
      </div>
      <SyntaxHighlighter customStyle={{backgroundColor: '#1c1b22', padding: '1rem', margin: '0', borderRadius: '5px'}} language={language} style={style} showLineNumbers={true}>
        {code}
      </SyntaxHighlighter>
    </Container>
  )
}

export default Code