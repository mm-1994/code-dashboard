import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import { default as React, useEffect, useState, useContext } from "react";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { ThemeContext } from "../../../../context/theme";

function CreateOrEditBatch({
  setValid,
  name,
  setName,
  customerName,
  setCustomerName,
  status,
  setStatus,
  devicesNumber,
  setDevicesNumber,
  deliveryDate,
  setDeliveryDate,
  warrantyDate,
  setWarrantyDate,
  hideName,
  hideCustomerName,
}) {
  const [nameError, setNameError] = useState("");
  const [isNameError, setIsNameError] = useState(true);
  const [isNameFocused, setIsNameFocused] = useState(false);

  const [customerNameError, setCustomerNameError] = useState("");
  const [isCustomerNameError, setIsCustomerNameError] = useState(true);
  const [isCustomerNameFocused, setIsCustomerNameFocused] = useState(false);

  const [statusError, setStatusError] = useState("");
  const [isStatusError, setIsStatusError] = useState(true);
  const [isStatusFocused, setIsStatusFocused] = useState(false);

  const [devicesNumberError, setDevicesNumberError] = useState("");
  const [isDevicesNumberError, setIsDevicesNumberError] = useState(true);
  const [isDevicesNumberFocused, setIsDevicesNumberFocused] = useState(false);

  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [isDeliveryDateError, setIsDeliveryDateError] = useState(true);
  const [isDeliveryDateFocused, setIsDeliveryDateFocused] = useState(false);

  const [warrantyDateError, setwarrantyDateError] = useState("");
  const [isWarrantyDateError, setIsWarrantyDateError] = useState(true);
  const [isWarrantyDateFocused, setIsWarrantyDateFocused] = useState(false);

  const themeCtx = useContext(ThemeContext);

  useEffect(() => {
    if (name === "") {
      setIsNameError(true);
      setNameError("Name is required.");
    } else if (name.length <= 3) {
      setIsNameError(true);
      setNameError("must be at least 4 characters.");
    } else {
      setIsNameError(false);
    }
  }, [name]);

  useEffect(() => {
    if (customerName === "") {
      setIsCustomerNameError(true);
      setCustomerNameError("Customer name is required.");
    } else if (customerName.length <= 3) {
      setIsCustomerNameError(true);
      setCustomerNameError("must be at least 4 characters.");
    } else {
      setIsCustomerNameError(false);
    }
  }, [customerName]);

  useEffect(() => {
    if (status === -1) {
      setIsStatusError(true);
      setStatusError("Status is required.");
    } else {
      setIsStatusError(false);
    }
  }, [status]);

  useEffect(() => {
    if (devicesNumber === "") {
      setIsDevicesNumberError(true);
      setDevicesNumberError("Devices number is required.");
    } else if (parseInt(devicesNumber) <= 0) {
      setIsDevicesNumberError(true);
      setDevicesNumberError("must be at more then 0.");
    } else {
      setIsDevicesNumberError(false);
    }
  }, [devicesNumber]);

  useEffect(() => {
    if (deliveryDate === "") {
      setIsDeliveryDateError(true);
      setDeliveryDateError("Delivery date is required.");
    } else {
      setIsDeliveryDateError(false);
    }
  }, [deliveryDate]);

  useEffect(() => {
    if (warrantyDate === "") {
      setIsWarrantyDateError(true);
      setwarrantyDateError("Warranty date is required.");
    } else {
      setIsWarrantyDateError(false);
    }
  }, [warrantyDate]);

  useEffect(() => {
    if (
      (isNameError && !hideName) ||
      (isCustomerNameError && !hideCustomerName) ||
      isStatusError ||
      isDevicesNumberError ||
      isDeliveryDateError ||
      isWarrantyDateError
    ) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [
    isNameError,
    isCustomerNameError,
    isStatusError,
    isDevicesNumberError,
    isDeliveryDateError,
    isWarrantyDateError,
  ]);

  return (
    <>
      <Box
        w={"100%"}
        gap={5}
        as={Flex}
        alignItems={"center"}
        mt={2}
        display={hideName ? "none" : "flex"}
      >
        <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
          Name
        </Text>
        <Box
          as={Flex}
          w={"70%"}
          alignItems={"flex-start"}
          flexDirection={"column"}
        >
          <FormControl isInvalid={isNameError && isNameFocused}>
            <Input
              type="text"
              placeholder="Name"
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              w={"100%"}
              onBlur={() => setIsNameFocused(true)}
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
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {isNameError && isNameFocused ? (
              <FormErrorMessage
                fontWeight={"bold"}
                alignItems={"flex-start"}
                pt={2}
                marginTop={0}
                minH={10}
              >
                {nameError}
              </FormErrorMessage>
            ) : (
              <Box minH={10}></Box>
            )}
          </FormControl>
        </Box>
      </Box>
      <Box
        w={"100%"}
        gap={5}
        as={Flex}
        display={hideCustomerName ? "none" : "flex"}
        alignItems={"center"}
        mt={2}
      >
        <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
          Customer Name
        </Text>
        <Box
          as={Flex}
          w={"70%"}
          alignItems={"flex-start"}
          flexDirection={"column"}
        >
          <FormControl isInvalid={isCustomerNameError && isCustomerNameFocused}>
            <Input
              type="text"
              placeholder="Customer Name"
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              w={"100%"}
              onBlur={() => setIsCustomerNameFocused(true)}
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
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
              }}
            />
            {isCustomerNameError && isCustomerNameFocused ? (
              <FormErrorMessage
                fontWeight={"bold"}
                alignItems={"flex-start"}
                pt={2}
                marginTop={0}
                minH={10}
              >
                {customerNameError}
              </FormErrorMessage>
            ) : (
              <Box minH={10}></Box>
            )}
          </FormControl>
        </Box>
      </Box>

      <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mt={2}>
        <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
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
              onBlur={() => setIsStatusFocused(true)}
              required={true}
              general={true}
              isInvalid={isStatusError && isStatusFocused}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />

            {isStatusError && isStatusFocused ? (
              <Box
                fontWeight={"bold"}
                alignItems={"flex-start"}
                pt={2}
                marginTop={0}
                minH={10}
                fontSize={14}
                color={"#E53E3E"}
              >
                {statusError}
              </Box>
            ) : (
              <Box minH={10} />
            )}
          </Box>
        </Box>
      </Box>

      <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mt={2}>
        <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
          Devices
        </Text>
        <Box
          as={Flex}
          w={"70%"}
          alignItems={"flex-start"}
          flexDirection={"column"}
        >
          <FormControl
            isInvalid={isDevicesNumberError && isDevicesNumberFocused}
          >
            <Input
              type="number"
              placeholder="Devices number"
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              w={"100%"}
              onBlur={() => setIsDevicesNumberFocused(true)}
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
              value={devicesNumber}
              onChange={(e) => {
                setDevicesNumber(e.target.value);
              }}
            />
            {isDevicesNumberError && isDevicesNumberFocused ? (
              <FormErrorMessage
                fontWeight={"bold"}
                alignItems={"flex-start"}
                pt={2}
                marginTop={0}
                minH={10}
              >
                {devicesNumberError}
              </FormErrorMessage>
            ) : (
              <Box minH={10}></Box>
            )}
          </FormControl>
        </Box>
      </Box>

      <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mt={2}>
        <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
          Delivery date
        </Text>
        <Box
          as={Flex}
          w={"70%"}
          alignItems={"flex-start"}
          flexDirection={"column"}
        >
          <FormControl isInvalid={isDeliveryDateError && isDeliveryDateFocused}>
            <Input
              type="datetime-local"
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              w={"100%"}
              onBlur={() => setIsDeliveryDateFocused(true)}
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
              value={deliveryDate}
              onChange={(e) => {
                setDeliveryDate(e.target.value);
              }}
            />
            {isDeliveryDateError && isDeliveryDateFocused ? (
              <FormErrorMessage
                fontWeight={"bold"}
                alignItems={"flex-start"}
                pt={2}
                marginTop={0}
                minH={10}
              >
                {deliveryDateError}
              </FormErrorMessage>
            ) : (
              <Box minH={10}></Box>
            )}
          </FormControl>
        </Box>
      </Box>

      <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mt={2}>
        <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
          Warranty end
        </Text>
        <Box
          as={Flex}
          w={"70%"}
          alignItems={"flex-start"}
          flexDirection={"column"}
        >
          <FormControl isInvalid={isWarrantyDateError && isWarrantyDateFocused}>
            <Input
              type="datetime-local"
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              w={"100%"}
              onBlur={() => setIsWarrantyDateFocused(true)}
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
              value={warrantyDate}
              onChange={(e) => {
                setWarrantyDate(e.target.value);
              }}
            />
            {isWarrantyDateError && isWarrantyDateFocused ? (
              <FormErrorMessage
                fontWeight={"bold"}
                alignItems={"flex-start"}
                pt={2}
                marginTop={0}
                minH={10}
              >
                {warrantyDateError}
              </FormErrorMessage>
            ) : (
              <Box minH={10}></Box>
            )}
          </FormControl>
        </Box>
      </Box>
    </>
  );
}

export default CreateOrEditBatch;
