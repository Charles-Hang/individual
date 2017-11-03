import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styles from './categoryCard.css';

export default class CategoryCard extends Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.count = props.count;
    this.colors = ['#18232f', '#e74c3c', '#f0ad4e', '#1abc9c', '#5bc0de', '#9b59b6', '#34495e'];
    this.color = this.colors[Math.round(Math.random() * 6)];
  }

  render() {
    return (
      <div
        className={styles['type-card']}
      >
        <Link to={this.props.match.path + '/' + this.name}>
          <span>{this.name}</span>
          <span>({this.count})</span>
        </Link>
      </div>
    )
  }
}