import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const TopicItemSubject = styled.li`
  display: flex;
  justify-content: center;
  background-color: ${props => {
    if (props.index % 2 === 0) return '#f5f5f5'
    return '#ebebeb'
  }};
  font-size: 1.2em;
  font-weight: bold;
  padding: 8px 0;
  color: #111;
`

export const TopicItem = ({ index, name }) => (
  <Link to={`/topic/${name}`}>
    <TopicItemSubject index={index}>{name}</TopicItemSubject>
  </Link>
)
