import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Tag,
  Collapse,
  ButtonGroup,
  IconButton,
  Image,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  createTicket,
  getCategories,
  getTickets,
} from "../../../api/ticketing";
import Ticket from "../../ui/ticketing/ticket/ticket";
import { FiFilter, FiSearch } from "react-icons/fi";
import StyledSelect from "../../ui/styled-select/styled-select";
import FunctionalModalV2 from "../../ui/functional-modal-v2/functional-modal-v2";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { searchObjects } from "../../../helpers/array-map";
import { getUserInfo } from "../../../api/user";
import { ThemeContext } from "../../../context/theme";
import { useMediaQuery } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import Empty from "../../../assets/images/logo/no data.png";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";

function Ticketing() {
  const pageSize = 10;
  const {
    reset,
    register,
    getValues,
    formState: { errors, isSubmitting, isDirty, isValid },
    handleSubmit,
  } = useForm({ mode: "onTouched" });
  const [pageNumber, setPageNumber] = useState(1);
  const [categories, setCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [searchedTickets, setSearchedTickets] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 1700px)");
  const [maxPageNum, setMaxPageNum] = useState(1000000000);
  const filtersCollapse = useDisclosure();
  const [categoryFilteredChoice, setCategoryFilteredChoice] = useState();
  const [createdByFilteredChoice, setCreatedByFilteredChoice] = useState();
  const [assignedToFilteredChoice, setAssignedToFilteredChoice] = useState();
  const [category, setCategory] = useState("-1");
  const [isSelectError, setIsSelectError] = useState(false);
  const [filterChoice, setFilterChoice] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure({
    id: "modal-create-ticket",
  });

  const fetchTickets = (pageNum, numberPerPage) => {
    setLoadingTickets(true);
    getTickets(getUserInfo().user_name, pageNum, numberPerPage)
      .then((res) => {
        setLoadingTickets(false);
        setTickets(res.data);
        setSearchedTickets(res.data);
        getCategories(1, 10).then((resC) => {
          setCategories(resC.data);
        });
      })
      .catch(() => setLoadingTickets(false));
  };
  const fetchTicketsWithFilters = (
    userAssigned,
    pageNum,
    numberPerPage,
    category,
    assignedTo
  ) => {
    getTickets(
      userAssigned,
      pageNum,
      numberPerPage,
      parseInt(category),
      assignedTo
    ).then((res) => {
      setTickets(
        [...res.data].map((ticket) => {
          return {
            ...ticket,
            category: categories.find(
              (cat) => cat.category_id === ticket.category_id
            ),
          };
        })
      );
      setSearchedTickets(
        [...res.data].map((ticket) => {
          return {
            ...ticket,
            category: categories.find(
              (cat) => cat.category_id === ticket.category_id
            ),
          };
        })
      );
    });
  };
  const fetchTicketsNewPage = (pageNum, numberPerPage) => {
    setPageNumber(pageNum);
    getTickets(getUserInfo().user_name, pageNum, numberPerPage).then((res) => {
      if (res.data.length === 0) {
        setMaxPageNum(pageNum - 1);
      }
      const newTicketsList = [
        ...tickets,
        ...res.data.map((ticket) => {
          return {
            ...ticket,
            category: categories.find(
              (cat) => cat.category_id === ticket.category_id
            ),
          };
        }),
      ];
      setTickets([...newTicketsList]);
      setSearchedTickets([...newTicketsList]);
    });
  };
  const redirectToTicketCall = (ticketId) => {
    return navigate("" + ticketId);
  };

  const createTicketCall = () => {
    const data = getValues();
    createTicket(
      parseInt(category),
      data.description,
      "open",
      data.title,
      getUserInfo().user_name
    ).then((res) => {
      fetchTickets(1, pageSize);
      onClose();
      reset();
    });
  };

  const TicketForm = () => {
    return (
      <>
        <FormControl
          mb={7}
          color={"text.primary"}
          w={"100%"}
          isRequired
          isInvalid={errors.title}
        >
          <FormLabel htmlFor="title" fontWeight={"bold"} color={"text.primary"}>
            Title
          </FormLabel>
          <InputGroup display={"flex"} flexWrap={"wrap"} size="md">
            <Input
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              width={"100%"}
              borderBottom={4}
              borderStyle={"solid"}
              borderColor={"action.100"}
              boxShadow={
                theme.darkMode
                  ? "5px 10px 15px 1px rgba(0,0,0,1)"
                  : "5px 8px 15px 1px rgba(0,0,0,0.2)"
              }
              id="title"
              pr="4.5rem"
              placeholder="Enter ticket title"
              {...register("title", {
                required: "This is required",
                minLength: {
                  value: 5,
                  message: "Minimum length should be 5",
                },
                maxLength: {
                  value: 50,
                  message: "Maximum length should be 50",
                },
              })}
            />
            <FormErrorMessage color={"danger.100"}>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </InputGroup>
        </FormControl>
        <FormControl
          mb={7}
          color={"text.primary"}
          w={"100%"}
          isRequired
          isInvalid={errors.title}
        >
          <FormLabel
            htmlFor="description"
            fontWeight={"bold"}
            color={"text.primary"}
          >
            Description
          </FormLabel>
          <InputGroup display={"flex"} flexWrap={"wrap"} size="md">
            <Textarea
              bg={"primary.80"}
              color={"text.primary"}
              borderRadius={0}
              border={0}
              height={45}
              width={"100%"}
              borderBottom={4}
              borderStyle={"solid"}
              borderColor={"action.100"}
              boxShadow={
                theme.darkMode
                  ? "5px 10px 15px 1px rgba(0,0,0,1)"
                  : "5px 8px 15px 1px rgba(0,0,0,0.2)"
              }
              pr="4.5rem"
              id="description"
              placeholder="Enter ticket description"
              {...register("description", {
                required: "This is required",
                minLength: {
                  value: 5,
                  message: "Minimum length should be 5",
                },
                maxLength: {
                  value: 200,
                  message: "Maximum length should be 200",
                },
              })}
            />
            <FormErrorMessage color={"danger.100"}>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </InputGroup>
        </FormControl>
        <FormControl
          mb={7}
          color={"text.primary"}
          w={"100%"}
          isRequired
          isInvalid={errors.title}
        >
          <FormLabel
            htmlFor="category"
            fontWeight={"bold"}
            color={"text.primary"}
          >
            Category
          </FormLabel>
          <InputGroup display={"flex"} flexWrap={"wrap"} size="md">
            <Box w={"100%"}>
              <StyledSelect
                options={categories.map((cat) => {
                  return { label: cat.name, value: cat.category_id };
                })}
                onchange={setCategory}
                value={category}
                size={"lg"}
                general={true}
              />
            </Box>
            <Text mt={2} color={"danger.100"}>
              {isSelectError ? "Please choose a category" : ""}
            </Text>
          </InputGroup>
        </FormControl>
      </>
    );
  };

  const FiltersForm = () => {
    const onChangeFilterChoice = (choice) => {
      setCategoryFilteredChoice(null);
      setCreatedByFilteredChoice(null);
      setAssignedToFilteredChoice(null);
      setFilterChoice(choice);
    };
    const applyFiltersBtn = () => {
      fetchTicketsWithFilters(
        filterChoice === "user_assigned" ? createdByFilteredChoice : null,
        1,
        pageSize,
        filterChoice === "category" ? categoryFilteredChoice : null,
        filterChoice === "assigned_to" ? assignedToFilteredChoice : null
      );
    };
    return (
      <Collapse w={"100%"} in={filtersCollapse.isOpen} animateOpacity>
        <Box
          p={4}
          color={"text.primary"}
          as={Flex}
          w={isNonMobile ? "70%" : "100%"}
          gap={2}
          justifyContent={"start"}
          alignItems={"baseline"}
          flexDirection={isNonMobile ? "row" : "column"}
        >
          <FormControl maxW={"400px"} ml={3}>
            <FormLabel fontWeight={"bold"}>Filter by: </FormLabel>
            <StyledSelect
              options={[
                { label: "Created by", value: "user_assigned" },
                { label: "Assigned to", value: "assigned_to" },
                { label: "Category", value: "category" },
              ]}
              value={filterChoice}
              onchange={onChangeFilterChoice}
              general={true}
            />
          </FormControl>
          {filterChoice === "user_assigned" ? (
            <FormControl>
              <FormLabel fontWeight={"bold"}>Created by: </FormLabel>
              <Input
                bg={"primary.80"}
                color={"text.primary"}
                borderRadius={0}
                border={0}
                height={45}
                // width={"70%"}
                borderBottom={4}
                borderStyle={"solid"}
                borderColor={"action.100"}
                boxShadow={
                  theme.darkMode
                    ? "5px 10px 15px 1px rgba(0,0,0,1)"
                    : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                }
                pr="4.5rem"
                value={createdByFilteredChoice}
                onChange={(e) => setCreatedByFilteredChoice(e.target.value)}
              />
            </FormControl>
          ) : null}
          {filterChoice === "assigned_to" ? (
            <FormControl>
              <FormLabel fontWeight={"bold"}>Assigned to: </FormLabel>
              <Input
                bg={"primary.80"}
                color={"text.primary"}
                borderRadius={0}
                border={0}
                height={45}
                // width={"70%"}
                borderBottom={4}
                borderStyle={"solid"}
                borderColor={"action.100"}
                boxShadow={
                  theme.darkMode
                    ? "5px 10px 15px 1px rgba(0,0,0,1)"
                    : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                }
                pr="4.5rem"
                value={assignedToFilteredChoice}
                onChange={(e) => setAssignedToFilteredChoice(e.target.value)}
              />
            </FormControl>
          ) : null}
          {filterChoice === "category" ? (
            <FormControl>
              <FormLabel fontWeight={"bold"}>Category: </FormLabel>
              <StyledSelect
                general={true}
                options={categories.map((cat) => {
                  return { label: cat.name, value: cat.category_id };
                })}
                value={categoryFilteredChoice}
                onchange={setCategoryFilteredChoice}
              />
            </FormControl>
          ) : null}
        </Box>
        <Box pl={4} pr={4} pt={1} as={Flex} w={"100%"} justifyContent={"end"}>
          <Button
            onClick={applyFiltersBtn}
            bg={"primary.60"}
            color={"text.primary"}
          >
            Apply filters
          </Button>
        </Box>
      </Collapse>
    );
  };

  useEffect(() => {
    fetchTickets(1, pageSize);
  }, []);

  useEffect(() => {
    setTickets(
      [...tickets].map((ticket) => {
        return {
          ...ticket,
          category: categories.find(
            (cat) => cat.category_id === ticket.category_id
          ),
        };
      })
    );
    setSearchedTickets(
      [...tickets].map((ticket) => {
        return {
          ...ticket,
          category: categories.find(
            (cat) => cat.category_id === ticket.category_id
          ),
        };
      })
    );
  }, [categories]);

  // useEffect(() => {
  //   if (category === "-1" || category === "") {
  //     setIsSelectError(true);
  //   } else {
  //     setIsSelectError(false);
  //   }
  // }, [category]);

  useEffect(() => {
    setSearchedTickets([...searchObjects([...tickets], searchTerm)]);
  }, [searchTerm]);

  return (
    <>
      <Box p={2}>
        {/* <Box mb={5} as={Flex} justifyContent={"space-between"}>
          <Text color={"text.primary"} fontSize={"3xl"}>
            Tickets
          </Text>
        </Box> */}
        <FunctionalModalV2
          closeBtn={
            <>
              <IconButton
                cursor={"pointer"}
                as={BiX}
                size={"sm"}
                fontSize={"xs"}
                rounded={"full"}
                color={"primary.100"}
                bg={"primary.60"}
                onClick={() => {
                  onClose();
                  reset();
                }}
                boxShadow={
                  theme.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              />
            </>
          }
          isOpen={isOpen}
          modalTitle={"Create Ticket"}
          modalMinH={"100%"}
          footer={false}
          modalMinW={"70%"}
        >
          <form
            onSubmit={handleSubmit(createTicketCall)}
            style={{ width: "100%" }}
          >
            {TicketForm()}
          </form>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              color={"text.primary"}
              bg={"primary.60"}
              type={"submit"}
              isLoading={isSubmitting}
              isDisabled={!isDirty || !isValid || isSelectError}
              onClick={createTicketCall}
            >
              Create ticket
            </Button>
          </Box>
        </FunctionalModalV2>

        {!loadingTickets ? (
          <Tabs
            colorScheme={"tag"}
            isFitted
            variant="unstyled"
            alignItems={"center"}
          >
            <Box
              ml={5}
              mr={5}
              mb={5}
              as={Flex}
              gap={2}
              justifyContent={"space-between"}
              display={"flex"}
              flexWrap={"wrap"}
              alignItems={"center"}
            >
              <TabList
                minW={"40%"}
                borderRadius={"10px"}
                overflow={"hidden"}
                w={"fit-content"}
                bg={"primary.80"}
                boxShadow={
                  theme.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                <Tab
                  _selected={{
                    color: "text.primary",
                    bg: "primary.60",
                    fontWeight: "bold",
                  }}
                  color={"text.primary"}
                  w={"50%"}
                >
                  Unassigned
                  {tickets &&
                  [...tickets].filter((ticket) => !ticket.assigned_to.Valid)
                    .length > 0 ? (
                    <Tag
                      ml={1}
                      justifyContent={"center"}
                      rounded={"full"}
                      color={"text.primary"}
                      bg={"danger.100"}
                      size={"sm"}
                      mb={3}
                    >
                      {
                        [...tickets].filter(
                          (ticket) => !ticket.assigned_to.Valid
                        ).length
                      }
                    </Tag>
                  ) : null}
                </Tab>
                <Tab
                  _selected={{
                    color: "text.primary",
                    bg: "primary.60",
                    fontWeight: "bold",
                  }}
                  color={"text.primary"}
                  w={"50%"}
                >
                  Assigned
                </Tab>
              </TabList>

              <Box
                w={"fit-content"}
                flexDirection={"row"}
                display={"flex"}
                flexWrap={"wrap"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={2}
              >
                <ButtonGroup>
                  {hasPermission(PERMISSIONS.TICKET_EDIT) ? (
                    <Button
                      boxShadow={
                        theme.darkMode
                          ? "5px 10px 15px 1px rgba(0,0,0,1)"
                          : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                      }
                      leftIcon={<FiFilter />}
                      //   h={"50px"}
                      color={"text.primary"}
                      bg={"primary.80"}
                      onClick={filtersCollapse.onToggle}
                    >
                      Filter
                    </Button>
                  ) : null}
                  <Button
                    // h={"50px"}
                    boxShadow={
                      theme.darkMode
                        ? "5px 10px 15px 1px rgba(0,0,0,1)"
                        : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                    }
                    color={"text.primary"}
                    bg={"primary.60"}
                    onClick={onOpen}
                  >
                    New Ticket
                  </Button>
                </ButtonGroup>
                <InputGroup
                  h={"40px"}
                  w={"fit-content"}
                  borderColor={"primary.60"}
                  bg={"primary.80"}
                  borderRadius={"20px"}
                  //w={"30%"}
                  color={"text.primary"}
                  boxShadow={
                    theme.darkMode
                      ? "2px 4px 10px 1px rgba(0,0,0,0.6)"
                      : "2px 4px 10px 1px rgba(0,0,0,0.2)"
                  }
                >
                  <InputLeftElement h={"100%"} pointerEvents="none">
                    <Icon as={FiSearch} boxSize={"60%"} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    h={"100%"}
                    placeholder="Search Tickets"
                    variant={"outline"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>
            </Box>
            {FiltersForm()}
            <TabPanels>
              <TabPanel>
                <Box
                  mt={2}
                  as={Flex}
                  gap={2}
                  flexWrap={"wrap"}
                  width={"100%"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {searchedTickets &&
                  [...searchedTickets].filter(
                    (ticket) => !ticket.assigned_to.Valid
                  ).length > 0 ? (
                    [...searchedTickets]
                      .filter((ticket) => !ticket.assigned_to.Valid)
                      .map((ticket) => {
                        return (
                          <Box w={isNonMobile ? "40%" : "90%"}>
                            <Ticket
                              onclose={() => onClose()}
                              fetchTickets={() => fetchTickets(1, pageSize)}
                              redirectToTicket={() =>
                                redirectToTicketCall(ticket.ticket_id)
                              }
                              ticket={ticket}
                            />
                          </Box>
                        );
                      })
                  ) : (
                    <Box
                      minH={"450px"}
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
                        There are no tickets to display.
                      </Heading>
                    </Box>
                  )}
                </Box>
                {searchedTickets &&
                  [...searchedTickets].filter(
                    (ticket) => !ticket.assigned_to.Valid
                  ).length > 0 && (
                    <Box as={Flex} w={"100%"} mt={3} justifyContent={"center"}>
                      <Button
                        isDisabled={pageNumber >= maxPageNum}
                        size={"md"}
                        color={"text.primary"}
                        bg={"primary.60"}
                        onClick={() =>
                          fetchTicketsNewPage(pageNumber + 1, pageSize)
                        }
                      >
                        show more
                      </Button>
                    </Box>
                  )}
              </TabPanel>
              <TabPanel>
                <Box mt={2} as={Flex} gap={2} flexWrap={"wrap"}>
                  {searchedTickets &&
                  [...searchedTickets].filter(
                    (ticket) => ticket.assigned_to.Valid
                  ).length > 0 ? (
                    [...searchedTickets]
                      .filter((ticket) => ticket.assigned_to.Valid)
                      .map((ticket) => {
                        return (
                          <Box w={isNonMobile ? "40%" : "90%"}>
                            <Ticket
                              onclose={() => onClose()}
                              fetchTickets={() => fetchTickets(1, pageSize)}
                              redirectToTicket={() =>
                                redirectToTicketCall(ticket.ticket_id)
                              }
                              ticket={ticket}
                            />
                          </Box>
                        );
                      })
                  ) : (
                    <Box
                      h={"70vh"}
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
                        There are no tickets to display.
                      </Heading>
                    </Box>
                  )}
                </Box>
                {searchedTickets &&
                  [...searchedTickets].filter(
                    (ticket) => ticket.assigned_to.Valid
                  ).length > 0 && (
                    <Box as={Flex} w={"100%"} mt={3} justifyContent={"center"}>
                      <Button
                        isDisabled={pageNumber >= maxPageNum}
                        size={"md"}
                        color={"text.primary"}
                        bg={"primary.60"}
                        onClick={() =>
                          fetchTicketsNewPage(pageNumber + 1, pageSize)
                        }
                      >
                        show more
                      </Button>
                    </Box>
                  )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Center minH={"200px"} h={"70vh"}>
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
          </Center>
        )}
      </Box>
    </>
  );
}

export default Ticketing;
