import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import StyledSelect from '../ui/styled-select/styled-select';

const CustomSelect = function (props) {
    if (props.options.enumOptions.length === 2 && props.options.enumOptions[0].value === '0' && props.options.enumOptions[1].value === '1') {
        props.options.enumOptions = props.options.enumOptions.map((option) => {
            return {
                ...option,
                label: option.value === '0' ? 'no' : 'yes'
            };
        });
    }
    if (props.options.enumOptions.length !== 0 && typeof (props.options.enumOptions[0].value) === 'object') {
        props.options.enumOptions = props.options.enumOptions.map((option) => {
            return option.value;
        });
    }
    return (
        <Box mt={3} mb={3} width={'100%'}>
            {props.label && <Text color={"text.primary"} fontWeight={'bold'} mt={4} mb={2}>{props.label[0].toUpperCase() + props.label.replaceAll("_", " ").slice(1, props.label.length)}</Text>}
            <StyledSelect general={true} required={true}  disabled={props.disabled} options={props.options.enumOptions} placeholder={"aa"} value={props.value} onchange={(e) => {
                props.onChange(e);
            }}
            />
        </Box>
    );
};

export default CustomSelect;
