import React,{useContext} from 'react';
import { 
    Box,
    Heading,
    Button,
    Fade,
    Avatar,
  } from "@chakra-ui/react";
import { useMediaQuery } from '@chakra-ui/react';
import { ThemeContext } from '../../../context/theme';


function AvatarCard ({name, id , index, buttonText, onClick}) {
    const themeCtx = useContext(ThemeContext)
    const [isNonMobile] = useMediaQuery("(min-width: 600px)");

    return (
        <Box width={isNonMobile ? "30%" : '100%'} minWidth={'200px'} >
          <Fade in delay={(index + 1) / 10}>
            <Box
              width={"100%"}
              height={"275"}
              borderRadius={"10px"}
              display={"flex"}
              flexDir={"column"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={4}
              bgColor={"primary.80"}
              key={id}
              onClick={onClick}
              cursor={"pointer"}
              _hover={{
                transition: "0.4s ease-in",
                transform: " translateY(-5%)",
                borderColor: "action.100",
              }}
              sx={{
                transition: "0.4s ease-in",
                borderWidth: "0.15vw",
                borderStyle: "solid",
                borderColor: "transparent",
              }}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 5px 7px 1px rgba(0,0,0,0.2)"
              }
            >
              <Avatar size={"xl"} name={name} />
              <Heading
                w={"100%"}
                display={"flex"}
                flexWrap={'wrap'}
                justifyContent={"center"}
                alignItems={"center"}
                color={"text.primary"}
                fontSize={"xl"}
              >
                {name.toUpperCase()}
              </Heading>
              <Button
                mb={4}
                w={"fit-content"}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                color={"text.primary"}
                bg={'primary.60'}
                _hover={{color:'primary.100', bg:'primary.60'}}
                onClick={onClick}
              >
               {buttonText}
              </Button>
            </Box>
          </Fade>
      </Box>
    );
}

export default AvatarCard;
