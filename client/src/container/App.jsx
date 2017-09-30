import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';
import Home from './Home.jsx';
import BlogIndex from './blog/BlogIndex.jsx';
import Resume from './resume/Resume.jsx';
import ProjectHome from './project/ProjectHome.jsx';
import BlogBack from 'bundle-loader?lazy&name=admin!./blog/back/BlogBack.jsx';
import Bundle from './Bundle.jsx';

import '../styleReset/reset.css';

const LoadBlogBack = (props) => (
  <Bundle load={BlogBack}>
    {(BlogBack) => <BlogBack {...props}/>}
  </Bundle>
)

export default class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/blog/back" component={LoadBlogBack}/>
          <Route path="/blog" component={BlogIndex} />
          <Route path="/resume" component={Resume} />
          <Route path="/project" component={ProjectHome} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}