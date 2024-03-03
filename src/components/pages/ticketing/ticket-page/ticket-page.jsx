import {
  Box,
  HStack,
  Heading,
  Tag,
  Text,
  Flex,
  Button,
  Icon,
  IconButton,
  Avatar,
  Input,
  Textarea,
  useDisclosure,
  FormControl,
  FormLabel,
  Center,
  Stack,
  CardBody,
  Card,
  CardHeader,
  StackDivider,
  CardFooter,
  Image,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDateOps } from "../../../../helpers/array-map";
import { AddIcon, CopyIcon, EditIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";

import { showinfo } from "../../../../helpers/toast-emitter";
import { getUserInfo } from "../../../../api/user";
import Comment from "../../../ui/ticketing/comment/comment";
import {
  createComment,
  editTicket,
  getComments,
  getTicket,
  getCategories,
} from "../../../../api/ticketing";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { TicketStatus, TicketStatusOps } from "../../../../data/ticketing";
import Empty from "../../../../assets/images/logo/no data.png";
import { hasPermission } from "../../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../../types/devices";
import { useMediaQuery } from "@chakra-ui/react";
import { ThemeContext } from "../../../../context/theme";
import { DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import { deleteTicket } from "../../../../api/ticketing";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import { useNavigate } from "react-router-dom";

function TicketPage() {
  const pageSize = 5;
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");
  const [ticket, setTicket] = useState();
  // const ticketingContext = useContext(TicketingContext);
  const themeCtx = useContext(ThemeContext);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories(1, 10).then((res) => {
      setCategories(res.data);
    });
  }, []);
  useEffect(() => {
    getTicket(ticketId).then((res) => {
      setTicket({ ...res.data });
      fetchComments(1);
      setNewAssignedTo(res.data.assigned_to.String);
      setNewStatus(res.data.status);
    });
  }, [ticketId]);
  const copyTicketLink = () => {
    navigator.clipboard.writeText(window.location.href + "");
    showinfo("copied Ticket link to clipboard");
  };
  const [pageNumber, setPageNumber] = useState(1);
  const [comments, setComments] = useState([]);
  const fetchComments = (pageNum) => {
    getComments(ticketId, pageNum, pageSize).then((res) => {
      setComments(res.data);
    });
  };
  const fetchCommentsNextPage = (pageNum) => {
    setPageNumber(pageNum);
    getComments(ticketId, pageNum, pageSize).then((res) => {
      if (res.data.length === 0) {
        setMaxPageNum(pageNum - 1);
      }
      setComments([...comments, ...res.data]);
    });
  };
  const [maxPageNum, setMaxPageNum] = useState(10000000);
  const [newCommentText, setNewCommentText] = useState("");
  const addCommentCall = (commentText) => {
    createComment(ticket.ticket_id, commentText, getUserInfo().user_name).then(
      (res) => {
        fetchComments(1);
        setNewCommentText("");
        showsuccess("Comment Added");
      }
    );
  };
  const [newStatus, setNewStatus] = useState();
  const [newAssignedTo, setNewAssignedTo] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editTicketCall = () => {
    editTicket(ticketId, newAssignedTo, newStatus).then((res) => {
      setTicket(res.data);
      onClose();
    });
  };
  const handleDeleteTicket = (id) => {
    deleteTicket(parseInt(id)).then((res) => {
      showsuccess("Successfully deleted ticket");
      //fetchTickets();
      navigate(-1);
    });
  };
  return (
    <>
      {ticket && (
        <Box
          color={"text.primary"}
          p={2}
          as={Flex}
          flexWrap={"wrap"}
          // alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}
        >
          <Box
            // me={2}
            w={isNonMobile ? "70%" : "100%"}
            display={"flex"}
            flexDirection={"column"}

            //   justifyContent={"space-between"}
          >
            <Box flexDirection={"column"} w={"100%"}>
              <Box
                as={Flex}
                justifyContent={"space-between"}
                flexwrap={"wrap"}
                w={"100%"}
                flexDirection={isNonMobile ? "row" : "column"}
              >
                <Heading fontSize={"3xl"} minW={"300px"} ml={1}>
                  {ticket.title}
                </Heading>
                <Box
                  as={Flex}
                  alignContent={"baseline"}
                  gap={2}
                  // alignItems={"center"}
                  // minW={"400px"}
                  justifyContent={isNonMobile ? "space-between" : "flex-end"}
                  flexwrap={"wrap"}
                  flexDirection={isNonMobile ? "row" : "column"}
                >
                  <Tag
                    boxShadow={
                      themeCtx.darkMode
                        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                        : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                    }
                    color={"text.primary"}
                    fontSize={"lg"}
                    bg={"primary.80"}
                    p={2}
                    // minW={"300px"}
                  >
                    Created by: {ticket.user_assigned} at{" "}
                    {formatDateOps(
                      ticket.created_at.replace("Z", ""),
                      "DD MMM, HH:mm"
                    )}
                  </Tag>
                  <Box flexDirection={"row"} display={"flex"}>
                    <IconButton
                      rounded={"full"}
                      bg={"primary.60"}
                      mr={2}
                      color={"text.primary"}
                      icon={<Icon as={CopyIcon} />}
                      onClick={() => copyTicketLink()}
                      boxShadow={
                        themeCtx.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      }
                    />
                    {hasPermission(PERMISSIONS.TICKET_EDIT) ? (
                      <IconButton
                        icon={<Icon as={EditIcon} />}
                        rounded={"full"}
                        mr={2}
                        bg={"primary.60"}
                        color={"text.primary"}
                        onClick={onOpen}
                        boxShadow={
                          themeCtx.darkMode
                            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                            : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                        }
                      />
                    ) : null}
                    <FunctionalModalV2
                      closeBtn={
                        <IconButton
                          cursor={"pointer"}
                          as={BiX}
                          size={"sm"}
                          fontSize={"xs"}
                          rounded={"full"}
                          color={"primary.100"}
                          bg={"primary.60"}
                          onClick={onClose}
                          boxShadow={
                            themeCtx.darkMode
                              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                          }
                        />
                      }
                      isOpen={isOpen}
                      modalTitle={"Edit Ticket"}
                      modalMinH={"100%"}
                      footer={false}
                      modalMinW={isNonMobile ? "fit-content" : "200px"}
                      // modalMinW={"70%"}
                    >
                      <FormControl
                        color={"text.primary"}
                        w={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        pt={2}
                        px={2}
                      >
                        <FormLabel
                          alignItems={"center"}
                          justifyContent={"center"}
                          fontWeight={"bold"}
                          color={"text.primary"}
                          width={"30%"}
                        >
                          Assigned to
                        </FormLabel>
                        <Input
                          bg={"primary.80"}
                          color={"text.primary"}
                          borderRadius={0}
                          border={0}
                          height={45}
                          width={"70%"}
                          borderBottom={4}
                          borderStyle={"solid"}
                          borderColor={"action.100"}
                          boxShadow={
                            themeCtx.darkMode
                              ? "5px 10px 15px 1px rgba(0,0,0,1)"
                              : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                          }
                          id="title"
                          pr="4.5rem"
                          placeholder="Enter username"
                          variant={"flushed"}
                          value={newAssignedTo}
                          onChange={(e) => setNewAssignedTo(e.target.value)}
                        />
                      </FormControl>
                      <FormControl
                        mb={7}
                        color={"text.primary"}
                        w={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        pt={2}
                        px={2}
                      >
                        <FormLabel
                          alignItems={"center"}
                          justifyContent={"center"}
                          fontWeight={"bold"}
                          color={"text.primary"}
                          width={"30%"}
                        >
                          Status
                        </FormLabel>
                        <Box width={"70%"}>
                          <StyledSelect
                            options={TicketStatusOps.map((op) => {
                              return { label: op, value: op };
                            })}
                            onchange={setNewStatus}
                            value={newStatus}
                            size={"lg"}
                            general={true}
                          />
                        </Box>
                      </FormControl>
                      <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button
                          color={"text.primary"}
                          bg={"primary.80"}
                          type={"submit"}
                          onClick={editTicketCall}
                        >
                          Edit ticket
                        </Button>
                      </Box>
                    </FunctionalModalV2>
                    {/* 
                    <FunctionalModal
                      modalTitle={"Delete Ticket"}
                      btnTitle={"Delete Ticket"}
                      btnColor={"primary.60"}
                      //  isDisabled={devicesSelected.length === 0}
                      btnSize={"md"}
                      display={"flex"}
                      iconSize={"20px"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      cancelable={true}
                      modalMinH={"300px"}
                      iconColor={"text.primary"}
                      iconBtn={DeleteIcon}
                      btnAction={
                        <Button
                          onClick={() => handleDeleteTicket(ticket.ticket_id)}
                          w={"fit-content"}
                          backgroundColor={"primary.80"}
                          boxShadow={
                            themeCtx.darkMode
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
                  </Box>
                </Box>
              </Box>
              <Box
                as={Flex}
                flexWrap={"wrap"}
                p={3}
                w={"fit-content"}
                gap={3}
                mt={4}
                bg={"primary.80"}
                minH={"70px"}
                borderRadius={10}
                minW={isNonMobile ? "600px" : "200px"}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                }
              >
                <Text
                  w={"100%"}
                  fontSize={"lg"}
                  fontWeight={"bold"}
                  p={0}
                  color={"text.primary"}
                >
                  Ticket Description:
                </Text>
                <Text w={"100%"} fontSize={"lg"} p={0} color={"text.primary"}>
                  {ticket.description}
                </Text>
              </Box>
              <Heading mt={2} fontSize={"lg"}>
                Comments:
              </Heading>
              <Box
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                }
                w={"100%"}
                maxHeight={"455px"}
                overflowY={"auto"}
                as={Flex}
                flexWrap={"wrap"}
                gap={2}
                p={2}
                mt={2}
                borderRadius={10}
                bg={"primary.80"}
              >
                {comments.length === 0 ? (
                  <Box
                    minH={"200px"}
                    w={"100%"}
                    display={"flex"}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Image position={"relative"} src={Empty} h={40} mb={5} />
                    <Heading
                      w={"100%"}
                      color={"text.primary"}
                      fontWeight={"semibold"}
                      fontSize={"xl"}
                      textAlign={"center"}
                    >
                      There are no comments to display.
                    </Heading>
                  </Box>
                ) : (
                  <>
                    {comments.map((comm) => {
                      return (
                        <Comment
                          pageNum={pageNumber}
                          ticketId={ticketId}
                          callback={fetchComments}
                          comment={comm}
                        />
                      );
                    })}
                    <Box as={Flex} w={"100%"} justifyContent={"center"}>
                      <Button
                        hidden={pageNumber >= maxPageNum}
                        size={"sm"}
                        color={"text.primary"}
                        bg={"primary.60"}
                        onClick={() =>
                          fetchCommentsNextPage(pageNumber + 1, pageSize)
                        }
                      >
                        show more
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
            <Card
              mt={3}
              color={"text.primary"}
              as={Flex}
              flexWrap={"wrap"}
              gap={0}
              bg={"transparent"}
              variant={"unstyled"}
              //p={4}
            >
              <CardBody w={"100%"} as={Flex} alignItems={"start"}>
                <Textarea
                  bgColor={"primary.80"}
                  borderRadius={"10px"}
                  placeholder="Write  your response for issue"
                  variant={"unstyled"}
                  pl={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  boxShadow={
                    themeCtx.darkMode
                      ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                      : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                  }
                  color={"text.primary"}
                  mb={4}
                />
              </CardBody>
              <CardFooter w={"100%"} as={Flex} justifyContent={"flex-end"}>
                <Button
                  onClick={(e) => addCommentCall(newCommentText)}
                  size={"sm"}
                  bg={"primary.60"}
                  color={"text.primary"}
                >
                  Add comment
                </Button>
              </CardFooter>
            </Card>
          </Box>
          <Box
            p={isNonMobile ? 2 : 0}
            pt={isNonMobile ? 0 : 5}
            w={isNonMobile ? "25%" : "100%"}
            //  h={"100vh"}
            borderStartColor={"text.gray.50"}
            borderStartWidth={0}
            minW={"300px"}
          >
            <Text
              fontSize={"3xl"}
              textAlign={"center"}
              fontWeight={"bold"}
              justifyContent={"flex-start"}
            >
              More Info
            </Text>
            <Card
              bg={"primary.80"}
              ml={isNonMobile ? 8 : 0}
              mr={isNonMobile ? 8 : 0}
              mt={3}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 2px 7px 1px rgba(0,0,0,0.2)"
              }
            >
              <CardHeader pl={5} pr={5}>
                <Heading color={"text.primary"} size="md">
                  Ticket Info
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="2">
                  <Box as={Flex} alignItems={"baseline"} gap={2}>
                    <Text color={"text.gray.100"} pt="1" fontSize="md">
                      Ticket ID:
                    </Text>
                    <Tag
                      rounded={"full"}
                      fontSize={"sm"}
                      bg={"primary.60"}
                      color={"text.primary"}
                    >
                      #{ticket.ticket_id}
                    </Tag>
                  </Box>
                  <Box as={Flex} alignItems={"baseline"} gap={2}>
                    <Text color={"text.gray.100"} pt="1" fontSize="md">
                      Created:
                    </Text>
                    <Text fontSize={"sm"} color={"text.primary"}>
                      {formatDateOps(
                        ticket.created_at.replace("Z", ""),
                        "DD MMM, HH:mm"
                      )}
                    </Text>
                  </Box>
                  {comments && comments.length !== 0 && (
                    <Box as={Flex} alignItems={"baseline"} gap={2}>
                      <Text color={"text.gray.100"} pt="2" fontSize="md">
                        Last message:
                      </Text>
                      <Text fontSize={"sm"} color={"text.primary"}>
                        {formatDateOps(
                          comments[0].created_at.replace("Z", ""),
                          "DD MMM, HH:mm"
                        )}
                      </Text>
                    </Box>
                  )}
                  <Box as={Flex} alignItems={"center"} gap={2}>
                    <Text color={"text.gray.100"} pt="2" fontSize="md">
                      Status:
                    </Text>
                    <Tag
                      rounded={"full"}
                      variant="outline"
                      color={"text.primary"}
                      bg={`ticket.status.${ticket.status}.color`}
                      borderColor={`ticket.status.${ticket.status}.border`}
                      fontSize={"sm"}
                      mt={2}
                    >
                      {ticket.status}
                    </Tag>
                  </Box>
                  <Box as={Flex} alignItems={"baseline"} gap={2}>
                    <Text color={"text.gray.100"} pt="2" fontSize="md">
                      Category:
                    </Text>
                    <Tag
                      rounded={"full"}
                      fontSize={"sm"}
                      bg={"primary.60"}
                      color={"text.primary"}
                    >
                      {categories.length !== 0
                        ? categories.find(
                            (cat) => cat.category_id === ticket.category_id
                          ).name
                        : ticket.category_id}
                    </Tag>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
            <Card
              bg={"primary.80"}
              ml={isNonMobile ? 8 : 0}
              mr={isNonMobile ? 8 : 0}
              mt={2}
              mb={2}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 2px 7px 1px rgba(0,0,0,0.2)"
              }
            >
              <CardHeader
                as={Flex}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <Heading color={"text.primary"} size="md">
                  Assign To
                </Heading>
                {hasPermission(PERMISSIONS.TICKET_EDIT) ? (
                  <IconButton
                    icon={<AddIcon color={"text.primary"} />}
                    size={"sm"}
                    onClick={onOpen}
                    rounded={"full"}
                    bg={"primary.100"}
                  />
                ) : null}
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {ticket && ticket.assigned_to.Valid && (
                    <Box as={Flex} alignItems={"baseline"} gap={2}>
                      <Avatar
                        mr={4}
                        size={"sm"}
                        name={ticket.assigned_to.String}
                      />
                      <Box as={Flex} flexWrap={"wrap"}>
                        <Text color={"text.primary"} pt="2" fontSize="lg">
                          {ticket.assigned_to.String}
                        </Text>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardBody>
            </Card>
            <Card
              bg={"primary.80"}
              ml={isNonMobile ? 8 : 0}
              mr={isNonMobile ? 8 : 0}
              mt={2}
              mb={2}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 2px 7px 1px rgba(0,0,0,0.2)"
              }
            >
              <CardHeader
                as={Flex}
                justifyContent={"space-between"}
                alignItems={"baseline"}
              >
                <Heading color={"text.primary"} size="md">
                  Requester
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box as={Flex} alignItems={"baseline"} gap={2}>
                    <Avatar
                      mr={4}
                      size={"sm"}
                      name={ticket.user_assigned}
                      bg={"primary.60"}
                    />
                    <Box as={Flex} flexWrap={"wrap"}>
                      <Text color={"text.primary"} pt="2" fontSize="lg">
                        {ticket.user_assigned}
                      </Text>
                    </Box>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
}

export default TicketPage;
