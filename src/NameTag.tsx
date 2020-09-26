import React from 'react';
import styled from 'styled-components';
import Shape from './Shape';

const Flex = styled.div<{ mode: 'row' | 'column' }>`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: ${({ mode }) => mode};
  padding: 1rem;
`;

const Text = styled.div<{ textColor: string }>`
  z-index: 2;
  position: relative;
  text-align: right;
  color: ${({ textColor }) => textColor};
  margin-inline-end: 1rem;
`;

const Name = styled(Text)`
  font-size: 3rem;
  font-weight: 800;
`;

const Title = styled(Text)`
  font-size: 2rem;
  font-style: italic;
  font-weight: 100;
`;
const AngleBackground = styled(Shape)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
export const NameTag = ({
  name,
  title,
  textColor = '#dd4a40',
}: {
  name: React.ReactNode;
  title: React.ReactNode;
  textColor?: string;
}) => (
  <Flex mode="column">
    <AngleBackground scope={0.4} />
    <Name textColor={textColor}>{name}</Name>
    <Title textColor={textColor}>{title}</Title>
  </Flex>
);
