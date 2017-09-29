import React, {Component} from 'react';
import {Table} from 'antd';
import utils from '../../utils/utils.js';

import styles from './blogBackHome.css';

export default class BlogBackHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentType: 'blogList',
			file: null,
			fileWarning: '',
			mood: '',
		}
	}

	componentDidMount() {
		this.getAllArticles()
			.then(result => {
				this.setState({
					articles: this.transfromArticles(result)
				});
			});
	}

	transfromArticles(articles) {
		const result = [];
		articles.forEach(article => {
			result.push({
				key: article._id,
				title: article.title,
				birthTime: utils.parseDetailDate(article.birthTime),
				published: article.publish 
			});
		});
		return result;
	}

	changeType(e) {
		const type = e.target.dataset.type;
		type !== this.state.contentType &&
			this.setState({
				contentType: type
			});
		if(type === 'blogList') {
			this.getAllArticles()
				.then(result => {
					this.setState({
						articles: this.transfromArticles(result)
					});
				})
		}
	}

	getAllArticles() {
		return fetch('/getAllArticles')
			.then(response => {
				return response.json();
			})
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
		const formData = new FormData();
		formData.append('files',this.state.file);
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

	togglePublish(published,key) {
		fetch('/togglePublish',{
			method: 'POST',
			body: JSON.stringify({
				publish: !published,
				id: key
			})
		}).then(response => {
			return response.json();
		}).then(result => {
			console.log(result);
			let articles = this.state.articles;
			const index = articles.findIndex(article => {
				return article.key === result._id;
			});
			articles[index].published = result.publish;
			this.setState({
				articles: articles
			});
		});
	}
	render() {
		const columns = [{
			title: '标题',
			key: 'title',
			dataIndex: 'title'
		},{
			title: '发表日期',
			key: 'birthTime',
			dataIndex: 'birthTime'
		},{
			title: '状态',
			key: 'published',
			dataIndex: 'published',
			render: (text) => <span>{text ? '已发布' : '未发布'}</span>
		},{
			title: '操作',
			key: 'operate',
			render: (text,record,index) => <span>
				<button className={styles['del-btn']}>删除</button>
				<button
					className={styles.btn}
					onClick={() => {this.togglePublish(record.published,record.key)}}
				>
					{record.published ? '取消发布' : '发布'}
				</button>
			</span>
		}];

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
							dataSource={this.state.articles}
							size="middle"
							bordered
							pagination={pagination}
						/>
					</div>
				}
				{this.state.contentType === 'newBlog' &&
					<div className={styles['new-wrapper']}>
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