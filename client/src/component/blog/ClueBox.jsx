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
*   fileName
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
ClueBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ])).isRequired,
};

function saveArticleId(fileName, id) {
  window.sessionStorage.setItem(fileName, id);
}

function Item(props) {
  if (props.type === 'large') {
    return (
      <div className={styles['large-item']}>
        <span>{props.name}</span>
      </div>
    );
  }
  return (
    <div className={styles['small-item']}>
      <span>{props.date}</span>
      <span className={styles['item-name']}>
        <Link
          href
          to={props.url}
          onClick={() => { saveArticleId(props.fileName, props.id); }}
        >
          {props.name}
        </Link>
      </span>
      <i className={styles.line} />
    </div>
  );
}
Item.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string,
  url: PropTypes.string,
  fileName: PropTypes.string,
};

Item.defaultProps = {
  date: '',
  fileName: '',
  url: '',
};

