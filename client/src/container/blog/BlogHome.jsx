import React, { Component } from 'react';
import ArticleCard from '../../component/blog/ArticleCard';
import Pagination from '../../component/blog/Pagination';

import styles from './blogHome.css';

export default class BlogHome extends Component {
  static getArticles(page, limit) {
    return fetch(`/getPublishedArticles?page=${page}&limit=${limit}`).then(response => response.json());
  }

  static transformArticle(articles) {
    const result = [];
    articles.forEach((article) => {
      const urlArr = article.url.split('/');
      const date = new Date(article.birthTime);
      const tags = article.tags.map(tag => tag.name);
      const { _id: id } = article;
      const obj = {
        id,
        title: article.title,
        fileName: urlArr[urlArr.length - 1],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        tags,
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
      currentPage: '',
      allPage: '',
    };
    this.limit = 10;
    this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    BlogHome.getArticles(1, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogHome.transformArticle(result.articles);
        this.setState({
          articles,
          articlesCount: parseInt(result.allCount, 10),
          allPage: Math.ceil(result.allCount / this.limit).toString(),
          currentPage: '1',
        });
      });
  }

  changePage(newPage) {
    BlogHome.getArticles(newPage, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogHome.transformArticle(result.articles);
        this.setState({
          articles,
          articlesCount: parseInt(result.allCount, 10),
          allPage: Math.ceil(result.allCount / this.limit).toString(),
          currentPage: newPage.toString(),
        });
      });
  }
  render() {
    return (
      <div className={styles['home-wrapper']}>
        {this.state.articles.map(article => <ArticleCard key={article.id} article={article} />)}
        {this.state.articlesCount > this.limit &&
          <Pagination
            pages={this.state.allPage}
            current={this.state.currentPage}
            changePage={this.changePage}
          />
        }
      </div>
    );
  }
}
