import React, { Component } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import TopicList from './components/TopicList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header>gcp pubsub debugger</Header>
        <TopicList />
        <Footer>
          Franck the
          <span role="img" aria-label="geek">
            🤓
          </span>
        </Footer>
      </div>
    );
  }
}

export default App;
