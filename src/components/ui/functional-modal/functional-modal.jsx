import React, { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  IconButton,
  Image,
  Box,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";
import { ThemeContext } from "../../../context/theme";

function FunctionalModal({
  modalTitle,
  btnTitle,
  btnColor,
  btnMinH,
  btnMinW,
  children,
  btnAction,
  iconSize = "20px",
  iconBtn,
  btnSize = "sm",
  modalMinW = "350px",
  transparent,
  smallBlur,
  parentButtonFunc,
  imageButton,
  image,
  cancelable,
  reset,
  btnW,
  btnH,
  iconColor = "primary.100",
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const themeCtx = useContext(ThemeContext);
  return (
    <>
      {iconBtn ? (
        <Box display={"flex"} position={"relative"}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen();
            }}
            size={btnSize}
            rounded={"full"}
            bg={btnColor}
            zIndex={0}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,1)"
                : "5px 7px 15px 1px rgba(0,0,0,0.3)"
            }
            icon={
              <Icon
                boxSize={iconSize}
                zIndex={0}
                as={iconBtn}
                color={iconColor}
              />
            }
          />
        </Box>
      ) : (
        <>
          {imageButton ? (
            <IconButton
              size={"sm"}
              p={1}
              color={"text.primary"}
              bg={"primary.60"}
              rounded={"full"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen();
              }}
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            >
              <Image position={"relative"} src={image} h={5}></Image>
            </IconButton>
          ) : (
            <Button
              minW={btnMinW}
              w={btnW ? btnW : "fit-content"}
              h={btnH ? btnH : "fit-content"}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 5px 7px 1px rgba(0,0,0,0.2)"
              }
              size={btnSize}
              color={"text.primary"}
              bg={btnColor}
              minH={btnMinH}
              p={2}
              mr={2}
              _hover={{ color: "primary.100", bg: "primary.60" }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (parentButtonFunc) {
                  parentButtonFunc();
                  onOpen();
                } else {
                  onOpen();
                }
              }}
            >
              {btnTitle}
            </Button>
          )}
        </>
      )}
      <Modal
        scrollBehavior="outside"
        isOpen={isOpen}
        py={100}
        onClose={() => {
          onClose();
          reset && reset();
        }}
      >
        <ModalOverlay
          backdropFilter="auto"
          backdropBlur={smallBlur ? "0px" : "4px"}
        />
        <ModalContent bg={"primary.100"} minW={modalMinW} borderRadius={10}>
          <ModalHeader
            bg={transparent ? "transparent" : "primary.80"}
            fontSize={"2xl"}
            borderTopRadius={10}
            color={"text.primary"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            {modalTitle}
            <IconButton
              cursor={"pointer"}
              as={BiX}
              size={"sm"}
              fontSize={"xs"}
              rounded={"full"}
              color={"primary.100"}
              onClick={() => {
                onClose();
                reset && reset();
              }}
              bg={"primary.60"}
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            />
          </ModalHeader>

          <ModalBody>{children}</ModalBody>
          <ModalFooter
            h={"60px"}
            gap={2}
            borderBottomRadius={10}
            boxShadow={
              themeCtx.darkMode
                ? "-5px -4px 15px 1px rgba(0,0,0,0.6)"
                : "-5px -4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            <Button
              display={cancelable ? "flex" : "None"}
              w={"fit-content"}
              backgroundColor={"primary.80"}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 5px 7px 1px rgba(0,0,0,0.2)"
              }
              color={"text.primary"}
              _hover={{ color: "primary.100", bg: "primary.60" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            {btnAction}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FunctionalModal;
