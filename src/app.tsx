import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { animated, useSpring, useTransition } from 'react-spring';
import styled, { createGlobalStyle } from 'styled-components';
import { Logo } from './Logo';
import { NameTag } from './NameTag';
import { UserBar } from './UserBar';

const Global = createGlobalStyle`
  body {
    background: #000;
    margin: 0;
    font: 12px Avenir;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Bar = styled(animated.div)`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1em;
  box-sizing: border-box;
  background: linear-gradient(#0000, #0006);
`;

const Centered = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 2em;
  padding: 1em;
  padding-inline-end: 4em;
`;

const Dancing = styled(animated(Logo))`
  margin-inline-end: 4em;
`;

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

const PillBackground = styled(UserBar)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
`;

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
          <Dancing size={120} logoColor={props.color} />
          <Tx>
            <NameTag
              textColor="#000C"
              name="Robert Hale Collins III"
              title="Director of Merge Conflicts"
            />
          </Tx>
          <PillBackground fill="#fffc" />
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
