import PropTypes from 'prop-types'
import React from 'react'

import * as LoadState from './LoadState'
import { URL } from './constants.js';
import TerminateModalFlow from './components/TerminateModalFlow';
/*import {
  fetchRelatedWorkspaces,
  transferOwnership,
  terminateAccount,
  terminateAccountError,
  resetTerminateAccountStatus,
  redirectToHomepage,
} from './api/index';*/
console.log(URL);

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

  fetchRelatedWorkspaces = async () => {
    const response = await window.fetch(
      `${URL}/fetchWorkspaces?userId=${
        this.state.user._id
      }`,
      {
        mode: 'cors',
      }
    )
    const data = await response.json();
    this.setState({
      loading: false,
      requiredTransferWorkspaces: data.requiredTransferWorkspaces,
      deleteWorkspaces: data.deleteWorkspaces,
    })
  };

  transferOwnership = (user, workspace) => {
    this.setState(
      {
        transferOwnershipStatus: {
          workspaceId: workspace.spaceId,
          toUserId: this.state.user._id,
          ...LoadState.loading,
        },
      },
      async () => {
        const response = await window.fetch(
          `${URL}/checkOwnership`,
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              workspaceId: workspace.spaceId,
              fromUserId: this.state.user._id,
              toUserId: user._id,
            }),
          }
        )
        if (response.status === 200) {
          this.setState({
            transferOwnershipStatus: {
              workspaceId: workspace.spaceId,
              toUserId: user._id,
              ...LoadState.completed,
            },
          })
        } else {
          this.setState({
            transferOwnershipStatus: {
              workspaceId: workspace.spaceId,
              toUserId: user._id,
              ...LoadState.error,
            },
          })
        }
      }
    )
  };

  terminateAccount = async payload => {
    // Note that there is 30% chance of getting error from the server
    const response = await window.fetch(
      `${URL}/terminateAccount`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    if (response.status === 200) {
      this.setState({
        terminateAccountStatus: LoadState.handleLoaded(
          this.state.terminateAccountStatus
        ),
      })
    } else {
      this.setState({
        terminateAccountStatus: LoadState.handleLoadFailedWithError(
          'Error deleting account, please try again'
        )(this.state.terminateAccountStatus),
      })
    }
  };

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
    alert("The account has been deleted !");
    console.log('redirectToHomepage !');
    window.location = 'http://www.example.com/';
  };

  render() {
    return <TerminateModalFlow 
      {...this.state} 
      fetchRelatedWorkspaces = {this.fetchRelatedWorkspaces}
      transferOwnership = {this.transferOwnership}
      terminateAccount =  {this.terminateAccount}
      terminateAccountError =  {this.terminateAccountError}
      resetTerminateAccountStatus = {this.resetTerminateAccountStatus}
      redirectToHomepage =  {this.redirectToHomepage}
    />
  }
}
