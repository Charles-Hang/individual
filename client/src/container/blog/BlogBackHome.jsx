import React, {Component} from 'react';
import {Table} from 'antd';

import styles from './blogBackHome.css';

export default class BlogBackHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentType: 'blogList',
			file: null,
			fileWarning: '',
			publishTitle: '',
			mood: '',
		}
	}

	changeType(e) {
		const type = e.target.dataset.type;
		type !== this.state.contentType &&
			this.setState({
				contentType: type
			});
	}

	titleChanged(e) {
		this.setState({
			publishTitle: e.target.value
		});
	}

	fileChanged(e) {
		const name = e.target.files[0].name;
		const span = document.getElementsByClassName('file-name-span')[0];
		span.innerHTML = name;
		const extension = name.split('.');
		if(extension[extension.length - 1] !== 'md'){
			this.setState({
				fileWarning: '选择的文件类型有误！'
			});
		}else {
			this.setState({
				fileWarning: '',
				file: e.target.files[0]
			});
		}
	}

	sureToPublish() {
		if(this.state.fileWarning) return;
		if(!this.state.file) return;
		if(!this.state.publishTitle) return;
		const formData = new FormData();
		formData.append('files',this.state.file);
		formData.append('title',this.state.publishTitle);
		fetch('/publish',{
			method: 'POST',
			body: formData
		}).then(response => {
			return response;
		}).then(data => {
			console.log(data);
		});
	}

	textareaChanged(e) {
		this.setState({
			mood: e.target.value
		});
	}

	sureChangeMood() {
		fetch('/modifyMood',{
			method: 'POST',
			body: this.state.mood
		}).then(response => {
			return response;
		}).then(data => {
			console.log(data);
		});
	}
	render() {
		const columns = [{
			title: '标题',
			key: 'title',
			dataIndex: 'title'
		},{
			title: '发布日期',
			key: 'birthTime',
			dataIndex: 'birthTime'
		},{
			title: '操作',
			key: 'operate',
			render: (text,record,index) => <button className={styles['del-btn']}>删除</button>
		}];
		
		const data = [];
		for (let i = 0; i < 46; i++) {
		  data.push({
		    key: i,
		    title: `这是标题 ${i}`,
		    birthTime: '2017-2-2',
		  });
		}

		const pagination = {
			defaultPageSize: 20,
			showSizeChanger: true,
		};
		return(
			<div>
				<nav className={styles.nav}>
					<button data-type="blogList" onClick={(e) => {this.changeType(e)}}>博客列表</button>
					<button data-type="newBlog" onClick={(e) => {this.changeType(e)}}>发布新博客</button>
					<button data-type="mood" onClick={(e) => {this.changeType(e)}}>修改心情</button>
				</nav>
				{this.state.contentType === 'blogList' &&
					<div className={styles['table-wrapper']}>
						<Table
							columns={columns}
							dataSource={data}
							size="middle"
							bordered
							pagination={pagination}
						/>
					</div>
				}
				{this.state.contentType === 'newBlog' &&
					<div className={styles['new-wrapper']}>
						<p>
							标题：
							<input type="text" onChange={(e) => {this.titleChanged(e)}}/>
						</p>
						<p>
							<input style={{display: 'none'}} onChange={(e) => {this.fileChanged(e)}} id="blog-upload-ipt" type="file" accept="text/markdown"/>
							<label htmlFor="blog-upload-ipt" className={styles['upload-ipt']}>选择文件</label>
						</p>
						<p>
							<span className="file-name-span" />
							<span className={styles['file-warning']}>{this.state.fileWarning}</span>
						</p>
						<p>
							<button onClick={() => {this.sureToPublish()}} className={styles['publish-btn']}>确定发布</button>
						</p>
					</div>
				}
				{this.state.contentType === 'mood' &&
					<div className={styles['mood-wrapper']}>
						<textarea onChange={(e) => {this.textareaChanged(e)}} wrap="hard"/>
						<button onClick={() => {this.sureChangeMood()}}>确认修改</button>
					</div>
				}
			</div>
		)
	}
}