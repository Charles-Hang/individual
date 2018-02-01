import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styles from './home.css';

class Circle {
  constructor(x, y) {
    this.x = x; // 圆x坐标
    this.y = y; // 圆y坐标
    this.r = (Math.random() * (8 - 2)) + 2; // 圆半径r
    this.sx = (Math.random() * 1.5) - 1; // 圆x方向速度
    this.sy = (Math.random() * 1.5) - 1; // 圆y方向速度
    this.colors = ['#18232f', '#1abc9c', '#9b59b6', '#5bc0de', '#f0ad4e', '#e74c3c', '#34495e']; // 颜色池
    this.color = this.colors[Math.round(Math.random() * 6)]; // 从颜色池中选取圆的颜色
    this.mass = this.r;
    this.ratio = window.devicePixelRatio || 1;
  }

  addSpeed(speedx = 0, speedy = 0) {
    this.sx += speedx;
    this.sy += speedy;
  }

  drawCircle(ctx, mouse) {
    if (mouse.x) {
      const d = Math.sqrt(((this.x - mouse.x) ** 2) + ((this.y - mouse.y) ** 2));
      if (d < (150 * this.ratio)) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#eae7ea';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#eae7ea';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLines(ctx, circle, mouse) {
    const cd = Math.sqrt(((this.x - circle.x) ** 2) + ((this.y - circle.y) ** 2));
    if (mouse.x && cd < (170 * this.ratio)) {
      const md = Math.sqrt(((this.x - mouse.x) ** 2) + ((this.y - mouse.y) ** 2));
      const cmd = Math.sqrt(((mouse.x - circle.x) ** 2) + ((mouse.y - circle.y) ** 2));
      if (md < (150 * this.ratio) && cmd < (150 * this.ratio)) {
        const lingrad = ctx.createLinearGradient(this.x, this.y, circle.x, circle.y);
        lingrad.addColorStop(0, this.color);
        lingrad.addColorStop(1, circle.color);
        ctx.strokeStyle = lingrad;
      } else if (md < (150 * this.ratio) && cmd > (150 * this.ratio)) {
        const lingrad = ctx.createLinearGradient(this.x, this.y, circle.x, circle.y);
        lingrad.addColorStop(0, this.color);
        lingrad.addColorStop(1, '#f4f4f4');
        ctx.strokeStyle = lingrad;
      } else {
        ctx.strokeStyle = '#f4f4f4';
      }
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(circle.x, circle.y);
      ctx.stroke();
    } else if (cd < (170 * this.ratio)) {
      ctx.strokeStyle = '#f4f4f4';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(circle.x, circle.y);
      ctx.stroke();
    }
  }

  move(w, h) {
    if ((this.x - this.r > w || this.x + this.r < 0) ||
      (this.y - this.r > h || this.y - this.r < 0)) {
      return false;
    }
    this.x += this.sx;
    this.y += this.sy;
    return true;
  }
}

class GravityPoint {
  constructor() {
    this.x = null;
    this.y = null;
    this.mass = 200;
    this.ratio = window.devicePixelRatio || 1;

    this.gravitate = this.gravitate.bind(this);
    this.antiGravitate = this.antiGravitate.bind(this);
  }

  startCapture(circle) {
    const d = Math.sqrt(((this.x - circle.x) ** 2) + ((this.y - circle.y) ** 2));
    if (d > (80 * this.ratio) && d < (150 * this.ratio)) {
      this.gravitate(circle);
    } else if (d <= (80 * this.ratio)) {
      this.antiGravitate(circle);
    }
  }

  gravitate(circle) {
    const dx = this.x - circle.x;
    const dy = this.y - circle.y;
    const dq = (dx * dx) + (dy * dy);
    const d = Math.sqrt(dq);
    const F = (this.mass * circle.mass) / dq;

    const ax = (F * dx) / d;
    const ay = (F * dy) / d;
    circle.addSpeed(ax, ay);
  }

  antiGravitate(circle) {
    const dx = this.x - circle.x;
    const dy = this.y - circle.y;
    const dq = (dx * dx) + (dy * dy);
    const d = Math.abs(Math.sqrt(dq) - (150 * this.ratio));
    const F = -(this.mass * circle.mass) / (d * d);

    const ax = (F * dx) / d;
    const ay = (F * dy) / d;
    circle.addSpeed(ax, ay);
  }
}

export default class Home extends Component {
  componentDidMount() {
    document.title = '午星的个人主页';
    if (window.document.readyState !== 'complete') {
      window.onload = () => {
        const items = document.getElementsByClassName(styles.item);
        const title = document.getElementsByClassName(styles.title)[0];
        title.classList.add('back');
        Array.from(items).forEach((item) => {
          item.classList.add('back');
        });
      };
    } else {
      const items = document.getElementsByClassName(styles.item);
      const title = document.getElementsByClassName(styles.title)[0];
      title.classList.add('back');
      Array.from(items).forEach((item) => {
        item.classList.add('back');
      });
    }
    const canvas = document.getElementById('home-canvas');
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    let w = canvas.width;
    let h = canvas.height;
    const circlesStack = (() => {
      let circles = [];
      return {
        unshift(circle) {
          circles.unshift(circle);
        },
        getCircles() {
          return circles;
        },
        pop() {
          circles.pop();
        },
        setCircles(newCircles) {
          circles = newCircles;
        },
      };
    })();
    let circlesCounts = w >= 1600 ? 80 : 60; // 圆点应有数目
    let circlesLength = circlesCounts; // 圆点实际数目
    const mouse = new GravityPoint();
    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX * ratio;
      mouse.y = e.clientY * ratio;
    });
    canvas.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
    for (let i = 0; i < circlesLength; i += 1) {
      circlesStack.unshift(new Circle(Math.random() * w, Math.random() * h));
    }
    this.draw(ctx, circlesStack, mouse, w, h);

    window.onresize = () => {
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      w = canvas.width;
      h = canvas.height;
      circlesCounts = w >= 1600 ? 70 : 60;
      if (circlesCounts > circlesLength) {
        for (let i = 0; i < 10; i += 1) {
          circlesStack.unshift(new Circle(Math.random() * w, Math.random() * h));
        }
      } else if (circlesCounts < circlesLength) {
        for (let i = 0; i < 10; i += 1) {
          circlesStack.pop();
        }
      }
      circlesLength = circlesCounts;
    };
  }

  draw(ctx, circlesStack, mouse, w, h) {
    ctx.clearRect(0, 0, w, h);
    const circles = circlesStack.getCircles();
    let { length } = circles;
    const outEdge = [];
    while (length) {
      mouse.startCapture(circles[length - 1]);
      const inEdge = circles[length - 1].move(w, h);
      if (inEdge) {
        circles[length - 1].drawCircle(ctx, mouse);
        for (let i = length - 1; i > 0; i -= 1) {
          circles[length - 1].drawLines(ctx, circles[i - 1], mouse);
        }
      } else {
        outEdge.push(length - 1);
      }
      length -= 1;
    }
    const newCircles = circles.filter((item, index) => !outEdge.includes(index));
    circlesStack.setCircles(newCircles);
    for (let i = 0; i < outEdge.length; i += 1) {
      const sign = Math.round(Math.random() * 3);
      switch (sign) {
        case 0:
          circlesStack.unshift(new Circle(0, Math.random() * h));
          break;
        case 1:
          circlesStack.unshift(new Circle(Math.random() * w, 0));
          break;
        case 2:
          circlesStack.unshift(new Circle(w, Math.random() * h));
          break;
        case 3:
          circlesStack.unshift(new Circle(Math.random() * w, h));
          break;
        default:
          break;
      }
    }
    window.requestAnimationFrame(this.draw.bind(this, ctx, circlesStack, mouse, w, h));
  }
  render() {
    return (
      <div>
        <canvas id="home-canvas" className={styles['home-canvas']} />
        <div className={styles.menu}>
          <p className={styles.title}>午星的个人主页</p>
          <div className={`${styles.item} ${styles.item1}`}>
            <Link href to="/blog" style={{ display: 'block' }}>博客</Link>
          </div>
          <div className={`${styles.item} ${styles.item2}`}>
            <Link href to="/project" style={{ display: 'block' }}>待定</Link>
          </div>
        </div>
      </div>
    );
  }
}

