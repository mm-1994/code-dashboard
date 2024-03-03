import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { showerror, showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import { ThemeContext } from "../../../../context/theme";
import { EditIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { Box, FormControl, Input, Flex, Text } from "@chakra-ui/react";

function EditOrder({ callBack, order, editAction }) {
  const themeCtx = useContext(ThemeContext);
  const id = order.id;
  const [nrc, setNrc] = useState(order.nrc.Float64);
  const [bundleId, setBundleId] = useState(order.bundle_id);
  const [startDate, setStartDate] = useState(order.start_date.slice(0,-1));
  const [endDate, setEndDate] = useState(order.end_date.slice(0,-1));
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
                setStartDate(order.start_date.slice(0,-1)),
                setEndDate(order.end_date.slice(0,-1));
                setNrc(order.nrc.Float64);
                setBundleId(order.bundle_id);
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
              editAction(id,
                {
                start_date: {
                time: new Date(startDate).toISOString(),
                valid: true,
              }, 
              end_date: new Date(endDate).toISOString(),
              nrc: {float64: parseFloat(nrc), valid:true},
              bundle_id:parseInt(bundleId)
            })                
              .then(() => {
                showsuccess("Successfully edited");
                onClose();
                callBack();
              })
              .catch((e) => {
                showerror(e.message);
              });
            }}
            isDisabled={ startDate === order.start_date.slice(0,-1) && endDate === order.end_date.slice(0,-1) && nrc === order.nrc.Float64 && bundleId === order.bundle_id}
          >
            Edit 
          </Button>
        }
      >
        <>

        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mb={5} mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"} w={"30%"}>
           Start Date
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
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </FormControl>
          </Box>
        </Box>


        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mb={5} mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"} w={"30%"}>
           End Date
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
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </FormControl>
          </Box>
        </Box>


        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mb={5}mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"}  w={"30%"}>
            Nrc
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
           <FormControl isInvalid={false}>
              <Input
                type="number"
                min={0}
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
                value={nrc}
                onChange={(e) => {
                  setNrc(e.target.value);
                }}
              />
            </FormControl>
     
             </Box>
        </Box>

        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mb={5}mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"}  w={"30%"}>
            Bundle Id
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <Box w="100%">
          <StyledSelect
            value={bundleId}
            general={true}
            required={true}
            options={order.bundles ? order.bundles : [] }
            onchange={setBundleId}
          />
     </Box>
             </Box>
        </Box>
      </>
      </FunctionalModalV2>
    </>
  );
}
export default EditOrder;
