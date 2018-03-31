import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { TopicItem } from './TopicItem';
import '../../src/App.css';

const Title = styled.h2`
  font-size: 24px;
  text-align: center;
`;

const List = styled.ul`
  list-style: none;
`;

class TopicList extends React.Component {
  render() {
    return (
      <List>
        {this.props.topicsQuery.topics &&
          this.props.topicsQuery.topics.map(topic => {
            const topicNameReadable = topic.name.split('/').slice(-1);
            return (
              <TopicItem name={topicNameReadable} key={topicNameReadable} />
            );
          })}
      </List>
    );
  }
}

const TOPICS_QUERY = gql`
  query TopicsQuery {
    topics {
      name
    }
  }
`;

export default graphql(TOPICS_QUERY, {
  name: 'topicsQuery'
})(TopicList);
