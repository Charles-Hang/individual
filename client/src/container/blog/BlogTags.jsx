import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import BlogTag from '../../component/blog/BlogTag';

import styles from './blogTags.css';

export default class BlogTags extends Component {
  static getTags() {
    return fetch('/getTags').then(response => response.json());
  }

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      tagsCount: 0,
    };
  }

  componentWillMount() {
    BlogTags.getTags().then((result) => {
      this.setState({
        tags: result,
        tagsCount: result.length,
      });
    });
  }

  render() {
    return (
      <div className={styles['tags-wrapper']}>
        <Route
          exact
          path={this.props.match.path}
          render={props => (
            <div>
              <h2 className={styles.title}>共计{this.state.tagsCount}个标签</h2>
              <div className={styles['tags-box']}>
                {this.state.tags.map(tag => <Tag key={tag.name} match={props.match} {...tag} />)}
              </div>
            </div>
          )}
        />
        <Route path={`${this.props.match.path}/:name`} component={BlogTag} />
      </div>
    );
  }
}

BlogTags.defaultProps = {
  match: {},
};

BlogTags.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }),
};

function Tag(props) {
  return (
    <div className={styles.tag}>
      <Link href to={`${props.match.path}/${props.name}`}>
        <span>{props.name}</span>
        <span>({props.count})</span>
      </Link>
    </div>
  );
}

Tag.defaultProps = {
  match: {},
  name: '',
  count: 0,
};

Tag.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }),
  name: PropTypes.string,
  count: PropTypes.number,
};
