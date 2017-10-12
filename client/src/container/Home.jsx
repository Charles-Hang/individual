import React,{Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './home.css';

export default class Home extends Component {
	constructor(){
		super();
	}

	draw(ctx,circles,mouse,w,h) {
		ctx.clearRect(0,0,w,h);
		let length = circles.length;
		const outEdge = [];
		while(length) {
			mouse.startCapture(circles[length - 1]);
			const inEdge = circles[length - 1].move(w,h);
			if(inEdge) {
				circles[length - 1].drawCircle(ctx,mouse);
				for(let i = length - 1; i > 0; i--) {
					circles[length - 1].drawLines(ctx, circles[i - 1], mouse);
				}
			}else {
				outEdge.push(length -1);
			}
			length--;
		}
		circles = circles.filter((item,index) => {
			return !outEdge.includes(index);
		});
		for(let i = 0; i < outEdge.length; i++) {
			const sign = Math.round(Math.random() * 3);
			switch(sign) {
				case 0:
					circles.unshift(new Circle(0,Math.random() * h));
					break;
				case 1:
					circles.unshift(new Circle(Math.random() * w,0));
					break;
				case 2:
					circles.unshift(new Circle(w,Math.random() * h));
					break;
				case 3:
					circles.unshift(new Circle(Math.random() * w, h));
					break;
				default:
					break;
			}
		}
		requestAnimationFrame(this.draw.bind(this,ctx,circles,mouse,w,h));
	}
	
	componentDidMount() {
		console.log(window.document.readyState);
		if(window.document.readyState !== 'complete') {
			window.onload = () => {
				const items = document.getElementsByClassName(styles.item);
				const title = document.getElementsByClassName(styles.title)[0];
				title.classList.add('back');
				Array.from(items).forEach(item => {
					item.classList.add('back');
				});
			}
		}else {
			const items = document.getElementsByClassName(styles.item);
			const title = document.getElementsByClassName(styles.title)[0];
			title.classList.add('back');
			Array.from(items).forEach(item => {
				item.classList.add('back');
			});
		}
		
		const canvas = document.getElementById('home-canvas');
		const ctx = canvas.getContext('2d');
		let w = canvas.width = canvas.offsetWidth;
		let h = canvas.height = canvas.offsetHeight;
		let circles = [];
		let circlesCounts = w >= 1600 ? 70 : 60;    //圆点应有数目 
		let circlesLength = circlesCounts;    //圆点实际数目			
		const mouse = new GravityPoint();
		canvas.addEventListener('mousemove',(e) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		});
		canvas.addEventListener('mouseout',(e) => {
			mouse.x = null;
			mouse.y = null;
		});
		for(let i = 0; i < circlesLength; i++) {
			circles.unshift(new Circle(Math.random() * w,Math.random() * h));
		}
		this.draw(ctx,circles,mouse,w,h);

		window.onresize = () => {
			w = canvas.width = canvas.offsetWidth;
			h = canvas.height = canvas.offsetHeight;
			circlesCounts = w >= 1600 ? 70 : 60;
			if(circlesCounts > circlesLength) {
				for(let i = 0; i < 10; i++) {
					circles.unshift(new Circle(Math.random() * w,Math.random() * h));
				}
			}else if(circlesCounts < circlesLength) {
				for(let i = 0; i < 10; i++) {
					circles.pop();
				}
			}
			circlesLength = circlesCounts;
		}
	}

    render() {
        return (
        	<div>
        		<canvas id="home-canvas" className={styles['home-canvas']}></canvas>
        		<div className={styles.menu}>
        			<p className={styles.title}>午星的个人主页</p>
        			<div className={`${styles.item} ${styles.item1}`}>
        				<Link to="/blog" style={{display: 'block'}}>个人博客</Link>
        			</div>
        			<div className={`${styles.item} ${styles.item2}`}>
						<Link to="/project" style={{display: 'block'}}>待定</Link>
        			</div>
        		</div>
        	</div>
        )
    }
}

class Circle {
	constructor(x, y) {
		this.x = x;    //圆x坐标
		this.y = y;    //圆y坐标
		this.r = Math.random() * (5 - 2) + 2;    //圆半径r
		this.sx = Math.random() * 2 - 1;    //圆x方向速度
		this.sy = Math.random() * 2 - 1;    //圆y方向速度
		this.colors = ['#18232f','#1abc9c','#9b59b6','#5bc0de','#f0ad4e','#e74c3c','#34495e'];    //颜色池
		this.color = this.colors[Math.round(Math.random() * 6)];    //从颜色池中选取圆的颜色
		this.mass = this.r;
	}

	drawCircle(ctx, mouse) {
		if(mouse.x) {
			const d = Math.sqrt(Math.pow((this.x - mouse.x),2) + Math.pow((this.y - mouse.y),2));
			if(d < 150) {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
				ctx.fill();
			}else {
				ctx.fillStyle = '#eae7ea';
				ctx.beginPath();
				ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
				ctx.fill();
			}
		}else {
			ctx.fillStyle = '#eae7ea';
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
			ctx.fill();
		}
	}

	drawLines(ctx, circle, mouse) {
		const cd = Math.sqrt(Math.pow((this.x - circle.x),2) + Math.pow((this.y - circle.y),2));
		if(mouse.x && cd < 170) {
			const md = Math.sqrt(Math.pow((this.x - mouse.x),2) + Math.pow((this.y - mouse.y),2));
			const cmd = Math.sqrt(Math.pow((mouse.x - circle.x),2) + Math.pow((mouse.y - circle.y),2));
			if(md < 150 && cmd < 150) {
				const lingrad = ctx.createLinearGradient(this.x,this.y,circle.x,circle.y);
				lingrad.addColorStop(0, this.color);
				lingrad.addColorStop(1, circle.color);
				ctx.strokeStyle = lingrad;
			}else if(md < 150 && cmd > 150) {
				const lingrad = ctx.createLinearGradient(this.x,this.y,circle.x,circle.y);
				lingrad.addColorStop(0, this.color);
				lingrad.addColorStop(1, '#f4f4f4');
				ctx.strokeStyle = lingrad;
			}else {
				ctx.strokeStyle = '#f4f4f4';
			}
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(circle.x,circle.y);
			ctx.stroke();
		}else if(cd < 170) {
			ctx.strokeStyle = '#f4f4f4';
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(circle.x,circle.y);
			ctx.stroke();
		}
	}

	move(w,h) {
		if((this.x - this.r > w || this.x + this.r < 0) || (this.y - this.r > h || this.y - this.r < 0)) {
			return false;
		}else {
			this.x += this.sx;
			this.y += this.sy;
			return true;
		}
	}
}

class GravityPoint {
	constructor() {
		this.x = null;
		this.y = null;
		this.mass = 200;

		this.gravitate = this.gravitate.bind(this);
		this.antiGravitate = this.antiGravitate.bind(this);
	}

	startCapture(circle) {
		const d = Math.sqrt(Math.pow((this.x - circle.x),2) + Math.pow((this.y - circle.y),2));
		if(d > 80 && d < 150) {
			this.gravitate(circle);
		}else if(d <= 80) {
			this.antiGravitate(circle);
		}
	}

	gravitate(circle) {
		const dx = this.x - circle.x;
		const dy = this.y - circle.y;
		const dq = dx*dx + dy*dy;
		const d = Math.sqrt(dq);
		const F = (this.mass*circle.mass)/dq;

		const ax = F*dx/d;
		const ay = F*dy/d;
		circle.sx += ax;
		circle.sy += ay;
	}

	antiGravitate(circle) {
		const dx = this.x - circle.x;
		const dy = this.y - circle.y;
		const dq = dx*dx + dy*dy;
		const d = Math.abs(Math.sqrt(dq) - 150);
		const F = -(this.mass*circle.mass)/(d*d);

		const ax = F*dx/d;
		const ay = F*dy/d;
		circle.sx += ax;
		circle.sy += ay;
	}
}