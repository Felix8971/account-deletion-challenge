import React from 'react';
import App from '../../App';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

describe('App', () => {
  it('should be defined', () => {
    expect(App).toBeDefined();
  });

  it('should render correctly', () => {
    const mockFn = jest.fn();
    const tree = shallow(
      <App
        fetchRelatedWorkspaces = {mockFn}
        transferOwnership = {mockFn}
        terminateAccount =  {mockFn}
        terminateAccountError =  {mockFn}
        resetTerminateAccountStatus = {mockFn}
        redirectToHomepage =  {mockFn}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
