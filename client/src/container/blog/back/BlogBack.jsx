import React, {Component} from 'react';
import BlogBackLogin from './BlogBackLogin.jsx';
import BlogBackHome from './BlogBackHome.jsx';

export default class BlogBack extends Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: false
		};
	}
	
	login() {
		this.setState({
			auth: true
		});
	}

	render() {
		return !this.state.auth ?
			<BlogBackLogin login={this.login.bind(this)} /> :
			<BlogBackHome />
	}
}