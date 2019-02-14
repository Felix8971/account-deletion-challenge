import PropTypes from 'prop-types'
import React from 'react'
import * as LoadState from './LoadState'
import { URL } from './constants.js';
import TerminateModalFlow from './components/TerminateModalFlow';
import {
  fetchRelatedWorkspaces,
  transferOwnership,
  terminateAccount,
} from './api/index';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        _id: 'user1',
        name: 'Ross Lynch',
        email: 'ross@example.com',
      },
      loading: true,
      requiredTransferWorkspaces: [],
      deleteWorkspaces: [],
      transferableMembers: [],
      terminateAccountStatus: {},
      transferOwnershipStatus: {
        workspaceId: null,
        toUserId: null,
        ...LoadState.pending,
      },
    }
  }

  terminateAccountError = error => {
    this.setState({
      terminateAccountStatus: LoadState.handleLoadFailedWithError(error)(
        this.state.terminateAccountStatus
      ),
    })
  };

  resetTerminateAccountStatus = () => {
    this.setState({
      terminateAccountStatus: { status: null }, //LoadState.pending,
    })
  };

  redirectToHomepage = () => {
    ///alert("The account has been deleted !");
    console.log('redirectToHomepage !');
    setTimeout(()=>{
      window.location = 'http://www.example.com/';
    },2000);
  };

  render() {
    return <TerminateModalFlow 
      {...this.state} 
      fetchRelatedWorkspaces = {fetchRelatedWorkspaces(this)}
      transferOwnership = {transferOwnership(this)}
      terminateAccount =  {terminateAccount(this)}
      terminateAccountError =  {this.terminateAccountError}
      resetTerminateAccountStatus = {this.resetTerminateAccountStatus}
      redirectToHomepage =  {this.redirectToHomepage}
    />
  }
}
