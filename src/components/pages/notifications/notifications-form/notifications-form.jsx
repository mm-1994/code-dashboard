import { Box, Button, Checkbox, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../../../context/theme';

function NotificationsForm ({ formData, disabled, saveAction }) {
    const [enabled, setEnabled] = useState(formData.enabled);
    const [email, setEmail] = useState(formData.contact_details.email);
    const [sms, setSms] = useState(formData.contact_details.sms);
    const [choices, setChoices] = useState(formData.notification_type);
    const themeCtx = useContext(ThemeContext)

    const addElementToArray = (array, element) => {
        array.splice(array.findIndex((el) => el === element), 1);
        return array;
    };

    const modifyChoice = (choice, checked) => {
        if (!checked) {
            setChoices(addElementToArray(choices, choice));
        } else {
            setChoices([...choices, choice]);
        }
    };

    const saveChanges = () => {
        saveAction({
            enabled,
            contact_details: {
                email,
                sms
            },
            notification_type: choices
        });
    };
    return (
        <>
            <Box mt={6} as={Flex} flexWrap={'wrap'} gap={6} color={'text.primary'}>
                <Checkbox size={'lg'} w={'100%'} isDisabled={disabled} defaultChecked={formData.enabled} value={enabled} onChange={(e) => setEnabled(e.target.checked)}>Enabled</Checkbox>
                <Text w={'100%'}fontWeight={'medium'} color={'text.primary'} fontSize={'xl'}>Contact Details</Text>
                <Box w={'100%'} alignItems={'center'} as={Flex} flexWrap={'wrap'} gap={2} m={2}>
                    <Text fontWeight={'medium'} color={'text.primary'} w={'25%'}>Email</Text>
                    <Input 
                        bg={"primary.80"}
                        color={"text.primary"}
                        borderRadius={0}
                        border={0}
                        height={45}
                        width={'70%'}
                        borderBottom={4}
                        borderStyle={"solid"}
                        borderColor={"action.100"}
                        boxShadow={
                            themeCtx.darkMode
                            ? "5px 10px 15px 1px rgba(0,0,0,1)"
                            : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                        }
                        _autofill={{
                          textFillColor: "text.primary",
                          boxShadow: `0 0 0px 1000px ${
                            themeCtx.darkMode ? "#171821" : "primary.80"
                          } inset`,
                          textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
                        }}
                        _focus={{
                          border: 0,
                          borderBottom: 5,
                          borderStyle: "solid",
                          borderColor: "action.100",
                        }}
                        _hover={{
                          border: 0,
                          borderBottom: 4,
                          borderStyle: "solid",
                          borderColor: "action.100",
                        }}
                        id="email"
                        placeholder="Email" type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Text w={'25%'} fontWeight={'medium'} color={'text.primary'}>Phone Number</Text>
                    <Input  color={"text.primary"}
                        borderRadius={0}
                        border={0}
                        height={45}
                        width={'70%'}
                        borderBottom={4}
                        borderStyle={"solid"}
                        borderColor={"action.100"}
                        boxShadow={
                            themeCtx.darkMode
                            ? "5px 10px 15px 1px rgba(0,0,0,1)"
                            : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                        }
                        _autofill={{
                          textFillColor: "text.primary",
                          boxShadow: `0 0 0px 1000px ${
                            themeCtx.darkMode ? "#171821" : "primary.80"
                          } inset`,
                          textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
                        }}
                        _focus={{
                          border: 0,
                          borderBottom: 5,
                          borderStyle: "solid",
                          borderColor: "action.100",
                        }}
                        _hover={{
                          border: 0,
                          borderBottom: 4,
                          borderStyle: "solid",
                          borderColor: "action.100",
                        }}
                        id="email"
                        placeholder="Phone Number" type={'tel'} value={sms} onChange={(e) => setSms(e.target.value)} />
                </Box>
                <Text w={'100%'} fontSize={'xl'} fontWeight={'medium'} color={'text.primary'}>Notification Type</Text>
                <Box w={'100%'} m={2} as={Flex} justifyContent={'space-between'}>
                    <Checkbox size={'lg'} isDisabled={disabled} defaultChecked={!!formData.notification_type.find((choice) => choice === 'sms')} value={!!choices.find((choice) => choice === 'sms')} onChange={(e) => modifyChoice('sms', e.target.checked)}>SMS</Checkbox>
                    <Checkbox size={'lg'} isDisabled={disabled} defaultChecked={!!formData.notification_type.find((choice) => choice === 'email')} value={!!choices.find((choice) => choice === 'email')} onChange={(e) => modifyChoice('email', e.target.checked)}>Email</Checkbox>
                    <Checkbox size={'lg'} isDisabled={disabled} defaultChecked={!!formData.notification_type.find((choice) => choice === 'app')} value={!!choices.find((choice) => choice === 'app')} onChange={(e) => modifyChoice('app', e.target.checked)}>App</Checkbox>
                </Box>
                <Box w={'100%'} as={Flex} justifyContent={'end'}>
                    <Button isDisabled={disabled}
                    bg={'primary.60'} 
                    color={'text.primary'}              
                    w={"fit-content"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                        : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                    }
                    p={5}
                    mr={2}
                    _hover={{color:'primary.100', bg:'primary.60'}}  onClick={saveChanges}>Save Changes</Button>
                </Box>
            </Box>
        </>
    );
}

export default NotificationsForm;
