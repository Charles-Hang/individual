import React from 'react';

import styles from './resume.css';

const Resume = () => (
  <div className={styles.container}>
    <h1 id="杭世午星">杭世午星</h1>
    <h3 id="求职意向：前端工程师">求职意向：前端工程师</h3>
    <p className={styles.contact}>
      <span>
        手机：18698611893
      </span>
      <span>
        邮箱：hswxing@hotmail.com
      </span>
      <span>
        QQ：465851044
      </span>
    </p>
    <h2 id="教育经历">教育经历</h2>
    <ul>
      <li>2011-2015年<span className={styles.school}>大连理工大学</span><span className={styles.major}>集成电路本科</span></li>
      <li>2015-2016年<span className={styles.school}>大连理工大学</span><span className={styles.major}>英语双学位</span></li>
    </ul>
    <h2 id="工作经历">工作经历</h2>
    <h3 id="2016年11月至今--中金信科科技股份有限公司">2016.11 - 2018.03&nbsp;&nbsp;中金信科科技股份有限公司</h3>
    <h3 id="公司电商网站">2017.12 - 2018.03&nbsp;&nbsp;公司电商网站</h3>
    <p>
      负责前端技术选型与实现，持续优化技术栈与开发流程，并完成业务开发
      <br />
      遇到的一个难点就是移动端的适配问题。经研究学习采用如下方案，为pc端和移动端分别开发一套模板，通过userAgent判断端类型后，
      以懒加载方式加载对应模板。移动端采用rem布局，为防止图标因适配而模糊采用iconfont图标解决等
      <br />
      收获：对前端技术细节上有了进一步理解，提高了探究解决问题的能力，收获了移动端开发的经验
    </p>
    <h3 id="定位布控系统">2017.06 - 2017.11&nbsp;&nbsp;定位布控系统</h3>
    <p>
      推动项目的技术栈升级，最终采用React、Webpack、Express技术栈，并负责框架的搭建、优化与业务的开发
      <br />
      遇到的一个难点是数据的同步与通信问题。经过讨论分析，与后端的数据交互采用Socket.io，并用Redux管理实时大量的数据。
      前端的数据问题集中在地图组件与其他组件的通信上，采用‘发布-订阅’模式处理组件间通信问题，降低了项目复杂度
      <br />
      收获：加深了对前端开发流程与React全家桶的理解
    </p>
    <h3 id="路测系统">2017.03 - 2017.05&nbsp;&nbsp;路测系统</h3>
    <p>
      主要负责学习高德地图相关文档API进行地图方面的开发工作
      <br />
      遇到的一个难点是展示大量数据点卡顿的问题，由于需求的特殊性，高德地图的海量点和点聚合功能都不适用。
      与后端和需求沟通，在保证精确的情况下让后端尽量减少数据点数量，前端地图方面借鉴点聚合的思想，
      进行数据点的递进显示，避免一次显示大量的数据。虽没有完美解决卡顿问题，不过做到了较为平滑自然的展示效果
      <br />
      收获：提高了分析解决问题的能力，锻炼了快速学习的能力
    </p>
    <h2 id="个人项目与技能">个人项目与技能</h2>
    <h3 id="个人博客站-httpswwwnoonstarcn">个人博客站 <a href="https://www.noonstar.cn">www.noonstar.cn</a></h3>
    <p>
      从零自己搭建项目，从开发到部署再优化，采用React、Webpack、Koa、MongoDB技术栈，打通了前后台的开发，实现了博客的展示，发布，编辑等功能
      <br />
      遇到的一个难点是文章的解析与目录索引的提取问题，通过对开源库的学习，经过不断研究调试得以解决
      <br />
      收获：加深了对服务端的理解，对性能优化有了清晰的认识与理解
    </p>
    <h3 id="技能情况">技能情况</h3>
    <p>
      熟练掌握JS(ES6/ES7)、React、CSS、Webpack、HTML，使用Linux、Git开发与管理
      <br />
      善于借助开源社区解决遇到的技术问题
      <br />
      喜欢不断研究学习新技术
    </p>
  </div>
);
export default Resume;
