import React, { Component } from 'react';
import BlogBackLogin from './BlogBackLogin';
import BlogBackHome from './BlogBackHome';

export default class BlogBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    fetch('/jwtVerify', {
      method: 'GET',
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
    }).then(response => response.text())
      .then((result) => {
        // console.log(result);
        if (result === 'success') {
          this.setState({
            auth: true,
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  login() {
    this.setState({
      auth: true,
    });
  }

  logout() {
    this.setState({
      auth: false,
    });
  }

  render() {
    return !this.state.auth ?
      <BlogBackLogin login={this.login} /> :
      <BlogBackHome logout={this.logout} />;
  }
}
