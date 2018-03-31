import React from 'react';
import styled from 'styled-components';
//import { TopicItemContent } from './TopicItemContent';

const Item = styled.li`
  display: flex;
  font-style: italic;
  justify-content: center;
`;

const TopicItemSubject = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

export const TopicItem = props => (
  <Item>
    <TopicItemSubject>{props.name}</TopicItemSubject>
    {/*<TopicItemContent />*/}
  </Item>
);
