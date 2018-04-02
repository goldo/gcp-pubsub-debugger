import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import styled from 'styled-components';

const Detail = styled.div`
  background-color: lightyellow;
  border-radius: 5px;
  padding: 10px 100px;
  margin: 0 150px;
`;

const TopicName = styled.h1`
  color: #00a7e1;
  font-size: 28px;
  padding-bottom: 30px;
`;

const SingleDetail = styled.div`
  padding-bottom: 25px;
  font-size: 20px;
`;

let bold = {
  fontWeight: 'bold'
};

const TopicItemDetail = props =>
  (props.messageQuery.messages && console.log(props.messageQuery.messages)) || (
    <div>
      <Detail>
        <TopicName>{props.match.params.name}</TopicName>
        {props.messageQuery.messages &&
          props.messageQuery.messages.map(message => (
            <SingleDetail key={message.id}>
              <div style={bold}>{message.data}</div>
              <div>{JSON.stringify(message.attributes)}</div>
              <div>{message.publishTime}</div>
            </SingleDetail>
          ))}
      </Detail>
    </div>
  );

const MESSAGE_QUERY = gql`
  query MessageQuery($topicName: String!) {
    messages(topicName: $topicName) {
      id
      data
      attributes
      publishTime
    }
  }
`;

const getTopicDetails = graphql(MESSAGE_QUERY, {
  name: 'messageQuery',
  options: props => ({
    variables: {
      topicName: props.match.params.name
    }
  })
})(TopicItemDetail);

export default withRouter(getTopicDetails);
