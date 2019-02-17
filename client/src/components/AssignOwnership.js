import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { isLoading, isError } from '../LoadState';

const Container= styled.div`
  text-decoration: underline;
  cursor: pointer; 
`;

const Select= styled.select`
  min-width: 3rem; 
`;

export default class AssignOwnership extends React.Component {

  getAddedMember() {
    const { workspace, transferData } = this.props
    return _.chain(transferData)
      .reject( isError || isLoading)
      .find(assign => assign.workspaceId === workspace.spaceId)
      .get('toUser._id', '')
      .value();
  }

  onAssignToUser = e => {
    const user = this.props.workspace.transferableMembers.find(
      user => user._id === e.target.value
    )
    this.props.onAssignToUser(this.props.workspace, user);
  }

  render() {
    return (
      <Container>
        <Select
          value={this.getAddedMember()}
          onChange={this.onAssignToUser}
        >
          <option value="" disabled>-</option>
          {this.props.workspace.transferableMembers.map(user => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </Select>
      </Container>
    )
  }
}

AssignOwnership.propTypes = {
  user: PropTypes.object,
  workspace: PropTypes.object,
  transferData: PropTypes.array,
  onAssignToUser: PropTypes.func,
}
