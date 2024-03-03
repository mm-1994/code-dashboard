import React, { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { ThemeContext } from "../../../context/theme";

function FunctionalModalV2({
  closeBtn,
  isOpen,
  footer = true,
  modalTitle,
  children,
  btnAction,
  btnReset,
  modalMinW = "350px",
  transparent,
  smallBlur,
}) {
  const theme = useContext(ThemeContext);
  return (
    <>
      <Modal
        scrollBehavior="outside"
        isOpen={isOpen}          
        py={100}
      >
        <ModalOverlay
          backdropFilter="auto"
          backdropBlur={smallBlur ? "0px" : "4px"}
        />
        <ModalContent
          bg={"primary.100"}
          minW={modalMinW}
          borderRadius={10}
        >
          <ModalHeader
            bg={transparent ? "transparent" : "primary.80"}
            fontSize={"2xl"}
            borderTopRadius={10}
            color={"text.primary"}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            boxShadow={
              theme.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            {modalTitle}
            {closeBtn}
          </ModalHeader>
          <ModalBody
          >
            {children}
          </ModalBody>
          {footer && (
            <ModalFooter
              h={"60px"}
              gap={2}
              borderBottomRadius={10}
              boxShadow={
                theme.darkMode
                  ? "-5px -4px 15px 1px rgba(0,0,0,0.6)"
                  : "-5px -4px 15px 1px rgba(0,0,0,0.2)"
              }
            >
              {btnReset}
              {btnAction}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default FunctionalModalV2;
