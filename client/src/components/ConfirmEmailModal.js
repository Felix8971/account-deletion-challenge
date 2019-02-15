import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { isLoading, isLoaded } from '../LoadState'
import { spinnerUrl } from  '../constants';

class ConfirmEmailModal extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = { 
      markedConsequences: false, 
    }
  }

  componentWillUnmount() {
    this.props.resetTerminateAccountStatus();
  }

  isButtonDisable = () => {
    if ( isLoading(this.props.terminateAccountStatus) ) { 
      return true;
    } else if (this.state.markedConsequences && this.props.email.length > 5 ) { 
      return false;
    }
    return true;
  }

  onToggleMarkedConsequences = () => {
    this.setState({ markedConsequences: !this.state.markedConsequences })
  }

  isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;// eslint-disable-line
    return re.test(String(email).toLowerCase());
  }

  /*handleBlurEmail = (e) => {
    if ( !this.isEmailValid(e.target.value) ) {
      const error = 'Please enter a valide email address';
      this.props.terminateAccountError(error);
    } else {
      this.props.terminateAccountError('');
    }
  }*/

  renderFormInputPasssword = () => {
    const errorMessage = get(this.props.terminateAccountStatus, 'error', null)
    return (
      <div>
        <input
          type="text"
          placeholder="ross@example.com"
          style={{ width: '350px' }}
          value={this.props.email}
          onChange={this.props.onTypeEmail}
          //onBlur={this.handleBlurEmail}
        />
        <div style={{ color: 'red' }}>{errorMessage}</div>
      </div>
    )
  }

  render() {
    const { markedConsequences } = this.state;
    const { 
      onClickToDelete,
      onBackButton,
      terminateAccountStatus,
      redirectToHomepage,
    } = this.props;
   
    if ( isLoading(terminateAccountStatus) ) {
      return (
        <img className="spinner" src={spinnerUrl} />
      )
    } else if ( isLoaded(terminateAccountStatus) ) {
      return (
        <div className="deleted">
          <div>The account has been deleted !</div>
          <button onClick={() => { redirectToHomepage() }}>OK</button>
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
              disabled={this.isButtonDisable()}
            >
              Delete my account
            </button>
          </div>
        </div>
      )
    }
  }
}

ConfirmEmailModal.propTypes = {
  onClickToDelete: PropTypes.func,
  onBackButton: PropTypes.func,
  email: PropTypes.string,
  onTypeEmail: PropTypes.func,
  resetTerminateAccountStatus: PropTypes.func,
  terminateAccountError: PropTypes.func,
  terminateAccountStatus: PropTypes.object,
  redirectToHomepage: PropTypes.func,
}

export default ConfirmEmailModal
