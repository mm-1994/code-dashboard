import { Box, Checkbox } from '@chakra-ui/react';
import React from 'react';

const CustomCheckbox = function (props) {
    return (
        <Box mb={6} mt={6}>
            <Checkbox color={'text.primary'} width={'100%'} fontWeight={'semibold'} fontSize={'md'} onChange={(e) => props.onChange(e.target.checked)} isDisabled={props.disabled} isReadOnly={props.isReadOnly} isChecked={props.value} value={props.value}>  {props.label[0].toUpperCase() +
          props.label.replaceAll("_", " ").slice(1, props.label.length)}</Checkbox>
        </Box>
    );
};

export default CustomCheckbox;
