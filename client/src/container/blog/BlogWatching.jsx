import React, {Component} from 'react';

export default class BlogWatching extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				这是文章！{this.props.match.path}
			</div>
		)
	}
}