import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import { isLoading, completed, isLoaded } from '../LoadState'

class ConfirmEmailModal extends React.PureComponent {
  static propTypes = {
    onClickToDelete: PropTypes.func,
    onBackButton: PropTypes.func,
    email: PropTypes.string,
    onTypeEmail: PropTypes.func,
    resetTerminateAccountStatus: PropTypes.func,
    terminateAccountStatus: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = { 
      markedConsequences: false, isEmailValid: true,
    }
  }

  componentWillUnmount() {
    console.log('resetTerminateAccountStatus');
    this.props.resetTerminateAccountStatus();
  }

  getStateButton = () => {
    /*console.log('------------------------------------');
    console.log('this.props.terminateAccountStatus=', this.props.terminateAccountStatus);
    console.log('isLoading(this.props.terminateAccountStatus)=', isLoading(this.props.terminateAccountStatus));
    console.log('this.state.markedConsequences=', this.state.markedConsequences);
    console.log('this.props.email=', this.props.email);
    console.log('this.state.isEmailValid=',this.state.isEmailValid);*/
    
    if ( isLoading(this.props.terminateAccountStatus) ) { 
      return true;
    } else if (this.state.markedConsequences && this.props.email && this.state.isEmailValid) { 
      return false;
    }
    return true;
  }

  onToggleMarkedConsequences = () => {
    this.setState({ markedConsequences: !this.state.markedConsequences })
  }

  handleBlurEmail = (e) => {
    const email = e.target.value;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;// eslint-disable-line
    this.setState({ 
      isEmailValid: re.test(String(email).toLowerCase()),
    });
  }

  renderFormInputPasssword = () => {
    const errorMessage = _.get(this.props.terminateAccountStatus, 'error', null)
    return (
      <div>
        <input
          type="text"
          placeholder="ross@example.com"
          style={{ width: '350px' }}
          value={this.props.email}
          onChange={this.props.onTypeEmail}
          onBlur={this.handleBlurEmail}
        />
        <div style={{ color: 'red' }}>{errorMessage}</div>
        { !this.state.isEmailValid && <div style={{ color: 'red', marginTop:'10px' }}>Please enter a valid email</div> }
      </div>
    )
  }

  render() {
    const { markedConsequences } = this.state;
    const { onClickToDelete, onBackButton, terminateAccountStatus } = this.props;
    console.log('terminateAccountStatus=',terminateAccountStatus);
    if ( isLoading(terminateAccountStatus) ){
      return (
        <img className="spinner" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
      )
    } else if ( isLoaded(terminateAccountStatus) ) {
      return (
        <div className="deleted">
          <p>The account has been deleted !</p>
          <p>You will be redirected in 2s...</p>
        </div>
      )
    } else {
      return (
        <div >
          <h1>Delete account</h1>
          <p>This action cannot be undone.</p>
          <div>Please enter your email: {this.renderFormInputPasssword()}</div>
          <div style={{ marginTop: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={markedConsequences}
                onChange={this.onToggleMarkedConsequences}
              />
              I understand the consequences.
            </label>
          </div>
          <div>
            <button onClick={onBackButton}>Back</button>
            <button
              onClick={onClickToDelete}
              disabled={this.getStateButton()}
            >
              Delete my account
            </button>
          </div>
        </div>
      )
    }
  }
}

export default ConfirmEmailModal
