import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { useSpring, animated, useTransition } from 'react-spring';
import styled, { createGlobalStyle } from 'styled-components';
import { Logo } from './Logo';
import { NameTag } from './NameTag';

const Global = createGlobalStyle`
  body {
    margin: 0;
    font: 12px Avenir;
  }
`;

const Container = styled.div``;

const Bar = styled(animated.div)`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2em;

  box-sizing: border-box;
  background: linear-gradient(#0000, #0006);
`;

const Centered = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Dancing = animated(Logo);

const F = styled(animated.div)`
  flex: 1;
`;

const P = styled.div`
  flex: 1;
  perspective: 1000px;
`;

const Tx = ({ children }: { children: React.ReactNode }) => {
  const [visible, set] = useState(false);
  const transitions = useTransition(visible, null, {
    from: { transform: 'rotateX(0deg)' },
    enter: { transform: 'rotateX(360deg)' },
    leave: { opacity: 0 },
  });
  useEffect(() => set(true));
  return (
    <P>
      {transitions.map(({ item, props, key }) =>
        item ? (
          <F key={key} style={props}>
            {children}
          </F>
        ) : null
      )}
    </P>
  );
};

const App = () => {
  const props: any = useSpring({
    config: { friction: 5, tension: 4 },
    from: { color: 'hsla(0,0%,0%,0)' },
    to: async (next: (input: { color: string }) => Promise<void>) => {
      while (true) {
        await next({ color: 'hsla(0, 0%, 0%, 0.5)' });
        await next({ color: 'hsla(0, 0%, 100%, 0.75)' });
      }
    },
  });
  return (
    <Container>
      <Global />
      <Bar>
        <Centered>
          <Dancing size={160} logoColor={props.color} />
          <Tx>
            <NameTag
              textColor="#000C"
              name="Beau Collins"
              title="Director of Merges"
            />
          </Tx>
        </Centered>
      </Bar>
    </Container>
  );
};

if (require.main) {
  const node = document.createElement('div');
  document.body.appendChild(node);
  render(<App />, node);
}
