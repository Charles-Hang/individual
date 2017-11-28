import React, { Component } from 'react';
import utils from '../../utils/utils';

import styles from './content.css';

export default class Content extends Component {
  static updateActiveLis(t) {
    let target = t;
    const lis = [];
    target.classList.add('active');
    lis.push(target);
    while (target.parentElement.nodeName !== 'DIV') {
      target = target.parentElement;
      if (target.nodeName === 'LI') {
        target.classList.add('active');
        lis.push(target);
      }
    }
    return lis;
  }

  constructor(props) {
    super(props);
    this.state = {
      activeLis: [],
    };
    this.content = null;
    this.contentPosition = this.contentPosition.bind(this);
  }

  componentDidMount() {
    const content = document.getElementsByClassName(styles.content)[0];
    // let contentTop = 0;
    // let target = content;
    // while (target) {
    //   contentTop += target.offsetTop;
    //   target = target.offsetParent;
    // }
    // console.log(contentTop);
    this.contentTop = 371; // 目录框的offsettop
    this.content = content;
    window.eventEmitter.subscribe('content', (data) => {
      content.innerHTML += data || `<p class="${styles.null}">无</p>`;
      window.eventEmitter.dispatch('contentReceived');
    });
    window.eventEmitter.subscribe('highlightContent', (id) => {
      const t = this.content.querySelector(`[href="#${id}"]`);
      if (!t) return;
      if (this.state.activeLis.length) {
        this.state.activeLis.forEach((li) => {
          li.classList.remove('active');
        });
        const newActiveLis = Content.updateActiveLis(t.parentElement);
        this.setState({
          activeLis: newActiveLis,
        });
      } else {
        const newActiveLis = Content.updateActiveLis(t.parentElement);
        this.setState({
          activeLis: newActiveLis,
        });
      }
    });
    window.addEventListener('scroll', this.contentPosition);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.contentPosition);
    window.eventEmitter.unSubscribe('content');
    window.eventEmitter.unSubscribe('highlightContent');
  }

  contentPosition() {
    if (window.innerWidth < 1200) return;
    const docScrollTop = document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    if (this.contentTop <= docScrollTop) {
      this.content.style.position = 'fixed';
      this.content.style.top = '0';
    } else {
      this.content.style.position = 'static';
    }
  }

  extendItem(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {
      return;
    }
    const li = e.target.parentElement;
    if (this.state.activeLis.length) {
      const { activeLis } = this.state;
      activeLis.forEach((i) => {
        i.classList.remove('active');
      });
      const newActiveLis = Content.updateActiveLis(li);
      this.setState({
        activeLis: newActiveLis,
      });
    } else {
      const newActiveLis = Content.updateActiveLis(li);
      this.setState({
        activeLis: newActiveLis,
      });
    }
    const header = document.getElementById(decodeURI(e.target.hash).slice(1));
    let offsetHeader = header;
    let scrollTop = offsetHeader.offsetTop;
    while (offsetHeader.offsetParent) {
      offsetHeader = offsetHeader.offsetParent;
      scrollTop += offsetHeader.offsetTop;
    }
    utils.scrollTo(scrollTop);
  }

  render() {
    return (
      <div
        className={styles.content}
        onClick={(e) => { this.extendItem(e); }}
        onKeyDown={() => {}}
        role="button"
        tabIndex="-1"
      >
        <p className={styles.title}>文章目录</p>
      </div>
    );
  }
}
