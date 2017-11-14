import React, { Component } from 'react';
import ClueBox from '../../component/blog/ClueBox';
import Pagination from '../../component/blog/Pagination';

import styles from './blogArchives.css';

export default class BlogArchives extends Component {
  static changePage(newPage) {
    BlogArchives.getArticles(newPage, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogArchives.transformArticle(result.articles);
        this.setState({
          articles,
          articlesCount: parseInt(result.allCount, 10),
          allPage: Math.ceil(result.allCount / this.limit).toString(),
          currentPage: newPage.toString(),
        });
      });
  }

  static getArticles(page, limit) {
    return fetch(`/getPublishedArticles?page=${page}&limit=${limit}`).then(response => response.json());
  }

  static transformArticle(articles) {
    const result = [];
    let year = '';
    articles.forEach((article) => {
      const urlArr = article.url.split('/');
      const date = new Date(article.birthTime);
      const { _id: id } = article;
      if (date.getFullYear().toString() !== year) {
        year = date.getFullYear().toString();
        result.push({
          id: id + year,
          type: 'large',
          name: year,
        });
      }
      const obj = {
        id,
        type: 'small',
        name: article.title,
        fileName: urlArr[urlArr.length - 1],
        date: `${date.getMonth() + 1}-${date.getDate()}`,
        url: `/blog/${year}/${date.getMonth() + 1}/${date.getDate()}/${urlArr[urlArr.length - 1]}`,
      };
      result.push(obj);
    });
    return result;
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      articlesCount: 0,
      allPage: '',
      currentPage: '',
    };
    this.limit = 10;
  }

  componentWillMount() {
    BlogArchives.getArticles(1, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogArchives.transformArticle(result.articles);
        articles.unshift({
          id: 'archives',
          type: 'large',
          name: `共计${result.allCount}篇博客`,
        });
        this.setState({
          articles,
          articlesCount: parseInt(result.allCount, 10),
          allPage: Math.ceil(result.allCount / this.limit).toString(),
          currentPage: '1',
        });
      });
  }

  render() {
    return (
      <div className={styles['archives-wrapper']}>
        <ClueBox data={this.state.articles} />
        {this.state.articlesCount > this.limit &&
          <Pagination
            pages={this.state.allPage}
            current={this.state.currentPage}
            changePage={BlogArchives.changePage}
          />
        }
      </div>
    );
  }
}
