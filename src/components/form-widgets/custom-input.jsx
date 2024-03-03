import {
  Box,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { ThemeContext } from "../../context/theme";

const CustomNumberInput = function (props) {
  const theme = useContext(ThemeContext);
  return (
    <Box mt={3} mb={3} width={'100%'} >
      <Text color={"text.primary"} fontWeight={"bold"} mt={4} mb={2}>
        {props.label[0].toUpperCase() +
          props.label.replaceAll("_", " ").slice(1, props.label.length)}
      </Text>
      {props.schema.type === "number" ? (
        <>
          <NumberInput
            min={props.schema.minimum}
            max={props.schema.maximum}
            isReadOnly={props.readonly}
            isRequired={props.required}
            isDisabled={props.disabled}
            variant={"outline"}
            borderColor={"transparent"}
            bg={"primary.80"}
            allowMouseWheel
            value={props.value}
            onChange={(e) => props.onChange(e)}
          >
            <NumberInputField
             placeholder={
                "Please enter " + props.label.replaceAll("_", " ").toLowerCase()
              }
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              boxShadow={
                theme.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
              borderBottom={4}
              borderStyle={"solid"}
              borderColor={"action.100"}
              _autofill={{
                textFillColor: "text.primary",
                boxShadow: `0 0 0px 1000px ${
                  theme.darkMode ? "#171821" : "#FFFFFF"
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
            />
            <NumberInputStepper>
              <NumberIncrementStepper
                borderRadius={"10px"}
                borderColor={"transparent"}
                color={"action.100"}
              />
              <NumberDecrementStepper
                borderRadius={"10px"}
                borderColor={"transparent"}
                color={"action.100"}
              />
            </NumberInputStepper>
          </NumberInput>
        </>
      ) : (
        <>
          <Input
            isReadOnly={props.readonly}
            isRequired={props.required}
            isDisabled={props.disabled}
            placeholder={
              "Please enter " + props.label.replaceAll("_", " ").toLowerCase()
            }
            bg={"primary.80"}
            color={"text.primary"}
            borderRadius={0}
            border={0}
            height={45}
            boxShadow={
              theme.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
            borderBottom={4}
            borderStyle={"solid"}
            borderColor={"action.100"}
            _autofill={{
              textFillColor: "text.primary",
              boxShadow: `0 0 0px 1000px ${
                theme.darkMode ? "#171821" : "#FFFFFF"
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
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        </>
      )}
    </Box>
  );
};

export default CustomNumberInput;
