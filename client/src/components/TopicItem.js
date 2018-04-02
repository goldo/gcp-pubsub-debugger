import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TopicItemSubject = styled.li`
  display: flex;
  justify-content: center;
  background-color: ${props => {
    if (props.index % 2 === 0) return '#edf5fc';
    return '#f8f4e3';
  }};
  font-size: 1.2em;
  font-weight: bold;
  padding: 8px 0;
  border: 2px solid #ffffff;
`;

let linkStyle = {
  textDecoration: 'none'
};

export const TopicItem = ({ index, name }) => (
  <Link to={`/topic/${name}`} style={linkStyle}>
    <TopicItemSubject index={index}>{name}</TopicItemSubject>
  </Link>
);
