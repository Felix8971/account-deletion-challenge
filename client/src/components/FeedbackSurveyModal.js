import { map, chain, every } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { feedbackSurveyItems } from '../constants'

class FeedbackSurveyModal extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = { 
      surveyItems: chain(feedbackSurveyItems)
        .map(item => [item.stack, false])
        .fromPairs()
        .value(),
      isFocusCommentBox: false,
    }
  }

  hasAllUnchecked = () => {
    const FeedbackSurveyItems = this.state.surveyItems;
    return (
      every(FeedbackSurveyItems, val => val === false) &&
      !this.state.isFocusCommentBox
    )
  }

  onToggleFeedback(stack) {
    const { surveyItems } = this.state;
    const updatedOption = {};
    updatedOption[stack] = !surveyItems[stack];
    const newSurveyItems = Object.assign(surveyItems, updatedOption);
    this.setState({ surveyItems: {...newSurveyItems} });
  }

  onFocusCommentBox = () => {
    this.setState({ isFocusCommentBox: !this.state.isFocusCommentBox })
  }

  renderInputForm({ stack, canComment, placeHolder }) {
    const prefill = placeHolder && canComment ? placeHolder : ''
    return !this.state.surveyItems[stack] ? null : (
      <div style={!canComment ? { display: 'none' } : null}>
        <input type="text" name={stack} ref={stack} placeholder={prefill} />
      </div>
    )
  }

  renderButtons() {
    return (
      <div>
        <button onClick={this.props.onBackButton}>Back</button>
        <button onClick={this.props.onSubmit} disabled={this.hasAllUnchecked()}>
          Next
        </button>
      </div>
    )
  }

  renderCommentForm() {
    if (!this.props.showCommentForm) return
    return (
      <div style={{ marginTop: '1rem' }}>
        Comments:
        <div>
          <textarea
            type="text"
            name="comment"
            style={
              this.state.isFocusCommentBox
                ? { border: '1px solid blue' }
                : { border: '1px solid black' }
            }
            onChange={this.props.onChangeComment}
            value={this.props.comment}
          />
        </div>
      </div>
    )
  }

  render() {
    const { title } = this.props;
    const { surveyItems } = this.state;
    return (
      <div>
        <h1>{title}</h1>
        <div>
          {map(feedbackSurveyItems, (item, key) => (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  checked={surveyItems[item.stack]}
                  onClick={() => this.onToggleFeedback(item.stack)}
                  onChange={() => {}}
                />
                {item.title}
              </label>
              {this.renderInputForm(item)}
            </div>
          ))}
        </div>
        {this.renderCommentForm()}
        {this.renderButtons()}
      </div>
    )
  }
}


FeedbackSurveyModal.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  onBackButton: PropTypes.func,
  showCommentForm: PropTypes.bool,
  comment: PropTypes.string,
  onChangeComment: PropTypes.func,
}


export default FeedbackSurveyModal;
