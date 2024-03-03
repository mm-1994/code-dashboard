import { Button, Text ,Box} from "@chakra-ui/react";
import React, { useContext } from "react";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import { ThemeContext } from "../../../../context/theme";
import { DeleteIcon } from "@chakra-ui/icons";

function DeleteGeofence({ name, callBack, id, deleteAction }) {
  const themeCtx = useContext(ThemeContext);
  return (
    <FunctionalModal
      modalTitle={`Delete ${name}`}
       iconBtn={DeleteIcon}
      btnTitle={"Delete"}
      btnColor={"primary.60"}
      cancelable={true}
      btnSize={"md"}
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
            deleteAction(id).then((res) => {
              showsuccess("Successfully deleted");
              callBack(true);
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
    </FunctionalModal>
  );
}
export default DeleteGeofence;
