import {
  Box,
  Button,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  IconButton,
  Spinner
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { RepeatClockIcon } from "@chakra-ui/icons";
import React, { useContext } from "react";
import "./history-picker.css";
import { ThemeContext } from "../../../context/theme";


function HistoryPicker({
  showBtn = true,
  selectStartDate,
  selectEndDate,
  startDate,
  handleClick,
  endDate,
  width,
  loading,
  reset,
  endDateRequired,
  minW
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useContext(ThemeContext);
  const today = new Date();
  today.setDate(today.getDate());

  const body = () => {
    return (
      <>
        <Box mt={4} width={width ? width : "45%"} minW={minW?minW:'fit-content'} p={1}>
          <Text p={1} color={"text.primary"} fontWeight={"bold"}>
            Start Date:{" "}
          </Text>
          <Input
            bg={"primary.80"}
            color={startDate === "" ? "text.secondary" : "text.primary"}
            borderRadius={0}
            border={0}
            height={45}
            minW={minW?minW:'fit-content'}
            width={'100%'}
            borderBottom={4}
            borderStyle={"solid"}
            borderColor={"action.100"}
            _autofill={{
              textFillColor: "text.primary",
              boxShadow: `0 0 0px 1000px ${
                theme.darkMode ? "#171821" : "#primary.80"
              } inset`,
              textFillColor: theme.darkMode ? "#FFFFFF" : "#000000",
            }}
            boxShadow={
              theme.darkMode
              ? "5px 10px 15px 1px rgba(0,0,0,1)"
              : "5px 8px 15px 1px rgba(0,0,0,0.2)"
            }
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
            placeholder="Select start date and time"
            size="md"
            w={"100%"}
            type="datetime-local"
            variant={"outline"}
            value={startDate}
            onChange={(e) => {selectStartDate(e.target.value.replace("Z", ""))}}
            max={today.toISOString().replace("Z", "")}
          />
        </Box>
        <Box mt={4} width={width ? width : "45%"} minW={minW?minW:'fit-content'} p={1}>
          <Text p={1} color={"text.primary"} fontWeight={"bold"}>
            End Date:{" "}
          </Text>
          <Input
            bg={"primary.80"}
            color={endDate === "" ? "text.secondary" : "text.primary"}
            boxShadow={
              theme.darkMode
              ? "5px 10px 15px 1px rgba(0,0,0,1)"
              : "5px 8px 15px 1px rgba(0,0,0,0.2)"
            }
            borderRadius={0}
            border={0}
            height={45}
            minW={minW?minW:'fit-content'}
            width={'100%'}
            borderBottom={4}
            borderStyle={"solid"}
            borderColor={"action.100"}
            _autofill={{
              textFillColor: "text.primary",
              boxShadow: `0 0 0px 1000px ${
                theme.darkMode ? "#171821" : "#primary.80"
              } inset`,
              textFillColor: theme.darkMode ? "#FFFFFF" : "#000000",
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
            w={"100%"}
            variant={"outline"}
            type="datetime-local"
            onChange={(e) => {
              selectEndDate(e.target.value.replace("Z", ""));
            }}
            min={startDate}
            max={today.toISOString().replace("Z", "")}
            value={endDate}
          />
        </Box>
      </>
    );
  };
  return (
    <>
      {showBtn ? (
        <>
          <IconButton
            size={"sm"}
            title="get historical data"
            aria-label="get historical data"
            rounded={"full"}
            bg={"primary.60"}
            onClick={!loading && onOpen}
            boxShadow={
              theme.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
             {loading? (
            <Spinner
            thickness="2px"
            speed="0.85s"
            emptyColor="text.primary"
            color="primary.60"
            size="xs"
          />
              ) : (  <RepeatClockIcon color={theme.darkMode ? "#000000" : "#FFFFFF"} />)}
              </IconButton>
          <Modal
            scrollBehavior="outside"
            isOpen={isOpen}
            py={100}
            onClose={() => {
              onClose();
            }}
          >
            <ModalOverlay backdropFilter="auto" backdropBlur={"4px"} />
            <ModalContent bg={"primary.100"} borderRadius={10}>
              <ModalHeader
                bg={"primary.80"}
                fontSize={"2xl"}
                borderTopRadius={10}
                color={"text.primary"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                boxShadow={
                  theme.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                Get Historical Data
                <IconButton
                  cursor={"pointer"}
                  as={BiX}
                  size={"sm"}
                  fontSize={"xs"}
                  rounded={"full"}
                  color={"primary.100"}
                  onClick={onClose}
                  bg={"primary.60"}
                  boxShadow={
                    theme.darkMode
                      ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                      : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                  }
                />
              </ModalHeader>
              <ModalBody pb={10}>{body()}</ModalBody>
              <ModalFooter
                h={"60px"}
                borderBottomRadius={10}
                display={'flex'}
                gap={4}
                boxShadow={
                  theme.darkMode
                    ? "-5px -4px 15px 1px rgba(0,0,0,0.6)"
                    : "-5px -4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                  <Button
                  isDisabled={startDate === '' || (endDate === '' && endDateRequired) }
                  h={"40px"}
                  color={"text.warning"}
                  bg={"primary.80"}
                  _hover={{ bg: "primary.60" }}
                  onClick={() => {selectEndDate(''); selectStartDate(''); reset(); onClose(); }}
                  boxShadow={
                    theme.darkMode
                      ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                      : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                  }
                >
                  {" "}
                  Reset
                </Button>
                <Button
                  h={"40px"}
                  isDisabled={startDate === '' || (endDate === '' && endDateRequired) }
                  color={"text.primary"}
                  bg={"primary.80"}
                  _hover={{ bg: "primary.60" }}
                  onClick={() => {handleClick(); onClose()}}
                  boxShadow={
                    theme.darkMode
                      ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                      : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                  }
                >
                  {" "}
                  Get Historical Data
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        body()
      )}
    </>
  );
}

export default HistoryPicker;
