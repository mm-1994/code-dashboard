import { Box, Text } from '@chakra-ui/react';
import React from 'react';

function ObjectFieldTemplate (props) {
    return (
        <Box  w={'100%'} >
            <Text mt={2} color={'text.primary'} fontSize={'xl'}  fontWeight={'bold'}>{props.title ? props.title[0].toUpperCase() + props.title.slice(1, props.title.length).replaceAll('_', ' ') : ''}</Text>
            <Text color={'text.primary'} fontSize={'md'}>{props.description || ''}</Text>
            <Box  w={'100%'} display={'flex'} flexWrap={'wrap' } flexDir={'row'} justifyContent={'space-between'} alignItems={'center'}>
                {props.properties.map((element, index) => (
                    <Box w={element.name == 'enabled'  ? '100%':'45%'} minW={'350px'} key={index} >
                        {element.content}
                        </Box>
                ))}
            </Box>
        </Box>
    );
}

export default ObjectFieldTemplate;

// render(
//     <Form schema={schema} validator={validator} templates={{ ObjectFieldTemplate }} />,
//     document.getElementById('app')
// );
