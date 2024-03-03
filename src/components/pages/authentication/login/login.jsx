import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../../context/theme";
import "./login.css";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Center,
  Button,
  Text,
  Image,
  useToast,
  useDisclosure,
  Link,
  Spinner,
  SlideFade,
  Fade,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import DarkLogo from "../../../../assets/images/logo/logo-dark.png";
import LightLogo from "../../../../assets/images/logo/logo-light.png";
import Background from "../../../../assets/images/general/login_background.webp";
import ThemeButton from "../../../ui/theme-button/theme-button";
import {
  firstStepLogin,
  acceptedTermsAndConditions,
  secondStepLogin,
  hasTermsAndConditions,
} from "../../../../api/user";
import TermsAndConditions from "../terms-and-conditions/terms-and-conditions";
import { useNavigate } from "react-router-dom";

function Login() {
  const theme = useContext(ThemeContext);
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  const toast = useToast();
  const [userInfo, setUserInfo] = useState();
  const [token, setToken] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const redirectToResetPassword = () => {
    return navigate("/forget-password/");
  };
  function onSubmit(data) {
    setLoading(true);
    firstStepLogin(data.username, data.password)
      .then((res) => {
        setLoading(false);
        setUserInfo(res.userInfo);
        setToken(res.token);
        if (hasTermsAndConditions(res.userInfo.customer)) {
          if (acceptedTermsAndConditions(res.userInfo.customer)) {
            secondStepLogin(res.token, res.userInfo);
          } else {
            onOpen();
          }
        } else {
          secondStepLogin(res.token, res.userInfo);
        }
      })
      .catch((err) => {
        setLoading(false);
        if(err.response)
        {  toast({
          title: "Login was not successful",
          description: err.response.data.message,
          status: "error",
          variant: "solid",
          isClosable: true,
        });}else{
          toast({
            title: "Login was not successful",
            description: "Network error",
            status: "error",
            variant: "solid",
            isClosable: true,
          })
        }
       
      
      });
  }
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        height={"100vh"}
        width={"100%"}
        justifyContent={"center"}
      
        minWidth={"500px"}
        backgroundImage={Background}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          height={"100vh"}
          width={"100%"}
          justifyContent={"center"}
          minWidth={"500px"}
          bgColor={
            theme.darkMode
              ? "rgba(13, 13, 18, 0.7)"
              : "rgba(255, 255, 255, 0.7)"
          }
        >
          <Box
            position={"fixed"}
            top={0}
            left={0}
            width={"100%"}
            display={"flex"}
            justifyContent={"end"}
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
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexDir={"column"}
              bgColor={"primary.80"}
              opacity={0.8}
              pt={8}
              pl={10}
              pr={10}
              pb={8}
              borderRadius={15}
              boxShadow={
                theme.darkMode
                  ? "15px 40px 31px -8px rgba(0,0,0,0.9)"
                  : "15px 40px 31px -8px rgba(0,0,0,0.37)"
              }
            >
              <Fade in={true} delay={0.3}>
                <Center mb={2}>
                  <Image
                    alt="logo"
                    w={"xs"}
                    src={theme.darkMode ? LightLogo : DarkLogo}
                  />
                </Center>
              </Fade>
              <Fade in={true} delay={0.4}>
                <Center mb={2}>
                  <Text fontSize={"2xl"} color={"text.secondary"}>
                    Welcome back!
                  </Text>
                </Center>
              </Fade>

              <Center flexWrap={"wrap"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Fade in={true} delay={0.5}>
                    <FormControl
                      mb={errors.username ? 0 : 7}
                      color={"text.primary"}
                      isRequired
                      isInvalid={errors.username}
                    >
                      <FormLabel htmlFor="username" fontWeight={'bold'}>Username</FormLabel>
                      <Input
                        bg={"primary.100"}
                        color={"text.primary"}
                        borderRadius={0}
                        border={0}
                        height={45}
                        width={350}
                        borderBottom={4}
                        borderStyle={"solid"}
                        boxShadow={
                          theme.darkMode
                            ? "5px 10px 15px 1px rgba(0,0,0,1)"
                            : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                        }
                        borderColor={"action.100"}
                        _autofill={{
                          textFillColor: "text.primary",
                          boxShadow: `0 0 0px 1000px ${
                            theme.darkMode ? "#171821" : "#Primary.100"
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
                        id="username"
                        placeholder="Username"
                        {...register("username", {
                          required: "This field is required",
                          minLength: {
                            value: 3,
                            message: "Minimum length should be 3",
                          },
                        })}
                      />
                      <FormErrorMessage
                        h={7}
                        marginTop={0}
                        color={"danger.100"}
                        fontWeight={'bold'}
                      >
                        {errors.username && errors.username.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Fade>
                  <Fade in={true} delay={0.6}>
                    <FormControl
                      mb={errors.password ? 0 : 7}
                      color={"text.primary"}
                      isRequired
                      isInvalid={errors.password}
                    >
                      <FormLabel htmlFor="password" fontWeight={'bold'}>Password</FormLabel>
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
                        boxShadow={
                          theme.darkMode
                            ? "5px 10px 15px 1px rgba(0,0,0,1)"
                            : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                        }
                        _autofill={{
                          textFillColor: "text.primary",
                          boxShadow: `0 0 0px 1000px ${
                            theme.darkMode ? "#171821" : "#Primary.100"
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
                        id="password"
                        type={"Password"}
                        placeholder="password"
                        {...register("password", {
                          required: "This field is required",
                          minLength: {
                            value: 2,
                            message: "Minimum length should be 2",
                          },
                        })}
                      />
                      <FormErrorMessage
                        h={7}
                        marginTop={0}
                        color={"danger.100"}
                        fontWeight={'bold'}
                      >
                        {errors.password && errors.password.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Fade>
                  <Fade in={true} delay={0.7}>
                    <Center flexDir={"column"} gap={4} pt={4}>
                      <Button
                        width={350}
                        bg={"action.100"}
                        color={"text.tertiary"}
                        _hover={{
                          color: "text.tertiary",
                        }}
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        {loading ? "" : "Login"}
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
                      <Link
                        textAlign={"center"}
                        color={"text.primary"}
                        onClick={redirectToResetPassword}
                        fontWeight={'bold'}
                      >
                        Forget Password ?
                      </Link>
                    </Center>
                  </Fade>
                  <Fade in={true} delay={0.7}>
                    <Box>
                      <TermsAndConditions
                        isOpen={isOpen}
                        onClose={onClose}
                        userInfo={userInfo}
                        token={token}
                      />
                    </Box>
                  </Fade>
                </form>
              </Center>
            </Box>
          </SlideFade>
        </Box>
      </Box>
    </>
  );
}

export default Login;
