import { Box, Text } from "@chakra-ui/react";
import React from "react";

const CustomDatetime = function (props) {
  return (
    <Box mt={3} mb={3} width={"100%"}>
      {props.label && (
        <Text fontWeight={"bold"} mt={4} mb={2}>
          {props.label[0].toUpperCase() +
            props.label.replaceAll("_", " ").slice(1, props.label.length)}
        </Text>
      )}
      <Input
        bg={"primary.80"}
        color={endDate === "" ? "text.secondary" : "text.primary"}
        boxShadow={
          theme.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
        borderRadius={0}
        border={0}
        height={45}
        width={350}
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
        type="datetime-local"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        min={startDate}
        max={today.toISOString().replace("Z", "")}
      />
    </Box>
  );
};

export default CustomDatetime;
