import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, message } from 'antd';
import utils from '../../../utils/utils';
import VerifyBox from '../../../component/blog/VerifyBox';
import BlogEditor from '../../../component/blog/BlogEditor';

import styles from './blogBackHome.css';

export default class BlogBackHome extends Component {
  static transfromArticles(articles) {
    const result = [];
    articles.forEach((article) => {
      const { _id: key } = article;
      result.push({
        key,
        title: article.title,
        birthTime: utils.parseDetailDate(article.birthTime),
        published: article.publish,
      });
    });
    return result;
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      contentType: 'blogList',
      mood: '',
      sign: '',
      showVerifyBox: false,
      deleteKey: '',
      editKey: '',
      editFilename: '',
      editContent: '',
      startToEdit: false,
    };
    this.sureToEdit = this.sureToEdit.bind(this);
    this.publish = this.publish.bind(this);
    this.sureToDeleteArticle = this.sureToDeleteArticle.bind(this);
    this.cancelVerify = this.cancelVerify.bind(this);
  }

  componentDidMount() {
    this.getAllArticles()
      .then((result) => {
        this.setState({
          articles: BlogBackHome.transfromArticles(result),
        });
      });
  }

  getAllArticles() {
    return fetch('/getAllArticles', {
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
    }).then((response) => {
      // console.log(response);
      if (response.status === 401) {
        this.props.logout();
      }
      return response.json();
    });
  }

  changeType(e) {
    const { type } = e.target.dataset;
    type !== this.state.contentType &&
      this.setState({
        contentType: type,
      });
    if (type === 'blogList') {
      this.getAllArticles()
        .then((result) => {
          if (!result) return;
          this.setState({
            articles: BlogBackHome.transfromArticles(result),
          });
        });
    }
  }

  textareaChanged(e, type) {
    this.setState({
      [type]: e.target.value,
    });
  }

  sureChangeMoodSign(type) {
    fetch(`/modify${type}`, {
      method: 'POST',
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      body: this.state[type.toLowerCase()],
    }).then((response) => {
      if (response.status === 401) {
        this.props.logout();
      }
      return response.text();
    }).then((result) => {
      // console.log(result);
      if (result === 'success') {
        message.success('修改成功！');
      }
    });
  }

  deleteArticle(key) {
    this.setState({
      deleteKey: key,
      showVerifyBox: true,
    });
  }

  sureToDeleteArticle(username, password) {
    this.setState({
      showVerifyBox: false,
    });
    fetch('/deleteArticle', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        id: this.state.deleteKey,
      }),
    }).then(response => response.text())
      .then((result) => {
        if (result === 'success') {
          this.deleteArticleInTable();
        } else {
          message.warn('用户名或密码有误！');
        }
      });
  }

  deleteArticleInTable() {
    const { articles } = this.state;
    const index = articles.findIndex(article => article.key === this.state.deleteKey);
    articles.splice(index, 1);
    this.setState({
      articles,
    });
  }

  cancelVerify() {
    this.setState({
      showVerifyBox: false,
    });
  }

  togglePublish(published, key) {
    fetch('/togglePublish', {
      method: 'POST',
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        publish: !published,
        id: key,
      }),
    }).then((response) => {
      if (response.status === 401) {
        this.props.logout();
      }
      return response.json();
    }).then((result) => {
      if (!result) return;
      // console.log(result);
      const { articles } = this.state;
      const { _id: id } = result;
      const index = articles.findIndex(article => article.key === id);
      articles[index].published = result.publish;
      this.setState({
        articles,
      });
    });
  }

  publish(filename, content) {
    fetch('/publish', {
      method: 'POST',
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        filename,
        content,
      }),
    }).then((response) => {
      if (response.status === 401) {
        this.props.logout();
      }
      return response.text();
    }).then((result) => {
      if (result === 'success') {
        message.success('发布成功！');
      }
    });
  }

  editArticle(key) {
    fetch(`/getArticleContent?id=${key}`, {
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
    }).then((response) => {
      if (response.status === 401) {
        this.props.logout();
      }
      return response.json();
    }).then((result) => {
      this.setState({
        editFilename: result.filename,
        editContent: result.content,
        editKey: key,
        startToEdit: true,
      });
    });
  }

  cancelEdit() {
    this.setState({
      editKey: '',
      editFilename: '',
      editContent: '',
      startToEdit: false,
    });
  }

  sureToEdit(filename, content) {
    fetch('/editArticle', {
      method: 'POST',
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        id: this.state.editKey,
        filename,
        content,
      }),
    }).then((response) => {
      if (response.status === 401) {
        this.props.logout();
      }
      return response.json();
    }).then((result) => {
      if (result === 'success') {
        message.success('修改成功！');
        this.setState({
          editKey: '',
          editFilename: '',
          editContent: '',
          startToEdit: false,
        });
      }
    });
  }

  render() {
    const columns = [{
      title: '标题',
      key: 'title',
      dataIndex: 'title',
    }, {
      title: '发表日期',
      key: 'birthTime',
      dataIndex: 'birthTime',
    }, {
      title: '状态',
      key: 'published',
      dataIndex: 'published',
      render: text => <span>{text ? '已发布' : '未发布'}</span>,
    }, {
      title: '操作',
      key: 'operate',
      render: (text, record) => (
        <span>
          <button
            className={styles['del-btn']}
            onClick={() => { this.deleteArticle(record.key); }}
          >
            删除
          </button>
          <button
            className={styles.btn}
            onClick={() => { this.togglePublish(record.published, record.key); }}
          >
            {record.published ? '取消发布' : '发布'}
          </button>
          <button
            className={styles['edit-btn']}
            onClick={() => { this.editArticle(record.key); }}
          >
            编辑
          </button>
        </span>),
    }];

    const pagination = {
      defaultPageSize: 20,
      showSizeChanger: true,
    };
    return (
      <div>
        <nav className={styles.nav}>
          <button data-type="blogList" onClick={(e) => { this.changeType(e); }}>博客列表</button>
          <button data-type="newBlog" onClick={(e) => { this.changeType(e); }}>发布新博客</button>
          <button data-type="moodSign" onClick={(e) => { this.changeType(e); }}>修改心情/签名</button>
        </nav>
        {(() => {
          if (this.state.contentType === 'blogList') {
            return !this.state.startToEdit ?
              <div className={styles['table-wrapper']}>
                <Table
                  columns={columns}
                  dataSource={this.state.articles}
                  size="middle"
                  bordered
                  pagination={pagination}
                />
              </div> :
              <div>
                <BlogEditor
                  filename={this.state.editFilename}
                  content={this.state.editContent}
                  publish={this.sureToEdit}
                />
                <div className={styles['cancel-btn-box']}>
                  <button className={styles['cancel-btn']} onClick={() => { this.cancelEdit(); }}>取消修改</button>
                </div>
              </div>;
          }
          return null;
        })()}
        {this.state.contentType === 'newBlog' &&
          <BlogEditor publish={this.publish} />
        }
        {this.state.contentType === 'moodSign' &&
          <div className={styles['moodSign-wrapper']}>
            <div className={styles['mood-box']}>
              <span>心情</span>
              <textarea onChange={(e) => { this.textareaChanged(e, 'mood'); }} wrap="hard" />
              <button onClick={() => { this.sureChangeMoodSign('Mood'); }}>确认修改</button>
            </div>
            <div className={styles['sign-box']}>
              <span>签名</span>
              <textarea onChange={(e) => { this.textareaChanged(e, 'sign'); }} wrap="hard" />
              <button onClick={() => { this.sureChangeMoodSign('Sign'); }}>确认修改</button>
            </div>
          </div>
        }
        {this.state.showVerifyBox === true &&
          <VerifyBox
            sure={this.sureToDeleteArticle}
            cancel={this.cancelVerify}
          />
        }
      </div>
    );
  }
}

BlogBackHome.propTypes = {
  logout: PropTypes.func.isRequired,
};
