import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';

import styles from './blogEditor.css';

export default class BlogEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: '',
    };
    this.simplemde = null;
    this.publish = this.publish.bind(this);
  }

  componentWillMount() {
    if (this.props.filename) {
      this.setState({
        filename: this.props.filename,
      });
    }
  }

  componentDidMount() {
    const initialValue = '<!-- title: -->\n<!-- date: -->\n<!-- tags: -->\n<!-- categories: -->';
    this.simplemde = new SimpleMDE({
      autosave: {
        enabled: true,
        uniqueId: 'blog-editor',
        delay: 5000,
      },
      element: document.getElementById('blog-editor'),
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
      initialValue: `${initialValue}`,
      spellChecker: false,
      toolbar: ['bold', 'italic', 'heading', '|', 'code', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', 'side-by-side', 'fullscreen'],
    });
    if (this.props.content) {
      this.simplemde.value(this.props.content);
    }
  }

  componentWillUnmount() {
    this.simplemde.toTextArea();
    this.simplemde = null;
  }

  filenameChanged(value) {
    this.setState({
      filename: value,
    });
  }

  publish() {
    const initialValue = '<!-- title: -->\n<!-- date: -->\n<!-- tags: -->\n<!-- categories: -->';
    const value = this.simplemde.value();
    this.props.publish(this.state.filename, value);
    this.simplemde.value(`${initialValue}`);
    this.setState({
      filename: '',
    });
  }

  render() {
    return (
      <div className={styles['editor-wrapper']}>
        <textarea id="blog-editor" />
        <p>
          文件名：
          <input type="text" value={this.state.filename} onChange={(e) => { this.filenameChanged(e.target.value); }} />
          <button className={styles.btn} onClick={this.publish}>确认发布</button>
        </p>
      </div>
    );
  }
}
BlogEditor.propTypes = {
  filename: PropTypes.string,
  content: PropTypes.string,
  publish: PropTypes.func.isRequired,
};

BlogEditor.defaultProps = {
  filename: '',
  content: '',
};

