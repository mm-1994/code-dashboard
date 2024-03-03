import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { showerror, showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import { ThemeContext } from "../../../../context/theme";
import { EditIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { Box, FormControl, Input, Flex, Text } from "@chakra-ui/react";

function EditPaymentLog({ callBack, paymentLog, editAction }) {
  const themeCtx = useContext(ThemeContext);
  const id = paymentLog.id;
  const [status, setStatus] = useState(paymentLog.confirmed);
  const [dueDate, setDueDate] = useState(paymentLog.due_date.slice(0, -1));
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
        <EditIcon color={themeCtx.darkMode ? "#000000" : "#FFFFFF"} />
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
              onClose(),
                setStatus(paymentLog.confirmed),
                setDueDate(paymentLog.due_date.slice(0, -1));
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
        modalTitle={`Edit ${id}`}
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
            color={"text.primary"}
            _hover={{ color: "primary.100", bg: "primary.60" }}
            onClick={() => {
              editAction(id,{"confirmed": typeof status === "string" ?  status=="true" ?true :false  : status , due_date: {time: new Date(dueDate).toISOString(),valid:true}})                
              .then(() => {
                showsuccess("Successfully edited");
                onClose();
                callBack();
              })
              .catch((e) => {
                showerror(e.message);
              });
            }}
            isDisabled={ dueDate === paymentLog.due_date.slice(0,-1) && paymentLog.confirmed === status}
          >
            Edit 
          </Button>
        }
      >
        <>

        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mb={5} mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"} w={"30%"}>
           Due Date
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
           
            <FormControl isInvalid={false}>
              <Input
                type="datetime-local"
                bg={"primary.80"}
                color={"text.primary"}
                borderRadius={0}
                border={0}
                height={45}
                w={"100%"}
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
                    themeCtx.darkMode ? "#171821" : "#FFFFFF"
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
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                }}
              />
            </FormControl>
          </Box>
        </Box>
        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mb={5}mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"}  w={"30%"}>
            Status
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <Box w={"100%"}>
              
            <StyledSelect
              value={status}
              onchange={setStatus}
              required={true}
              general={true}
              options={[
                { label: "True", value: true },
                { label: "False", value: false },
              ]}
            />
            </Box>
             </Box>
        </Box>
      </>
      </FunctionalModalV2>
    </>
  );
}
export default EditPaymentLog;
