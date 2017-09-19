import React,{Component} from 'react';
import ClueBox from './ClueBox.jsx';

export default class BlogCategory extends Component {
	render() {
		const data = [{
			type: 'large',
			name: 'lskjdf',
			date: '9-9',
			url: '/blog/74/44/32/lskjdf'
		},{
			type: 'small',
			name: 'small name',
			date: '7-9',
			url: '/blog/44/44/44/lsk-name'
		},{
			type: 'small',
			name: 'small kdj',
			date: '4-4',
			url: '/blog/3/3/3/lksdjf'
		}];
		return(
			<div>
				<ClueBox data={data} />
			</div>
		)
	}
}