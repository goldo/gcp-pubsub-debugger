import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'
import { Header } from './components/Header'
import TopicList from './components/TopicList'
import TopicMessages from './components/TopicMessages'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to={`/`}>
          <Header>gcp pubsub debugger</Header>
        </Link>
        <Switch>
          <Route exact path="/" component={TopicList} />
          <Route exact path="/topic/:name" component={TopicMessages} />
        </Switch>
      </div>
    )
  }
}

export default App
