import React, {Component} from 'react';
import {Icon} from 'antd';

import styles from './blogBackLogin.css';

export default class BlogBackLogin extends Component {
	constructor(props) {
		super(props);
	}
	handleLogin() {
		this.props.login();
	}
	render() {
		return(
			<div className={styles['login-box']}>
				<p className={styles.title}>后台</p>
				<div className={styles['ipt-box']}>
					<p className={styles['ipt-item']}>
						<Icon type="user"/>
						<input type="text"/>
					</p>
					<p className={styles['ipt-item']}>
						<Icon type="key"/>
						<input type="password"/>
					</p>
					<button className={styles.btn} onClick={() => {this.handleLogin()}}>登录</button>
				</div>
			</div>
		)
	}
}