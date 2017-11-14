import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
import ClueBox from './ClueBox';

export default class BlogCategory extends Component {
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
    this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    this.getArticles(1, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogCategory.transformArticle(result.articles);
        articles.unshift({
          id: 'category',
          type: 'large',
          name: `${this.props.match.params.name}分类`,
        });
        this.setState({
          articles,
          articlesCount: parseInt(result.allCount, 10),
          allPage: Math.ceil(result.allCount / this.limit).toString(),
          currentPage: '1',
        });
      });
  }

  getArticles(page, limit) {
    return fetch(`/getArticlesByCategory?page=${page}&limit=${limit}&category=${encodeURI(this.props.match.params.name)}`)
      .then(response => response.json())
      .catch((err) => {
        console.log(err);
      });
  }

  changePage(newPage) {
    this.getArticles(newPage, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogCategory.transformArticle(result.articles);
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
      <div>
        <ClueBox data={this.state.articles} />
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

BlogCategory.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

BlogCategory.defaultProps = {
  match: {},
};
