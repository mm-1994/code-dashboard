import { Button, } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/layout";
import React, { useState, useContext } from "react";
import { changePassword, resetPassword } from "../../../api/user";
import { showsuccess } from "../../../helpers/toast-emitter";
import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EmailPattern } from "../../../data/patterns";
import { ThemeContext } from "../../../context/theme";

function ChangePassword({ user, reset }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showVerifyNew, setShowVerifyNew] = useState(false);
  const themeCtx = useContext(ThemeContext);
  const navigate = useNavigate();
  const redirectToLogin = () => {
    return navigate("/login/");
  };
  const redirectToForgetPassword = () => {
    return navigate("/forget-password/");
  };
  const {
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    handleSubmit,
    control,
  } = useForm({ mode: "onTouched" });

  const changePasswordCall = (data) => {
    changePassword(user.user_name, data.oldPassword, data.newPassword).then(
      (res) => {
        showsuccess(res.data.message);
        redirectToLogin();
      }
    );
  };

  const resetPasswordCall = (data) => {
    resetPassword(data.email, data.newPassword, data.otp)
      .then((res) => {
        showsuccess(res.data.message);
        redirectToLogin();
      })
      .catch((err) => {
        if (
          err.response.status === 400 &&
          err.response.data.message === "otp expired request a new one"
        ) {
          redirectToForgetPassword();
        }
      });
  };

  const emailFormField = () => {
    return (
      <FormControl
        mb={7}
        color={"text.primary"}
        w={"100%"}
        isRequired
        isInvalid={errors.email}
      >
        <FormLabel htmlFor="email">
          Enter email address assosiated with your account
        </FormLabel>
        <InputGroup display={"flex"} flexWrap={"wrap"} size="md">
          <Input
            id="email"
            pr="4.5rem"
            type={"email"}
            placeholder="Enter your email"
            variant={"outline"}
            borderColor={"secondary.100"}
            color={"text.primary"}
            {...register("email", {
              required: "This is required",
              pattern: {
                value: EmailPattern,
                message: "invalid email address",
              },
            })}
          />
          <FormErrorMessage color={"danger.100"}>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </InputGroup>
      </FormControl>
    );
  };

  const oldPasswordFormField = () => {
    return (
      <FormControl
        mb={2}
        color={"text.primary"}
        w={"100%"}
        isRequired
        isInvalid={errors.oldPassword}
      >
        <Text fontWeight={'bold'} color={'text.primary'} mb={2} textIndent={2}>Enter old password</Text>
        <InputGroup display={"flex"} flexDirection={"column"}>
          <Input
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
            id="oldPassword"
            type={showOld ? "text" : "password"}
            placeholder="Enter old password"
            variant={"outline"}
            {...register("oldPassword", {
              required: "This is required",
        
            })}
          />
          <InputRightElement width="4.5rem">
            <Button
              bg={"transparent"}
              color={"text.secondary"}
              h="1.75rem"
              size="sm"
              _hover={{bg:"transparent"
            }}
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
          {errors.oldPassword && errors.oldPassword.message ?
          <FormErrorMessage color={"danger.100"} fontWeight={"bold"} mt={0} pt={1}  maxH={"15px"} >
            {errors.oldPassword && errors.oldPassword.message}
          </FormErrorMessage>:
           <Box minH={"15px"}/>}
        </InputGroup>
      </FormControl>
    );
  };

  const otpFormField = () => {
    return (
      <FormControl
        mb={7}
        color={"text.primary"}
        w={"100%"}
        isRequired
        isInvalid={errors.otp}
      >
        <FormLabel htmlFor="otp">Enter otp</FormLabel>
        <InputGroup display={"flex"} flexWrap={"wrap"} size="md">
          <Box w={"100%"}>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <HStack gap={6}>
                  <PinInput
                    id="otp"
                    pr="4.5rem"
                    display={"flex"}
                    {...register("otp", {
                      required: "This is required",
                      minLength: {
                        value: 5,
                        message: "Minimum length should be 5",
                      },
                    })}
                    value={value}
                    onChange={(e) => onChange({ target: { value: e } })}
                  >
                    <PinInputField
                      borderColor={"secondary.100"}
                      color={"text.primary"}
                    />
                    <PinInputField
                      borderColor={"secondary.100"}
                      color={"text.primary"}
                    />
                    <PinInputField
                      borderColor={"secondary.100"}
                      color={"text.primary"}
                    />
                    <PinInputField
                      borderColor={"secondary.100"}
                      color={"text.primary"}
                    />
                    <PinInputField
                      borderColor={"secondary.100"}
                      color={"text.primary"}
                    />
                  </PinInput>
                </HStack>
              )}
            />
          </Box>
          <FormErrorMessage color={"danger.100"}>
            {errors.otp && errors.otp.message}
          </FormErrorMessage>
        </InputGroup>
      </FormControl>
    );
  };

  const resetPasswordFormFields = () => {
    return (
      <>
        {otpFormField()}
        {emailFormField()}
      </>
    );
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      height={"80vh"}
      alignItems={"center"}
    >
      <Box
        p={12}
        borderRadius={"10px"}
        bg={reset ? "transparent" : "primary.80"}
        display={"flex"}
        color={"text.primary"}
        w={"fit-content"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <Heading fontSize={"2xl"} color={"text.secondary"} mb={5}>
          Change Password
        </Heading>

        <Flex w={"100%"} mx={4} mt={4} gap={10} flexWrap={"wrap"}>
          <form
            onSubmit={handleSubmit(
              reset ? resetPasswordCall : changePasswordCall
            )}
            style={{ width: "100%" }}
          >
            {reset ? resetPasswordFormFields() : oldPasswordFormField()}
            <FormControl
              mb={2}
              color={"text.primary"}
              w={"100%"}
              isRequired
              isInvalid={errors.newPassword}
            >
              <Text fontWeight={'bold'} color={'text.primary'} mb={2} textIndent={2}>Enter new password</Text>
              <InputGroup display={"flex"} flexDirection={"column"} >
                <Input
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
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  variant={"outline"}
                  {...register("newPassword", {
                    required: "This is required",
                    validate: (val) => {
                      if (watch("oldPassword") === val) {
                        return "Can't choose old password again";
                      }
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    bg={"transparent"}
                    color={"text.secondary"}
                    h="1.75rem"
                    size="sm"
                    _hover={{bg:"transparent"}}
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                {errors.newPassword && errors.newPassword.message ?
          <FormErrorMessage color={"danger.100"} fontWeight={"bold"} mt={0} pt={1}  maxH={"15px"} >
            {errors.newPassword && errors.newPassword.message}
          </FormErrorMessage>:
           <Box minH={"15px"}/>}
              </InputGroup>
            </FormControl>
            <FormControl
              mb={7}
              color={"text.primary"}
              isRequired
              isInvalid={errors.verifyNewPassword}
            >
              
              <Text fontWeight={'bold'} color={'text.primary'} mb={2} textIndent={2}>  Verify new password</Text>
              <InputGroup display={"flex"} flexDir={'column'} >
                <Input
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
                  pr="4.5rem"
                  type={showVerifyNew ? "text" : "password"}
                  placeholder="Verify new password"
                  variant={"outline"}
                  id="verifyNewPassword"
                  {...register("verifyNewPassword", {
                    required: "This is required",
                    validate: (val) => {
                      if (watch("newPassword") !== val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button
                     bg={"transparent"}
                     color={"text.secondary"}
                     h="1.75rem"
                     size="sm"
                     _hover={{bg:"transparent"}}
                    onClick={() => setShowVerifyNew(!showVerifyNew)}
                  >
                    {showVerifyNew ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                {errors.verifyNewPassword && errors.verifyNewPassword.message ?
          <FormErrorMessage color={"danger.100"} fontWeight={"bold"} mt={0} pt={1}  maxH={"15px"} >
            {errors.verifyNewPassword && errors.verifyNewPassword.message}
          </FormErrorMessage>:
           <Box minH={"15px"}/>}
              </InputGroup>
            </FormControl>
            <Box
              as={Flex}
              w={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={'flex-end'}
            >
              <Button
                bg={"primary.60"}
                color={"text.primary"}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                p={5}
                _hover={{ color: "primary.100", bg: "primary.60" }}
                isLoading={isSubmitting}
                isDisabled={!isDirty || !isValid}
                type="submit"
              >
                Change Password
              </Button>
            </Box>
          </form>
        </Flex>
      </Box>
    </Box>
  );
}

export default ChangePassword;
