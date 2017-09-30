import React, {Component} from 'react';
import {Icon} from 'antd';

import styles from './blogBackLogin.css';

export default class BlogBackLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			warning: '',
		};
	}
	handleLogin() {
		fetch('/login', {
			method: 'POST',
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password
			})
		}).then(response => {
			return response.json();
		}).then(result => {
			console.log(result);
			if(result.result !== 'ok') {
				this.setState({
					warning: '输入有误！'
				});
			}else{
				sessionStorage.setItem('token',result.token);
				this.props.login();
			}
		})
	}

	iptChange(e,type) {
		this.setState({
			[type]: e.target.value,
		});
	}

	handleKeyDown(e) {
		if(e.keyCode === 13) {
			this.handleLogin();
		}else{
			return;
		}
	}

	render() {
		return(
			<div className={styles['login-box']}>
				<p className={styles.title}>后台</p>
				<div className={styles['ipt-box']}>
					<p className={styles['ipt-item']}>
						<Icon type="user"/>
						<input type="text" value={this.state.username} onChange={(e) => {this.iptChange(e,'username')}}/>
					</p>
					<p className={styles['ipt-item']}>
						<Icon type="key"/>
						<input type="password" value={this.state.password} onKeyDown={(e) => {this.handleKeyDown(e)}} onChange={(e) => {this.iptChange(e,'password')}}/>
					</p>
					<button className={styles.btn} onClick={() => {this.handleLogin()}}>登录</button>
					<span className={styles.warning}>{this.state.warning}</span>
				</div>
			</div>
		)
	}
}