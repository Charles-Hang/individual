import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Home from './Home';
import BlogIndex from './blog/BlogIndex';
import Resume from './resume/Resume';
import ProjectHome from './project/ProjectHome';
// import BlogBack from './blog/back/BlogBack';
import Bundle from './Bundle';

import '../styleReset/reset.css';

// blogback懒加载
const LoadBlogBack = props => (
  <Bundle load={(cb) => {
    require.ensure([], (require) => {
      cb(require('./blog/back/BlogBack'));
    }, 'admin');
  }}
  >
    {BlogBack => <BlogBack {...props} />}
  </Bundle>
);

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/blog/back" component={LoadBlogBack} />
      <Route path="/blog" component={BlogIndex} />
      <Route path="/resume" component={Resume} />
      <Route path="/project" component={ProjectHome} />
      <Redirect to="/" />
    </Switch>
  </Router>
);
export default App;
