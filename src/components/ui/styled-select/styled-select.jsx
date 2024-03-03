import { Select as ChakraSelect } from "@chakra-ui/select";
import {
  Box,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/theme";
import { MultiSelect } from "react-multi-select-component";
import "./styled-select.css";

function StyledSelect({
  removeNoChoice,
  disabled = false,
  options,
  onchange,
  value,
  size,
  multi = false,
  general,
  required,
  onBlur,
  isInvalid
}) {
  const { theme, darkMode } = useContext(ThemeContext);
  const optsStyle = {
    backgroundColor: !theme.colors ? 'transparent':theme.colors.primary[80],
    fontFamily: "DM Sans",
    borderRadius: "0px",
    borderColor: "primary.60",
  };

  return (
    <Box height={'100%'} >
      {!multi ? (
          <>
        {general ? (
        <ChakraSelect
        isInvalid={isInvalid}
          isDisabled={disabled}
          bg={"primary.80"}
          color={"text.primary"}
          borderRadius={0}
          onBlur={onBlur}
          border={0}
          height={45}
          boxShadow={
            darkMode
              ? "5px 10px 15px 1px rgba(0,0,0,1)"
              : "5px 8px 15px 1px rgba(0,0,0,0.2)"
          }
          borderBottom={4}
          borderStyle={"solid"}
          borderColor={"action.100"}
          _autofill={{
            textFillColor: "text.primary",
            boxShadow: `0 0 0px 1000px ${
              darkMode ? "#171821" : "#FFFFFF"
            } inset`,
            textFillColor: darkMode ? "#FFFFFF" : "#000000",
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
          onChange={(e) => {
            onchange(e.target.value + "");
          }}
          value={value !== undefined || value === 0  ? value : -1}
        >
         
            <option style={optsStyle}  disabled={required} value={-1}>
              Choose an option
            </option>
          
          {options &&
            options.map((ops) => {
              return (
                <option key={ops.value} style={optsStyle} value={ops.value}>
                  {ops.label.replaceAll("_", " ")}
                </option>
              );
            })}
        </ChakraSelect>):(  
        <ChakraSelect
          isDisabled={disabled}
          bg={"primary.100"}
          borderWidth={"1px"}
          borderColor={'primary.60'}
          borderRadius={'20px'}
          size={size}
          width={"100%"}
          color={"text.primary"}
          boxShadow={
            darkMode
            ? "5px 10px 15px 1px rgba(0,0,0,1)"
            : "5px 8px 15px 1px rgba(0,0,0,0.2)"
          }
          onChange={(e) => {
            onchange(e.target.value + "");
          }}
          value={value}
        >
          {!removeNoChoice && (
            <option style={optsStyle}  disabled={true} value={-1}>
              Choose an option
            </option>
          )}
          {options &&
            options.map((ops) => {
              return (
                <option key={ops.value} style={optsStyle} value={ops.value}>
                  {ops.label.replaceAll("_", " ")}
                </option>
              );
            })}
        </ChakraSelect>)}</>
      ) : (
        options && (
          <Box className={darkMode ? "multi-select-dark" : "multi-select-light" }>
           <MultiSelect
            options={options}
            value={value}
            onChange={onchange}
            labelledBy="Select"
          />
          </Box>
        )
      )}
    </Box>
  );
}
export default StyledSelect;
