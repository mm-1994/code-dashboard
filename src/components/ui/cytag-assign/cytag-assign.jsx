import { Button, Text, Box } from '@chakra-ui/react';
import React, { useContext, useState, useEffect } from 'react';

import { BsPlusCircle } from 'react-icons/bs';
import { DevicesContext } from '../../../context/devices';
import { showsuccess } from '../../../helpers/toast-emitter';
import FunctionalModal from '../functional-modal/functional-modal';
import StyledSelect from '../styled-select/styled-select';
import { hasPermission } from '../../../helpers/permissions-helper';
import { PERMISSIONS } from '../../../types/devices';
import { ThemeContext } from '../../../context/theme';

function CytagAssign ({ cycollectorId, assignAction }) {
    const deviceCtx = useContext(DevicesContext);
    const themeCtx = useContext(ThemeContext);
    const [cytags, setCytags] = useState([]);
    const [cytag, setCytag] = useState('');
    useEffect(() => {
        if (deviceCtx.devicesObj) {
            const allCytags = deviceCtx.devicesObj.devices.cytag;
            setCytags(allCytags
                ? allCytags
                    .filter((tag) => tag.cycollector_id !== cycollectorId)
                    .map((tag) => {
                        return { value: tag.id, label: tag.name };
                    })
                : []);
        }
    }, [deviceCtx]);
    return (
        <> {hasPermission(PERMISSIONS.ASSIGN_TAGS) && (
            <FunctionalModal
                modalTitle={'Assign Cytags'}
                iconBtn={BsPlusCircle}
                btnColor={'primary.60'}
                btnMinH={'20px'}
                modalMinH={'500px'}
                btnAction={
                    
                    <Button
                    bg={'primary.80'} color={'text.primary'}              
                    w={"fit-content"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                        : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                    }
                    p={5}
                    mr={2}
                    _hover={{color:'primary.100', bg:'primary.60'}} 
                        onClick={() => {
                            assignAction(cytag, cycollectorId).then((res) => {
                                showsuccess('Successfully assigned device');
                                deviceCtx.getDevicesCall();
                            });
                        }
                        }
                    >
                        Assign Tag
                    </Button>
                }
            >  <Box py={10} px={5}>
                <Text color={'text.primary'} fontWeight={'bold'} >Select a cytag</Text>
                <StyledSelect
                    size={'md'}
                    value={cytag}
                    onchange={setCytag}
                    options={cytags}
                    general={true}
                />
                </Box>
            </FunctionalModal>
        )}

        </>
    );
}

export default CytagAssign;
