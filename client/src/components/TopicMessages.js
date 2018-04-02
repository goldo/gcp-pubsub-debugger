import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import JSONPretty from 'react-json-pretty';

const TopicName = styled.h1`
  color: #00a7e1;
  font-size: 1.5em;
  padding-bottom: 30px;
`;

const Detail = styled.div`
  text-align: left;
  border-radius: 5px;
  text-align: left;
  font-size: 14px;
`;

const MessageTable = styled.div`
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: 200px 1fr 5fr;
  padding: 10px 20px;
  border-bottom: 2px solid #efefef;
`;

const WhiteSpacePreWrap = styled.div`
  *:first-child {
    white-space: pre-wrap;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: Title;
`;

class TopicMessages extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <TopicName>{match.params.name}</TopicName>
        <Query
          query={MESSAGE_QUERY}
          variables={{ topicName: match.params.name }}
        >
          {({ subscribeToMore, data: { messages = [] } = {}, ...result }) => (
            <MessageList
              messages={messages}
              {...result}
              subscribeToNewMessages={() =>
                subscribeToMore({
                  document: MESSAGE_SUBSCRIPTION,
                  variables: { topicName: match.params.name },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newMessage = subscriptionData.data.message;

                    return Object.assign({}, prev, {
                      messages: [newMessage, ...prev.messages]
                    });
                  }
                })
              }
            />
          )}
        </Query>
      </div>
    );
  }
}

class MessageList extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewMessages();
  }
  render() {
    const { messages } = this.props;
    return (
      messages &&
      (!!messages.length ? (
        <Detail>
          <MessageTable>
            <Title>Date</Title>
            <Title>Attributes</Title>
            <Title>Data</Title>
          </MessageTable>
          {messages.map(message => (
            <MessageTable key={message.id}>
              <div>{message.publishTime}</div>
              <div>
                {!!Object.keys(message.attributes).length && (
                  <JSONPretty
                    id={`attributes-${message.id}`}
                    json={message.attributes}
                  />
                )}
              </div>
              <div>
                {Object.keys(message.data) ? (
                  <WhiteSpacePreWrap>
                    <JSONPretty id={`data-${message.id}`} json={message.data} />
                  </WhiteSpacePreWrap>
                ) : (
                  message.data
                )}
              </div>
            </MessageTable>
          ))}
        </Detail>
      ) : (
        <p>No message received</p>
      ))
    );
  }
}

const MessageFragment = gql`
  fragment Message on Message {
    id
    data
    attributes
    publishTime
  }
`;

const MESSAGE_QUERY = gql`
  query MessageQuery($topicName: String!) {
    messages(topicName: $topicName) {
      ...Message
    }
  }
  ${MessageFragment}
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription newMessage($topicName: String!) {
    message(topicName: $topicName) {
      ...Message
    }
  }
  ${MessageFragment}
`;

export default withRouter(TopicMessages);
