import React, {Component} from 'react';
import BlogBackLogin from './BlogBackLogin.jsx';
import BlogBackHome from './BlogBackHome.jsx';

export default class BlogBack extends Component {

	componentWillMount() {
		fetch('/jwtVerify',{
			method: 'GET',
			headers: {
				'Authorization': sessionStorage.getItem('token')
			}
		}).then(response => {
			return response.text();
		}).then(result => {
			console.log(result);
			if(result === 'success') {
				this.setState({
					auth: true
				});
			}
		}).catch(err => {
			console.log(err);
		})
	}

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

	logout() {
		this.setState({
			auth: false
		});
	}

	render() {
		return !this.state.auth ?
			<BlogBackLogin login={this.login.bind(this)} /> :
			<BlogBackHome logout={this.logout.bind(this)}/>
	}
}