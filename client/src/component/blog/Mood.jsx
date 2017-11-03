import React, { Component } from 'react';

import styles from './mood.css';

export default class Mood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mood: [],
    };
  }

  componentWillMount() {
    fetch('/getMood')
      .then(response => response.text())
      .then((result) => {
        let keyIndex = 0;
        const mood = result
          .split('\n')
          .map((part) => {
            const key = part + (keyIndex += 1);
            return (
              <p
                key={key}
                style={{
                  overflowWrap: 'break-word',
                  wordBreak: 'break-all',
                }}
              >
                {part}
              </p>
            );
          });
        // console.log(mood);
        this.setState({
          mood,
        });
      });
  }

  render() {
    return (
      <div className={styles.mood}>
        <p className={styles.title}>心情</p>
        {this.state.mood}
      </div>
    );
  }
}
