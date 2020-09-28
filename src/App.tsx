import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import {
  animated,
  ReactSpringHook,
  useChain,
  useSpring,
  useTransition,
} from 'react-spring';
import styled, { createGlobalStyle } from 'styled-components';
import { Logo } from './Logo';
import { NameTag } from './NameTag';
import { UserBar, createPath, Vector, Path, Size } from './UserBar';

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
  const transitions = useTransition(visible, null, {
    from: { opacity: '0' },
    enter: { opacity: '1' },
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

const App = ({
  createListener,
}: {
  createListener: (update: (value: string) => void) => void | (() => void);
}) => {
  const [state, set] = useState<string[]>([]);
  useEffect(() => {
    return createListener((value) => {
      set(value.trim() === '' ? [] : [value]);
    });
  }, []);
  const transitions = useTransition(state, (item) => item, {
    from: (item) => ({
      transform: 'rotateZ(-360deg) scale(0, 0)',
      width: '0%',
      opacity: 0,
      names: '0',
    }),
    enter: (item) => async (next: any) => {
      await next({ transform: 'rotateZ(1080deg) scale(1, 1)', opacity: 1 });
      await next({ width: '75%', names: '1' });
    },
    leave: (item) => ({
      opacity: 0,
    }),
  });

  return (
    <Container>
      <Global />
      {transitions.map(({ item, props, key }) => (
        <Bar key={key}>
          <Centered style={{ ...props, width: props.width, minWidth: '120px' }}>
            <Names style={{ opacity: (props as any).names }}>
              <NameTag
                textColor="#000C"
                name="Robert Hale Collins III"
                title={item}
              />
            </Names>
            <Dancing size={120} logoColor="#0006" />
            <Pill />
          </Centered>
        </Bar>
      ))}
    </Container>
  );
};

function demo(push: (value: string) => void) {
  let running = true;
  let current: number | undefined = undefined;
  const wait = async (ms = 1000) =>
    new Promise((resolve, reject) => {
      current = setInterval(() => {
        if (!running) {
          reject(new Error('Interrupted'));
          return;
        }
        resolve();
      }, ms);
    });
  const main = async () => {
    let toggle = true;

    const toggleValue = () => {
      toggle = !toggle;
      push(toggle ? 'bye' : 'hello');
    };

    window.addEventListener('keydown', (e) => {
      if (e.code) {
        console.log('pressed', e.code, e.key);
        toggleValue();
      }
    });

    try {
      await wait(1000);
      push('hello');

      // while (true) {
      //   await wait(3000);
      //   toggleValue();
      // }
    } catch (error) {
      // do nothing
    }
  };

  main();
  return () => {
    running = false;
    current && clearInterval(current);
  };
}

if (require.main) {
  function withConnection(update: (value: string) => void) {
    const socket = new WebSocket(`ws://${location.host}`);
    socket.addEventListener('message', (event) => {
      update(event.data);
    });
    socket.addEventListener('close', () => {
      withConnection(update);
    });
    (global as any).sendTitle = (value: string) => {
      console.log('send');
      socket.send(value);
    };
  }
  const node = document.createElement('div');
  document.body.appendChild(node);
  render(
    <App
      createListener={(update) => {
        withConnection(update);
      }}
    />,
    node
  );
}
