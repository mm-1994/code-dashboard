import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Tag,
  Text,
  Avatar,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { formatDateOps } from "../../../../helpers/array-map";
import { useContext } from "react";
import { ThemeContext } from "../../../../context/theme";
import { FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import { useMediaQuery } from "@chakra-ui/react";
import FunctionalModal from "../../functional-modal/functional-modal";
import { DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import { deleteTicket } from "../../../../api/ticketing";
import { showsuccess } from "../../../../helpers/toast-emitter";

function Ticket({ ticket, redirectToTicket, fetchTickets }) {
  const themeContext = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");

  const handleDeleteTicket = (id) => {
    deleteTicket(parseInt(id)).then((res) => {
      showsuccess("Successfully deleted ticket");
      fetchTickets();
    });
  };

  return (
    <Card
      borderRadius={10}
      flexDirection={"row"}
      boxShadow={
        themeContext.darkMode
          ? "5px 4px 15px 1px rgba(0,0,0,0.9)"
          : "5px 4px 15px 1px rgba(0,0,0,0.2)"
      }
      onClick={redirectToTicket}
      cursor={"pointer"}
      w={"100%"}
      bg={"primary.80"}
      color={"text.primary"}
      _hover={{
        transition: "0.2s ease-in",
        transform: " translateY(-3%)",
        backgroundColor: "ticket.card.secondary",
        color: "text.secondary",
      }}
      sx={{
        transition: "0.2s ease-in",
        // borderWidth: "0.10vw",
        // borderStyle: "solid",
        // borderColor: "ticket.card.primary",
        color: "text.primary",
      }}
    >
      {isNonMobile && (
        <Box
          w={"20%"}
          borderStyle={"dashed"}
          borderRightWidth={3}
          borderColor={"primary.60"}
          //bg={"red"}
          pl={2}
          pr={2}
          alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}
        >
          <Avatar
            flexDirection={"column"}
            icon={<FaTicketAlt />}
            size={isNonMobile ? "xl" : "md"}
            // name={ticket.title}
            boxShadow={
              themeContext.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 2px 7px 1px rgba(0,0,0,0.2)"
            }
            bg={"primary.60"}
            color={"text.primary"}
            fontSize={30}
          >
            #{ticket.ticket_id}
          </Avatar>
        </Box>
      )}
      <Box bg="primary.80" w={isNonMobile ? "80%" : "100%"} borderRadius={10}>
        <CardHeader
          as={Flex}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <Heading
            //textOverflow={"inherit"}
            fontSize={"2xl"}
            maxWidth={"75%"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
          >
            {ticket.title}
          </Heading>

          {/* <FunctionalModal
            modalTitle={"Delete Device Group"}
            btnTitle={"Delete Group"}
            btnColor={"primary.60"}
            //  isDisabled={devicesSelected.length === 0}
            btnSize={"lg"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            cancelable={true}
            modalMinH={"300px"}
            iconBtn={DeleteIcon}
            btnAction={
              <Button
                onClick={() => handleDeleteTicket(ticket.ticket_id)}
                w={"fit-content"}
                backgroundColor={"primary.80"}
                boxShadow={
                  themeContext.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                color={"danger.100"}
                _hover={{ color: "primary.100", bg: "primary.60" }}
              >
                Delete
              </Button>
            }
          >
            <Text
              color={"text.primary"}
              textAlign={"center"}
              fontWeight={"bold"}
              py={20}
            >
              Are you sure you want to delete ticket {ticket.title}?
            </Text>
          </FunctionalModal> */}
        </CardHeader>
        <CardBody
          justifyContent={"flex-start"}
          display={"flex"}
          alignItems={"center"}
          // textOverflow={"ellipsis"}
          // whiteSpace={"nowrap"}
        >
          <Text
            maxWidth={"100%"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
          >
            {ticket.description}
          </Text>
        </CardBody>
        <CardFooter>
          <Box
            as={Flex}
            flexWrap={"wrap"}
            justifyContent={"flex-end"}
            display={"flex"}
            alignItems={"center"}
            w={"100%"}
            //maxW={isNonMobile && "100px"}
          >
            <HStack spacing={4} flexWrap={"wrap"} w={"80%"}>
              <Tag
                rounded={"full"}
                variant="outline"
                bg={`ticket.status.${ticket.status}.color`}
                borderColor={`ticket.status.${ticket.status}.border`}
                p={2}
                color={"text.dark"}
              >
                {ticket.status}
              </Tag>
              <Tag
                rounded={"full"}
                bg={"primary.60"}
                p={2}
                color={"text.primary"}
                ml={1}
                mr={1}
              >
                {ticket.category ? ticket.category.name : ticket.category_id}
              </Tag>
              <Tag
                rounded={"full"}
                //variant="outline"
                // colorScheme="gray"
                bg={"primary.60"}
                p={2}
                color={"text.primary"}
              >
                Ticket ID:{ticket.ticket_id}
              </Tag>
              {ticket.user_assigned ? (
                <Tag
                  rounded={"full"}
                  //variant="outline"
                  // colorScheme="gray"
                  bg={"primary.60"}
                  p={2}
                  color={"text.primary"}
                  ml={1}
                  mr={1}
                >
                  {ticket.user_assigned}
                </Tag>
              ) : null}
            </HStack>
            <Box display={"flex"} w={"20%"} justifyContent={"flex-end"}>
              <Text>
                {formatDateOps(ticket.created_at.replace("Z", ""), "DD MMM")}
              </Text>
            </Box>
          </Box>
        </CardFooter>
      </Box>
    </Card>
  );
}

export default Ticket;
