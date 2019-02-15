import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ConfirmEmailModal from './ConfirmEmailModal';
import TransferOwnershipModal from './TransferOwnershipModal';
import WorkspaceGroupRows from './WorkspaceGroupRows';
import FeedbackSurveyModal from './FeedbackSurveyModal';
import { submitToSurveyMonkeyDeleteAccount } from '../api/SurveyService';
import { pending } from '../LoadState';
import AssignOwnership from './AssignOwnership';

export default class TerminateModalFlow extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      activeModal: 'transfer',
      transferData: [],
      feedbacks: [],
      comment: '',
      email: this.props.user.email,
    }
  }

  componentDidMount() {
    this.props.fetchRelatedWorkspaces();
  }

  getTransferData = () => {
    const { workspaceId, toUserId, status } = this.props.transferOwnershipStatus
    const transferData = this.state.transferData
    const updateData = _.reduce(
      transferData,
      (result, assign) => {
        if (
          assign.workspaceId === workspaceId &&
          assign.toUser._id === toUserId
        ) {
          result.push(Object.assign({}, assign, { status }))
        } else {
          result.push(assign)
        }
        return result
      },
      []
    );
    return updateData
  }

  assignToUser = (workspace, user) => {
    const assigns = _.reject(
      this.getTransferData(),
      assign => assign.workspaceId === workspace.spaceId
    )
    this.setState({
      transferData: [
        ...assigns,
        {
          workspaceId: workspace.spaceId,
          toUser: user,
          ...pending,
        },
      ],
    })
  }

  getRefsValues(refs, refName) {
    const item = _.get(refs, refName, false)
    if (!item || _.isEmpty(item.refs)) return {}

    const keys = Object.keys(item.refs)
    const collection = []
    for (const key of keys) {
      const value = item.refs[key].value
      collection.push({ key, value })
    }
    return collection
  }

  submitSurvey = () => {
    if (!_.isEmpty(this.refs)) {
      const surveyPayload = {
        feedbackRefs: this.getRefsValues(this.refs, 'feedbackForm'),
        comment: '',
      }
      submitToSurveyMonkeyDeleteAccount(surveyPayload);
    }
  }

  onSetNextPage = () => {
    if (this.state.activeModal === 'transfer') {
      this.setState({ activeModal: 'feedback' })
    } else if (this.state.activeModal === 'feedback') {
      const feedbackRefs = this.getRefsValues(this.refs, 'feedbackForm')
      this.setState({
        activeModal: 'confirm',
        feedbacks: _.map(feedbackRefs, ref => ({
          reason: ref.key,
          comment: ref.value,
        })),
      })
    }
    this.submitSurvey()
  }

  onGoToPreviousStep = () => {
    if (this.state.activeModal === 'feedback') {
      this.setState({ activeModal: 'transfer' })
    }
    if (this.state.activeModal === 'confirm') {
      this.setState({ activeModal: 'feedback' })
    }
  }

  onAssignToUser = (workspace, user) => {
    this.props.transferOwnership(user, workspace)
    this.assignToUser(workspace, user)
  }

  onChangeComment = e => {
    this.setState({ comment: e.target.value })
  }
  
  isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;// eslint-disable-line
    return re.test(String(email).toLowerCase());
  }
  
  onDeleteAccount = async () => {
    if ( !this.isEmailValid(this.state.email) ) {
      const error = 'Please enter a valide email address';
      this.props.terminateAccountError(error);
    } else if (this.props.user.email === this.state.email) {
      const payload = {
        transferTargets: _.map(this.getTransferData(), assign => ({
          userId: assign.toUser._id,
          spaceId: assign.workspaceId,
        })),
        reason: this.state.feedbacks,
      }
      this.props.terminateAccount(payload);
    } else {
      const error = 'Invalid email address';
      this.props.terminateAccountError(error);
    }
  }

  onTypeEmail = e => {
    this.setState({ email: e.target.value });
  }

  renderTransferModal() {
    const transferData = this.getTransferData();
    const totalAssigned = transferData.length;
    const totalWorkspaceRequiredTransfer = this.props.requiredTransferWorkspaces
      .length;
    const totalWorkspaceDelete = this.props.deleteWorkspaces.length;
    const disabledNextPage =
      totalAssigned < totalWorkspaceRequiredTransfer || this.props.loading;
    const { loading, requiredTransferWorkspaces, user, deleteWorkspaces }  = this.props;

    return (
      <TransferOwnershipModal
        nextPage={this.onSetNextPage}
        loading={loading}
        disabledNextPage={disabledNextPage}
      >
        <WorkspaceGroupRows
          workspaces={requiredTransferWorkspaces}
          groupTitle="The following workspaces require ownership transfer:"
          shouldDisplay={totalWorkspaceRequiredTransfer > 0}
        >
          <AssignOwnership
            user={user}
            transferData={this.getTransferData()}
            onAssignToUser={this.onAssignToUser}
          />
        </WorkspaceGroupRows>
        <WorkspaceGroupRows
          workspaces={deleteWorkspaces}
          groupTitle="The following workspaces will be deleted:"
          shouldDisplay={totalWorkspaceDelete > 0}
        />
      </TransferOwnershipModal>
    )
  }

  render() {
    switch (this.state.activeModal) {
      case 'transfer':
        return this.renderTransferModal()
      case 'feedback':
        return (
          <FeedbackSurveyModal
            ref="feedbackForm"
            title="Why would you leave us?"
            onSubmit={this.onSetNextPage}
            onBackButton={this.onGoToPreviousStep}
            showCommentForm
            comment={this.state.comment}
            onChangeComment={this.onChangeComment}
          />
        )
      case 'confirm':
        return (
          <ConfirmEmailModal
            onClickToDelete={this.onDeleteAccount}
            onBackButton={this.onGoToPreviousStep}
            email={this.state.email}
            isEmailValid={this.state.isEmailValid}
            onTypeEmail={this.onTypeEmail}
            terminateAccountStatus={this.props.terminateAccountStatus}
            terminateAccountError={this.props.terminateAccountError}
            resetTerminateAccountStatus={this.props.resetTerminateAccountStatus}
            redirectToHomepage ={this.props.redirectToHomepage}
          />
        )
    }
  }
}


TerminateModalFlow.propTypes = {
  user: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  requiredTransferWorkspaces: PropTypes.array,
  deleteWorkspaces: PropTypes.array,
  fetchRelatedWorkspaces: PropTypes.func,
  transferOwnershipStatus: PropTypes.object,
  transferOwnership: PropTypes.func,
  terminateAccount: PropTypes.func,
  terminateAccountError: PropTypes.func,
  terminateAccountStatus: PropTypes.object,
  resetTerminateAccountStatus: PropTypes.func,
  redirectToHomepage: PropTypes.func,
}
