import React, {Component} from 'react';
import {Icon} from 'antd';

import styles from './verifyBox.css';

export default class VerifyBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		}
	}

	handleIpt(value,type) {
		this.setState({
			[type]: value
		});
	}

	sure() {
		this.props.sure(this.state.username,this.state.password);
	}

	cancel() {
		this.props.cancel();
	}

	handleKeyDown(e) {
		if(e.keyCode === 13) {
			this.sure();
		}
	}

	render() {
		return (
			<div className={styles.box}>
				<p className={styles.title}>权限验证</p>
				<div className={styles['ipt-box']}>
					<p className={styles['ipt-item']}>
						<Icon type="user" />
						<input
							type="text"
							value={this.state.username}
							onChange={(e) => {this.handleIpt(e.target.value,'username')}}
						/>
					</p>
					<p className={styles['ipt-item']}>
						<Icon type="key" />
						<input
							type="password"
							value={this.state.password}
							onChange={(e) => {this.handleIpt(e.target.value,'password')}}
							onKeyDown={(e) => {this.handleKeyDown(e)}}
						/>
					</p>
					<div className={styles['btn-box']}>
						<button className={styles.btn} onClick={() => {this.sure()}}>确定</button>
						<button className={`${styles.btn} ${styles['cancel-btn']}`} onClick={() => {this.cancel()}}>取消</button>
					</div>
				</div>
			</div>
		)
	}
}