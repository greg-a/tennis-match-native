import React from 'react';
import { Picker } from '@react-native-community/picker';
import { View } from 'react-native';

const DropdownPicker = props => {
    return (
        <View style={props.pickerStyle}>
            <Picker                
                selectedValue={props.selected}
                onValueChange={props.onChange}
            >
                {props.menuContent.map((item, index) => {
                    return (
                        <Picker.Item label={item.label} value={item.value} key={index} data-test={`picker-${item.label}`}/>
                    )
                })}
            </Picker>
        </View>
    )
};

export default DropdownPicker;