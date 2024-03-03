import React, {useContext} from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Switch,
  Heading,
  Circle,
  Fade,
} from "@chakra-ui/react";
import { icons } from '../../../data/roles';
import { ThemeContext } from '../../../context/theme';
import { useMediaQuery } from "@chakra-ui/react";


function RolesAccordion ({ RolesGroups, rolesSelected, handleSwitchClick, isDisabled }) {
    const themeCtx = useContext(ThemeContext);
    const [isNonMobile] = useMediaQuery("(min-width: 600px)");
    return (
        <>
        <Accordion  borderRadius={"10px"}  w={"87vw"} borderColor={'primary.80'} allowToggle >
            {RolesGroups.map((roleGroup, index) => (
                <Fade in delay={(index+1)/10}>
                  <AccordionItem
                    marginBottom={6}
                    borderColor={'primary.80'}
                    borderRadius={"10px"}
                    w={"100%"}
                    bgColor={"primary.80"} 
                    boxShadow={
                      themeCtx.darkMode
                        ? "5px 4px 15px 1px rgba(0,0,0,1)"
                        : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                    }
                  >
                    <h2>
                      <AccordionButton  borderRadius={"10px"} borderWidth={0}>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          flex="1"
                          fontSize={"xl"}
                          height={75}
                          color={
                            themeCtx.theme.colors &&
                            themeCtx.theme.colors.text.primary
                          }
                          textAlign={"left"}
                        >
                          <Box display={"flex"} flexDir={"row"}>
                            <Circle
                              size="40px"
                              borderRadius={"40%"}
                              position={"relative"}
                              top={"25%"}
                              bg={"primary.60"}
                            >
                              {icons[roleGroup.name]}
                            </Circle>
                            <Heading
                              w={"100%"}
                              ml={3}
                              display={"flex"}
                              alignItems={"center"}
                              color={"text.primary"}
                              fontSize={"xl"}
                            >
                              {roleGroup.name}
                            </Heading>
                          </Box>
                        </Box>
                        <AccordionIcon
                          color={
                            themeCtx.theme.colors &&
                            themeCtx.theme.colors.text.primary
                          }
                        />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel borderWidth={0} w={"100%"} pb={4}>
                      <Box
                        width={"100%"}
                        display={"flex"}
                        flexWrap={"wrap"}
                        alignItems={"center"}
                        justifyContent={"space-evenly"}
                        flexDir={"row"}
                      >
                        {roleGroup.roles.map((role) => (
                          <Box
                            width={ isNonMobile ? "45%" : '100%'}
                            gap={ isNonMobile ? 0 : 2}
                            borderRadius={"5px"}
                            borderColor={"primary.100"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            marginBottom={2}
                            p={4}
                            borderWidth={2}
                            borderStyle={"solid"}
                            flexDir={isNonMobile ? "row" : 'column'}
                            color={
                              themeCtx.theme.colors &&
                              themeCtx.theme.colors.text.primary
                            }
                          >
                            {role.name}
                            <Switch
                              sx={{
                                "span.chakra-switch__track:not([data-checked])":
                                  {
                                    backgroundColor: "primary.100",
                                  },
                                "span.chakra-switch__thumb": {
                                  backgroundColor: "primary.80",
                                },
                                'span.chakra-switch__track[data-checked]': { backgroundColor: 'action.100' }
                              }}
                              size="lg"
                              isDisabled={isDisabled}
                              isChecked={rolesSelected.includes(
                                parseInt(role.id)
                              )}
                              onChange={handleSwitchClick}
                              id={role.id}
                            />
                          </Box>
                        ))}
                        {roleGroup.roles.length % 2 !== 0 ? (
                          <Box width={"45%"} height={"75"} marginBottom={2}>
                            {}
                          </Box>
                        ) : (
                          ""
                        )}
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Fade>
            ))}
          </Accordion>
        </>
    );
}

export default RolesAccordion;
