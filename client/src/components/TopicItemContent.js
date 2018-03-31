import React from 'react';
import styled from 'styled-components';
import '../../src/App.css';

const Content = styled.p`
  font-size: 18px;
`;

export const TopicItemContent = ({ content = 'Topic Item Content' }) => (
  <Content>{content}</Content>
);
