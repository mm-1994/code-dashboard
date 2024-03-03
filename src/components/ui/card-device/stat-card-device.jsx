/* eslint-disable no-unused-expressions */
import React, {useContext} from 'react';
import {
    Box,
    Stat,
    StatNumber,
    StatHelpText,
    Text,
    Circle,
    Flex,
    TableContainer,
    Table,
    Tbody,
    Tr,
    Td,
    Thead,
    Th
} from '@chakra-ui/react';
import useScreenSize from '../../../hooks/screen-size';
import { SCREEN_SIZE } from '../../../types/screen';
import { ThemeContext } from '../../../context/theme';


function StatCard (props) {
    const {
        minH,
        icon,
        title,
        subTitle,
        bgColor,
        textColor,
        maxW,
        maxH,
        handleClick,
        subText,
        subText2,
        subText3,
        subTextObject,
        width,
        clicked,
        handleClickScroll
    } = props;
    const size = useScreenSize();

    const theme = useContext(ThemeContext);
    return (
        <Box
            p={3}
            bg={clicked ? 'action.100' : bgColor}
            variant="elevated"
            color={textColor}
            maxW={maxW}
            maxH={maxH}
            borderRadius={'10px'}
            overflow="hidden"
            cursor={handleClick ? 'pointer' : 'default'}
            w={width}
            h={'fit-content'}
            minH={minH || ''}
            minW={size === SCREEN_SIZE.LG ? 'fit-content' : '100%'}
            onClick={() => {
                handleClick ? handleClick(title) : null;
                handleClickScroll ? handleClickScroll() : null;
            }}
            _hover={handleClick ? { bg: 'action.100' } : {}}
            boxShadow={
              theme.darkMode
                ? "4px 4px 10px 1px rgba(0,0,0,0.6)"
                : "4px 4px 10px 1px rgba(0,0,0,0.2)"
            }
        >
            <Box as={Flex} gap={'7%'}>
                {icon
                    ? (
                        <>
                            <Box>
                                <Circle
                                    size="40px"
                                    borderRadius={'40%'}
                                    position={'relative'}
                                    top={'25%'}
                                    bg={'primary.60'}
                                >
                                    {icon}
                                </Circle>
                            </Box>
                            <Box p={1} className="text-container">
                                <Stat>
                                    <StatHelpText fontSize={'lg'}>{title}</StatHelpText>
                                    <StatNumber w={'100%'} fontSize={'md'}>
                                        {subTitle}
                                    </StatNumber>

                                    {!subTextObject
                                        ? (
                                            <>
                                                <Text fontSize={'md'}>{subText}</Text>
                                                <Text fontSize={'md'}>{subText2}</Text>
                                                <Text fontSize={'md'}>{subText3}</Text>
                                            </>
                                        )
                                        : (
                                            <>
                                                <TableContainer mb={2} w={'100%'}>
                                                    <Table size="md">
                                                        <Thead>
                                                            <Th borderColor={'text.primary'}></Th>
                                                            <Th borderColor={'text.primary'}></Th>
                                                        </Thead>
                                                        <Tbody color={'text.primary'}>
                                                            {Object.keys(subTextObject).map((key, index) => {
                                                                return (
                                                                    <Tr key={index}>
                                                                        <Td
                                                                            borderColor={'text.primary'}
                                                                            color={'text.primary'}
                                                                            p={1}
                                                                        >
                                                                            {key}
                                                                        </Td>
                                                                        <Td
                                                                            borderColor={'text.primary'}
                                                                            color={'text.primary'}
                                                                            p={1}
                                                                            isNumeric
                                                                        >
                                                                            {subTextObject[key]}
                                                                        </Td>
                                                                    </Tr>
                                                                );
                                                            })}
                                                        </Tbody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                        )}
                                </Stat>
                            </Box>
                        </>
                    )
                    : (
                        <>
                            <Box className="text-container">
                                <Stat>
                                    <StatHelpText>{title}</StatHelpText>
                                    <StatNumber>{subTitle}</StatNumber>
                                </Stat>
                                <Text fontSize={'xs'}>{subText}</Text>
                            </Box>
                        </>
                    )}
            </Box>
        </Box>
    );
}

export default StatCard;
