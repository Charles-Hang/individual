import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './clueBox.css';


/*
* props.data = [{
*   id
*   type
*   name
* },{
*   id
*   type
*   name
*   date
*   url
* }
*/
const ClueBox = props => (
  <div className={styles.wrapper}>
    {props.data.map(item => <Item key={item.id} {...item} />)}
  </div>
);
export default ClueBox;
// ClueBox.propTypes = {
//   data: PropTypes.arrayof({
    
//   }),
// };

function Item(props) {
  if(props.type === 'large') {
    return(
      <div className={styles['large-item']}>
        <span>{props.name}</span>
      </div>
    )
  }else {
    return(
      <div className={styles['small-item']}>
        <span>{props.date}</span>
        <span className={styles['item-name']}>
          <Link to={props.url} onClick={() => {saveArticleId(props.fileName,props.id)}}>{props.name}</Link>
        </span>
        <i className={styles.line}/>
      </div>
    )
  }
}

function saveArticleId(fileName,id) {
  sessionStorage.setItem(fileName,id);
}