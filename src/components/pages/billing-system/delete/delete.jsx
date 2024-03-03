import { Button, Text, IconButton, useDisclosure } from "@chakra-ui/react";
import React, { useContext } from "react";
import { showsuccess } from "../../../../helpers/toast-emitter";
import { BiX } from "react-icons/bi";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import { ThemeContext } from "../../../../context/theme";
import { DeleteIcon } from "@chakra-ui/icons";

function DeleteBatch({ name, callBack, id, deleteAction }) {
  const themeCtx = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        cursor={"pointer"}
        size={"sm"}
        rounded={"full"}
        bg={"primary.60"}
        onClick={onOpen}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <DeleteIcon color={themeCtx.darkMode ? "#000000" : "#FFFFFF"} />
      </IconButton>
      <FunctionalModalV2
        closeBtn={
          <IconButton
            cursor={"pointer"}
            as={BiX}
            size={"sm"}
            fontSize={"xs"}
            rounded={"full"}
            color={"primary.100"}
            bg={"primary.60"}
            onClick={() => {
              onClose();
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
        isOpen={isOpen}
        transparent
        modalTitle={`Delete ${name}`}
        modalMinH={"200px"}
        modalMinW={"50%"}
        btnAction={
          <Button
            w={"fit-content"}
            backgroundColor={"primary.80"}
            boxShadow={
              themeCtx.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 5px 7px 1px rgba(0,0,0,0.2)"
            }
            color={"danger.100"}
            _hover={{ color: "primary.100", bg: "primary.60" }}
            onClick={() => {
              deleteAction(id).then(() => {
                showsuccess("Successfully deleted");
                onClose();
                callBack();
              });
            }}
          >
            Delete {name}
          </Button>
        }
      >
        <Text
          color={"text.primary"}
          textAlign={"center"}
          fontWeight={"bold"}
          py={20}
        >
          Are you sure you want to delete {name}?
        </Text>
      </FunctionalModalV2>
    </>
  );
}
export default DeleteBatch;
