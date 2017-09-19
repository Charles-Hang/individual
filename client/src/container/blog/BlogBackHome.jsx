import React, {Component} from 'react';

import styles from './blogBackHome.css';

export default class BlogBackHome extends Component {
	render() {
		return(
			<div>
				<nav className={styles.nav}>
					<button>博客列表</button>
					<button>发布新博客</button>
					<button>修改心情</button>
				</nav>
			</div>
		)
	}
}