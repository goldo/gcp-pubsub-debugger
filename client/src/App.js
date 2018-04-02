import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Header } from './components/Header';
import TopicList from './components/TopicList';
import TopicItemDetail from './components/TopicItemDetail';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header>gcp pubsub debugger</Header>
        <Switch>
          <Route exact path="/" component={TopicList} />
          <Route exact path="/topic/:name" component={TopicItemDetail} />
        </Switch>
      </div>
    );
  }
}

export default App;
