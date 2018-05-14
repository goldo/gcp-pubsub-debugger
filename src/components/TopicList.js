import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { TopicItem } from './TopicItem'
import '../../src/App.css'

const Title = styled.h2`
  color: #00a7e1;
  font-size: 1.5em;
  text-align: center;
  padding-bottom: 1.2em;
`

const List = styled.ul`
  list-style: none;
  border: 1px solid #ebebeb;
  width: 70%;
  margin: auto;
`

class TopicList extends React.Component {
  render() {
    return (
      <div>
        <Title>Topics</Title>
        <List>
          {this.props.topicsQuery.topics &&
            this.props.topicsQuery.topics.map((topic, index) => {
              const topicNameReadable = topic.name.split('/').slice(-1)
              return (
                <TopicItem
                  name={topicNameReadable}
                  key={topicNameReadable}
                  index={index}
                />
              )
            })}
        </List>
      </div>
    )
  }
}

const TOPICS_QUERY = gql`
  query TopicsQuery {
    topics {
      name
    }
  }
`

const GetTopics = graphql(TOPICS_QUERY, {
  name: 'topicsQuery',
  options: () => ({
    fetchPolicy: 'cache-and-network'
  })
})(TopicList)

export default withRouter(GetTopics)
