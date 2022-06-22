import React, { useCallback, useState, StrictMode } from 'react';
import { render } from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
  body {
    font-family: Avenir, Helvetica Neue, Helvetica, Arial, Helvetica, sans-serif;
    font-size: 18px;
    background: #fcfcfc;
  }
`;

const Input = styled.input`
  font-size: 24px;
  margin: 0;
  border-radius: 4px 0 0 4px;
  border: 1px solid #ccc;
  padding: 6px 8px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
`;

const Spacing = styled(Row)`
  margin: 10% 10%;
`;

const Button = styled.button`
  font-size: 24px;
  padding: 6px 8px;
  border-radius: 0 4px 4px 0;
  border: none;
  margin: 0;
`;

const App = ({ onSubmitTitle }: { onSubmitTitle: (title: string) => void }) => {
  const [title, set] = useState('');
  const submit = useCallback(
    (e: React.FormEvent<unknown>) => {
      e.preventDefault();
      onSubmitTitle(title);
      set('');
    },
    [title]
  );
  return (
    <>
      <Global></Global>
      <form onSubmit={submit}>
        <Spacing>
          <Row>
            <Input
              value={title}
              type="text"
              placeholder="What should Beau's title be?"
              onChange={(event) => set(event.target.value)}
            />
            <Button type="submit">Imbue</Button>
          </Row>
        </Spacing>
      </form>
    </>
  );
};

if (require.main) {
  const node = document.createElement('div');
  document.body?.appendChild(node);
  render(
    <StrictMode>
      <App
        onSubmitTitle={(title) => {
          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
          }).then(
            () => console.log('success'),
            (error) => console.error('failure', error)
          );
        }}
      />
    </StrictMode>,
    node
  );
}
