import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

export const WorkspaceGroupRows = props =>
  !props.shouldDisplay ? null : (
    <div>
      <h3>{props.groupTitle}</h3>
      <div>
        { map(props.workspaces, workspace => (
          <div key={workspace.spaceId} style={{ marginTop: '1rem' }}>
            <div>Workspace: {workspace.displayName}</div>
            <div>
              {React.Children.count(props.children) === 0
                ? null
                : React.cloneElement(props.children, { workspace })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

WorkspaceGroupRows.propTypes = {
  groupTitle: PropTypes.string,
  workspaces: PropTypes.array.isRequired,
  children: PropTypes.node,
  shouldDisplay: PropTypes.bool,
}

export default WorkspaceGroupRows;