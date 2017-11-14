import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClueBox from './ClueBox';
import Pagination from './Pagination';

export default class BlogTag extends Component {
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
        const articles = BlogTag.transformArticle(result.articles);
        articles.unshift({
          id: 'tag',
          type: 'large',
          name: `${this.props.match.params.name}标签`,
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
    return fetch(`/getArticlesByTag?page=${page}&limit=${limit}&tag=${encodeURI(this.props.match.params.name)}`)
      .then(response => response.json());
  }

  changePage(newPage) {
    this.getArticles(newPage, this.limit)
      .then((result) => {
        // console.log(result);
        const articles = BlogTag.transformArticle(result.articles);
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
BlogTag.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

BlogTag.defaultProps = {
  match: {},
};
