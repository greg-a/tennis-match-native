import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import DropdownPicker from './DropdownPicker';

configure({ adapter: new Adapter() });

describe('DropdwnPicker', () => {
  const baseProps = {
    menuContent: [{label: 'test', value: 'hello'}]
  }
  it('should render successfully', () => {
    const wrapper = shallow(<DropdownPicker {...baseProps} />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('[data-test="picker-test"]').text()).toBe("<PickerItem />");
  });
});

