import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
} from "@chakra-ui/react";

function GeneralAccordion({ title, children, themeCtx }) {
  return (
    <>
      <Accordion
        borderColor={"primary.80"}
        borderRadius={"10px"}
        allowToggle
        mb={5}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <AccordionItem borderRadius={"10px"}>
          {({ isExpanded }) => (
            <>
              <AccordionButton
                h={"70px"}
                borderTopRadius={"10px"}
                borderBottomRadius={!isExpanded ? "10px" : 0}
                _hover={{ cursor: "pointer" }}
                as={Flex}
                bg={"primary.80"}
                color={"action.100"}
              >
                {title}
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel bg={"primary.80"} pb={2} borderBottomRadius={"10px"}>
                {children}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default GeneralAccordion;
