import React from 'react';
import WorkspaceGroupRows from '../WorkspaceGroupRows';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

const requiredTransferWorkspaces = [
  {
    spaceId: 'workspace1',
    displayName: 'Lightning strike',
    transferableMembers: [
      {
        _id: 'user2',
        name: 'Ryan Lynch',
      },
    ],
  },
  {
    spaceId: 'workspace2',
    displayName: 'Time machine',
    transferableMembers: [
      {
        _id: 'user5',
        name: 'Edward Bayer',
        workspaceId: 'workspace3',
      },
    ],
  },
];

describe('WorkspaceGroupRows', () => {

  it('should be defined', () => {
    expect(WorkspaceGroupRows).toBeDefined();
  });

  it('should render correctly', () => {
    const tree = shallow(
      <WorkspaceGroupRows
        shouldDisplay={true}
        groupTitle="Title"
        workspaces={requiredTransferWorkspaces}
      />
    );
    expect(tree).toMatchSnapshot();
  });

  it('should contain an h3 tag', () => {
    const tree = shallow(
      <WorkspaceGroupRows
        shouldDisplay={true}
        groupTitle="Title"
        workspaces={requiredTransferWorkspaces}
      />
    );
    expect(tree.find('h3')).toHaveLength(1);
  });
});
