import React, { Component } from 'react';
import { Header } from './components/Header';
import TopicList from './components/TopicList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header>gcp pubsub debugger</Header>
        <TopicList />
      </div>
    );
  }
}

export default App;
