import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Route,
} from 'react-router-dom';
import BlogHome from './BlogHome';
import BlogCategories from './BlogCategories';
import BlogTags from './BlogTags';
import BlogArchives from './BlogArchives';
import BlogWatching from './BlogWatching';
import Content from '../../component/blog/Content';
import Mood from '../../component/blog/Mood';
import utils from '../../utils/utils';

import styles from './blogIndex.css';

export default class BlogIndex extends Component {
  static pathIn(pathname, path) {
    const paths = pathname.split('/');
    return paths.includes(path);
  }

  static handleItems(e) {
    e.target.classList.toggle('active');
  }

  static handleMood(e) {
    e.target.classList.toggle('active');
  }

  static scrollToTop() {
    utils.scrollTo(0);
  }

  constructor() {
    super();
    this.state = {
      lastActive: null,
    };
    this.toTopBtn = null;
    this.scrollHandling = this.scrollHandling.bind(this);
  }

  componentWillMount() {
    fetch('/getSign')
      .then(response => response.text())
      .then((result) => {
        this.setState({
          sign: result,
        });
      });
    window.eventEmitter = {
      events: {},
      dispatch(event, data = '', callback = '') {
        if (!this.events[event]) return; // no one is listening to this event
        for (let i = 0; i < this.events[event].length; i += 1) {
          this.events[event][i](data, callback);
        }
      },
      subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = []; // new event
        this.events[event].push(callback);
      },
      unSubscribe(event) {
        if (this.events && this.events[event]) {
          delete this.events[event];
        }
      },
    };
  }

  componentDidMount() {
    document.title = '午星的博客';
    [this.toTopBtn] = document.getElementsByClassName(styles['to-top-btn']);
    window.addEventListener('scroll', this.scrollHandling);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandling);
  }

  scrollHandling() {
    const scrollTop = document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    if (scrollTop >= 371) {
      this.toTopBtn.classList.add('active');
    } else {
      this.toTopBtn.classList.remove('active');
    }
  }

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.line} />
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <div className={styles['visiting-card']}>
              <h1><Link href to="/blog/back" style={{ cursor: 'default' }}>午星的博客</Link></h1>
              <p>{this.state.sign}</p>
            </div>
            <i
              className={`${styles['bar-icon']} iconfont icon-shangpinfenlei01`}
              onClick={(e) => { BlogIndex.handleItems(e); }}
              onKeyDown={() => {}}
              role="button"
              tabIndex="-1"
            />
            <Route
              path={this.props.match.path}
              render={(props) => {
                const pathReg = /^\/blog\/\d+\/\d+\/\d+\/\S+$/;
                if (!pathReg.test(props.location.pathname)) {
                  return (<i
                    className={`${styles['mood-icon']} iconfont icon-161coffee`}
                    onClick={(e) => { BlogIndex.handleMood(e); }}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex="-1"
                  />);
                }
                return null;
              }}
            />
            <ul className={styles['item-box']}>
              <li className={this.props.location.pathname === '/blog' ? 'active' : ''}>
                <Link href to="/blog">
                  <i className="iconfont icon-home" style={{ fontSize: 16, color: '#e74c3c', marginRight: '10px' }} />
                  首页
                  <i className={`${styles['active-dot']} ${styles.dot1}`} />
                </Link>
              </li>
              <li className={BlogIndex.pathIn(this.props.location.pathname, 'categories') ? 'active' : ''}>
                <Link href to="/blog/categories">
                  <i
                    className="iconfont icon-viewgallery"
                    style={{ fontSize: 15, color: '#f0ad4e', marginRight: '10px' }}
                  />
                  分类
                  <i className={`${styles['active-dot']} ${styles.dot2}`} />
                </Link>
              </li>
              <li className={BlogIndex.pathIn(this.props.location.pathname, 'tags') ? 'active' : ''}>
                <Link href to="/blog/tags">
                  <i
                    className="iconfont icon-discount"
                    style={{
                      fontSize: 15,
                      color: '#1abc9c',
                      marginRight: '10px',
                      verticalAlign: '-1px',
                    }}
                  />
                  标签
                  <i className={`${styles['active-dot']} ${styles.dot3}`} />
                </Link>
              </li>
              <li className={BlogIndex.pathIn(this.props.location.pathname, 'archives') ? 'active' : ''}>
                <Link href to="/blog/archives">
                  <i
                    className="iconfont icon-box"
                    style={{
                      fontSize: 16,
                      color: '#5bc0de',
                      marginRight: '10px',
                      verticalAlign: '-1px',
                    }}
                  />
                  归档
                  <i className={`${styles['active-dot']} ${styles.dot4}`} />
                </Link>
              </li>
            </ul>
            <Route
              path={this.props.match.path}
              render={(props) => {
                const pathReg = /^\/blog\/\d+\/\d+\/\d+\/\S+$/;
                if (pathReg.test(props.location.pathname)) {
                  return (
                    <div className={styles.content}>
                      <Content />
                    </div>
                  );
                }
                return (
                  <div className={styles.mood}>
                    <Mood />
                  </div>
                );
              }}
            />
          </div>
          <div className={styles.main}>
            <Route exact path={this.props.match.path} component={BlogHome} />
            <Route
              exact
              path={`${this.props.match.path}/:year(\\d+)/:month(\\d+)/:day(\\d+)/:name`}
              render={(props) => {
                this.state.lastActive && this.state.lastActive.classList.remove('active');
                return <BlogWatching {...props} />;
              }}
            />
            <Route path={`${this.props.match.path}/categories`} component={BlogCategories} />
            <Route path={`${this.props.match.path}/tags`} component={BlogTags} />
            <Route path={`${this.props.match.path}/archives`} component={BlogArchives} />
          </div>
        </div>
        <span
          className={styles['to-top-btn']}
          onClick={() => { BlogIndex.scrollToTop(); }}
          onKeyDown={() => {}}
          role="button"
          tabIndex="-1"
        >
          <i className="iconfont icon-top" />
        </span>
      </div>
    );
  }
}

BlogIndex.defaultProps = {
  match: {},
  location: {},
};

BlogIndex.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
