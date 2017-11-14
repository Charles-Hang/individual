import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';

import styles from './articleCard.css';

export default class ArticleCard extends Component {
  // props.article {
  //  id
  //  title
  //  fileName
  //  date
  //  tags
  // }
  constructor(props) {
    super(props);
    this.colors = ['#18232f', '#1abc9c', '#9b59b6', '#5bc0de', '#f0ad4e', '#e74c3c', '#34495e'];
    this.color = this.colors[Math.round(Math.random() * 6)]; // 标签颜色
  }

  getPath() {
    const date = this.props.article.date.split('-').join('/');
    return `/blog/${date}/${this.props.article.fileName}`;
  }

  saveArticleId() {
    window.sessionStorage.setItem(this.props.article.fileName, this.props.article.id);
  }
  render() {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>
          <Link
            href
            to={this.getPath()}
            className={styles.link}
            onClick={() => { this.saveArticleId(); }}
          >
            {this.props.article.title}
          </Link>
        </h1>
        <div className={styles.msg}>
          <div>发表于 {this.props.article.date}</div>
          {!!this.props.article.tags.length && <i className={styles['msg-gap']} />}
          {this.props.article.tags.map(tag => (
            <div key={tag} className={styles.tags} style={{ background: this.color }}>
              <i className={styles['tag-triangle']} style={{ borderRightColor: this.color }} />
              <Link href to={`/blog/tags/${tag}`} style={{ marginRight: '10px' }}>{tag}</Link>
            </div>
          ))}
        </div>
        <div style={{ marginLeft: '40px', marginRight: '40px' }} />
        <div className={styles.bottom} />
      </div>
    );
  }
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
