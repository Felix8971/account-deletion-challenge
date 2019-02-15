import PropTypes from 'prop-types';
import React from 'react';
import Button from './Button';

export const TransferOwnershipModal = props => {
  const renderLoading = () => <div>Loading...</div>
  return (
    <div>
      <h1>Transfer ownership</h1>
      <p>
        Before you leaving, it is required to transfer your tasks, projects and
        workspace admin rights to other person.
      </p>
      {props.loading ? renderLoading() : props.children}
      <Button disabled={props.disabledNextPage} onClick={props.nextPage}>
        Next
      </Button>
    </div>
  )
}

TransferOwnershipModal.propTypes = {
  onToggleShowModal: PropTypes.func,
  nextPage: PropTypes.func,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  disabledNextPage: PropTypes.bool,
}

export default TransferOwnershipModal
