import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import BlogCategory from '../../component/blog/BlogCategory';
import CategoryCard from '../../component/blog/CategoryCard';

import styles from './blogCategories.css';

export default class BlogCategories extends Component {
  static getCategories() {
    return fetch('/getCategories').then(response => response.json());
  }

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      categoriesCount: 0,
    };
  }

  componentWillMount() {
    BlogCategories.getCategories().then((result) => {
      this.setState({
        categories: result,
        categoriesCount: result.length,
      });
    });
  }

  render() {
    return (
      <div className={styles['categories-wrapper']}>
        <Route
          exact
          path={this.props.match.path}
          render={props => (
            <div>
              <h2 className={styles.title}>共计{this.state.categoriesCount}个分类</h2>
              <div className={styles['card-box']}>
                {this.state.categories.map(type => (
                  <CategoryCard
                    match={props.match}
                    key={type.name}
                    name={type.name}
                    count={type.count}
                  />
                ))}
              </div>
            </div>
          )}
        />
        <Route path={`${this.props.match.path}/:name`} component={BlogCategory} />
      </div>
    );
  }
}

BlogCategories.defaultProps = {
  match: {},
};

BlogCategories.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }),
};
