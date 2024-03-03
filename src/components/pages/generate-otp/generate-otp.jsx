import React, { useContext, useState } from "react";
import { generateOtp } from "../../../api/user";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/theme";
import ThemeButton from "../../ui/theme-button/theme-button";
import Background from "../../../assets/images/general/login_background.webp";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Spinner,
  SlideFade,
  Fade,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { EmailPattern } from "../../../data/patterns";
import { showsuccess } from "../../../helpers/toast-emitter";

function GenerateOtp() {
  const theme = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
    handleSubmit,
  } = useForm({ mode: "onTouched" });
  const navigate = useNavigate();
  const redirectToResetPassword = () => {
    return navigate("/reset-password/");
  };
  const sendOtpRequest = (data) => {
    setLoading(true);
    generateOtp(data.email)
      .then((res) => {
        setLoading(false);
        showsuccess(res.data.message);
        redirectToResetPassword();
      })
      .catch((e) => setLoading(false));
  };
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      height={"100vh"}
      width={"100%"}
      justifyContent={"center"}
      minHeight={"700px"}
      minWidth={"500px"}
      backgroundImage={Background}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        height={"100vh"}
        width={"100%"}
        justifyContent={"center"}
        minHeight={"700px"}
        minWidth={"500px"}
        bgColor={
          theme.darkMode ? "rgba(13, 13, 18, 0.7)" : "rgba(255, 255, 255, 0.7)"
        }
      >
        <Box
          position={"fixed"}
          width={"100%"}
          display={"flex"}
          justifyContent={"end"}
          top={0}
          left={0}
          p={2}
        >
          <ThemeButton />
        </Box>
        <SlideFade
          direction="bottom"
          in={true}
          style={{ zIndex: 1 }}
          delay={0.2}
          offsetY="50px"
        >
          <Box
            p={12}
            borderRadius={15}
            bgColor={"primary.80"}
            opacity={0.8}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
            color={"text.primary"}
            gap={5}
            boxShadow={
              theme.darkMode
                ? "15px 40px 31px -8px rgba(0,0,0,0.9)"
                : "15px 40px 31px -8px rgba(0,0,0,0.37)"
            }
          >
            <Fade in={true} delay={0.3}>
              <Heading fontSize={"2xl"} color={"text.secondary"}>
                Forgot your password ?
              </Heading>
            </Fade>
            <Center w={"100%"} pr={4} pl={4} pt={4}>
              <form onSubmit={handleSubmit(sendOtpRequest)}>
                <Fade in={true} delay={0.4}>
                  <FormControl
                    mb={errors.email ? 0 : 7}
                    color={"text.primary"}
                    isRequired
                    isInvalid={errors.email}
                  >
                    <FormLabel htmlFor="email" fontWeight={'bold'}>
                      Enter your email address
                    </FormLabel>
                    <InputGroup display={"flex"} flexDir={"column"} size="md">
                      <Input
                        bg={"primary.100"}
                        color={"text.primary"}
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
                            theme.darkMode ? "#171821" : "#primary.100"
                          } inset`,
                          textFillColor: theme.darkMode ? "#FFFFFF" : "#000000",
                        }}
                        _focus={{
                          bg: "primary.100",
                          border: 0,
                          borderBottom: 5,
                          borderStyle: "solid",
                          borderColor: "action.100",
                        }}
                        boxShadow={
                          theme.darkMode
                            ? "5px 10px 15px 1px rgba(0,0,0,1)"
                            : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                        }
                        _hover={{
                          bg: "primary.100",
                          border: 0,
                          borderBottom: 4,
                          borderStyle: "solid",
                          borderColor: "action.100",
                        }}
                        id="email"
                        type={"email"}
                        placeholder="Enter your email"
                        {...register("email", {
                          required: "This field is required",
                          pattern: {
                            value: EmailPattern,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      <FormErrorMessage
                        h={7}
                        marginTop={0}
                        color={"danger.100"}
                        fontWeight={'bold'}
                      >
                        {errors.email && errors.email.message}
                      </FormErrorMessage>
                    </InputGroup>
                  </FormControl>
                </Fade>
                <Fade in={true} delay={0.5}>
                  <Box as={Flex} w={"100%"} flexWrap={"wrap"} gap={2}>
                    <Button
                      isLoading={isSubmitting}
                      width={350}
                      marginTop={1}
                      bg={"action.100"}
                      color={"text.tertiary"}
                      _hover={{
                        color: "text.tertiary",
                      }}
                      isDisabled={!isDirty || !isValid}
                      type="submit"
                    >
                      {loading ? "" : "Request reset password"}
                        {loading && (
            <Spinner
            thickness="4px"
            speed="0.85s"
            emptyColor="text.primary"
            color="primary.60"
            size="md"
          />
                        )}
                    </Button>
                  </Box>
                </Fade>
              </form>
            </Center>
          </Box>
        </SlideFade>
      </Box>
    </Box>
  );
}

export default GenerateOtp;
