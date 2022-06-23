import React, { StrictMode, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { animated, useTransition } from 'react-spring';
import styled, { createGlobalStyle } from 'styled-components';
import { Logo } from './Logo';
import { NameTag } from './NameTag';
import { Path, Size } from './UserBar';

const Global = createGlobalStyle`
  body {
    background: #000;
    margin: 0;
    font: 12px Avenir, Helvetica, sans-serif;
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

const Centered = styled(animated.div)`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 2em;
  padding: 1em;
  overflow: hidden;
`;

const Dancing = styled(animated(Logo))`
  align-self: flex-end;
`;

const F = styled(animated.div)`
  flex: 1;
`;

const P = styled.div`
  flex: 1;
  perspective: 1000px;
  margin-inline-start: 3em;
  margin-inline-end: 2em;
`;

const Tx = ({ children }: { children: React.ReactNode }) => {
  const [visible, set] = useState(false);
  const transitions = useTransition(visible, {
    from: { opacity: '0' },
    enter: { opacity: '1' },
  });
  useEffect(() => set(true));
  return (
    <P>
      {transitions((props, item) =>
        item ? <F style={props}>{children}</F> : null
      )}
    </P>
  );
};

/*
 given a percent of circle:
  - calculate starting radian point
  - translate percent into radians d starting radian
  - use radius and radians to compute the
*/

// given a width and height, make pill shape
// translate to vectors
// vertical vectors use arcs, use ap
function pillPath(size: Size): string {
  const path: Path = [];
  return '';
}

const Names = styled(animated.div)`
  position: absolute;
  left: 4em;
  right: calc(128px + 1em);
  top: 1em;
  bottom: 1em;
`;

const Pill = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fffc;
  z-index: -1;
  border-radius: 100vh;
`;

type Props = {
  createListener: (update: (value: string) => void) => void | (() => void);
  name?: string;
};

const App = ({ createListener, name = 'Roomie McRoomerson' }: Props) => {
  const [state, set] = useState<string[]>([]);
  useEffect(() => {
    return createListener((value) => {
      set(value.trim() === '' ? [] : [value]);
    });
  }, []);
  const transitions = useTransition<
    string,
    { transform: string; width: string; opacity: number; names: string }
  >(state, {
    from: () => ({
      transform: 'rotateZ(-360deg) scale(0, 0)',
      width: '0%',
      opacity: 0,
      names: '0',
    }),
    enter: () => async (next) => {
      await next({ transform: 'rotateZ(1080deg) scale(1, 1)', opacity: 1 });
      await next({ width: '75%', names: '1' });
    },
    leave: () => ({
      opacity: 0,
    }),
  });

  return (
    <Container>
      <Global />
      {transitions((style, item, t, i) => (
        <Bar>
          <Centered style={{ ...style, minWidth: '120px' }}>
            <Names style={{ opacity: (style as any).names }}>
              <NameTag textColor="#000C" name={name} title={item} />
            </Names>
            <Dancing size={120} logoColor="#0006" />
            <Pill />
          </Centered>
        </Bar>
      ))}
    </Container>
  );
};

if (require.main) {
  function withConnection(update: (value: string) => void) {
    const socket = new WebSocket(
      `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`
    );
    socket.addEventListener('message', (event) => {
      update(event.data);
    });
    socket.addEventListener('close', () => {
      withConnection(update);
    });
    (global as any).sendTitle = (value: string) => {
      socket.send(value);
    };
  }
  const node = document.createElement('div');
  document.body.appendChild(node);
  const query = new URLSearchParams(location.search);

  render(
    <StrictMode>
      <App
        createListener={(update) => {
          withConnection(update);
        }}
        name={query.get('name') ?? undefined}
      />
    </StrictMode>,
    node
  );
}
