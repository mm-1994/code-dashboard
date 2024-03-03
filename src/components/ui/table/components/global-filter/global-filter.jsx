import { SearchIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input';
import { Box, Center } from '@chakra-ui/layout';
import React, {useContext} from 'react';
import { useAsyncDebounce } from 'react-table';
import FunctionalModal from '../../../functional-modal/functional-modal';
import { ThemeContext } from '../../../../../context/theme';
import { useMediaQuery } from "@chakra-ui/react";


function GlobalFilter ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    width = 'xs'
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const [isNonMobile] = useMediaQuery("(min-width: 720px)");
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined);
    }, 200);
    const initialRef = React.useRef(null);

    const filterBody = () => {
        const theme = useContext(ThemeContext)
        
        return (
            <Input
                autofill="off"
                type='text'
                autoComplete="off"
                autoCorrect="off"
                ref={initialRef}
                id={'1'}
                borderColor={'primary.60'}
                bg={'primary.100'}
                borderRadius={'20px'}
                value={value || ''}
                w={width}
                color={'text.primary'}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                boxShadow={
                    theme.darkMode
                      ? "2px 4px 10px 1px rgba(0,0,0,0.6)"
                      : "2px 4px 10px 1px rgba(0,0,0,0.2)"
                  }
                placeholder={`Search in ${count} records`}
            />
        );
    };

    return (
        <Box>
            {
                ! isNonMobile
                    ? <FunctionalModal
                        iconBtn={SearchIcon}
                        btnColor={'primary.60'}
                        transparent={true}
                        modalMinH={'200px'}
                        smallBlur
                        initialRef={initialRef}
                        footer={false}
                    >
                    
                        <Center>
                            {filterBody()}
                        </Center>
                    </FunctionalModal>
                    : filterBody()
            }
        </Box>
    );
}

export default GlobalFilter;
