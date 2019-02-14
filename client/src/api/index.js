import { URL } from '../constants.js';
import * as LoadState from '../LoadState';

// Using the arrow function with currying seems to be the cleanest & most concise
// (not most efficient though) way to define event handlers that accepts user defined parameters.
export const fetchRelatedWorkspaces = (ctx) => () => {
  fetch(`${URL}/fetchWorkspaces?userId=${ctx.state.user._id}`, {mode: 'cors',})
  .then( (response) => {
    response.json().then( (data) => {
      console.log('data=', data);
      ctx.setState({
        loading: false,
        requiredTransferWorkspaces: data.requiredTransferWorkspaces,
        deleteWorkspaces: data.deleteWorkspaces,
      });
    });
  })
  .catch(error => console.error('Error:', error));
};

export const transferOwnership = (ctx) => (user, workspace) => {
  ctx.setState(
    {
      transferOwnershipStatus: {
        workspaceId: workspace.spaceId,
        toUserId: ctx.state.user._id,
        ...LoadState.loading,
      },
    },
    async () => {
      const response = await fetch(
        `${URL}/checkOwnership`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: workspace.spaceId,
            fromUserId: ctx.state.user._id,
            toUserId: user._id,
          }),
        }
      )
      if (response.status === 200) {
        ctx.setState({
          transferOwnershipStatus: {
            workspaceId: workspace.spaceId,
            toUserId: user._id,
            ...LoadState.completed,
          },
        })
      } else {
        ctx.setState({
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

export const terminateAccount =  ctx => payload => {
  // Note that there is 30% chance of getting error from the server
  fetch(
    `${URL}/terminateAccount`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  ).then( (response) => {
    if (response.status === 200) {
      ctx.setState({
        terminateAccountStatus: LoadState.handleLoaded(
          ctx.state.terminateAccountStatus
        ),
      })
    } else {
      ctx.setState({
        terminateAccountStatus: LoadState.handleLoadFailedWithError(
          'Error deleting account, please try again'
        )(ctx.state.terminateAccountStatus),
      })
    }
  })
  .catch(error => console.error('Error:', error));
};
