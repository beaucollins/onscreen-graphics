import React from 'react';
import styled from 'styled-components';
import Shape from './Shape';
import { UserBar } from './UserBar';

const Flex = styled.div<{ mode: 'row' | 'column'; maxWidth?: string }>`
  position: relative;
  display: flex;
  flex: 1;
  max-width: ${({ maxWidth }) => (maxWidth == null ? 'auto' : maxWidth)};
  flex-direction: ${({ mode }) => mode};
  justify-content: center;
  overflow: hidden;
`;

const Text = styled.div<{ textColor: string }>`
  overflow: hidden;
  z-index: 2;
  position: relative;
  text-align: left;
  color: ${({ textColor }) => textColor};
  margin-inline-end: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
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
    <Name textColor={textColor}>{name}</Name>
    <Title textColor={textColor}>{title}</Title>
  </Flex>
);
