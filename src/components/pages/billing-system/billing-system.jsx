import {
  Icon,
  RepeatIcon,
  AddIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  IconButton,
  Spinner,
  useDisclosure,
  Button,
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { BiFilter, BiX, BiDollar } from "react-icons/bi";
import StyledSelect from "../../ui/styled-select/styled-select";
import {
  default as React,
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { FcDatabase } from "react-icons/fc";
import {
  getBatches,
  getBundles,
  addBatch,
  addBundle,
  deleteBundle,
  getCustomerCharges,
  getPaymentLogs,
  getOrders,
} from "../../../api/billing-system";
import {
  extractHeaders,
  extractHeadersDefault,
} from "../../../helpers/array-map";
import { getUserInfo } from "../../../api/user";
import FunctionalModalV2 from "../../ui/functional-modal-v2/functional-modal-v2";
import TableV2 from "../../ui/table-v2/table-v2";
import { ThemeContext } from "../../../context/theme";
import CreateOrEditBatch from "./create-edit-batch/create-edit-batch";
import { showsuccess, showerror } from "../../../helpers/toast-emitter";
import AssignBundle from "./assign-bundle/assign-bundle";
import ComplexTable from "../../ui/table/complex-table";

export function CreateBundle({ fetchBundles }) {
  const themeCtx = useContext(ThemeContext);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isDescriptionError, setIsDescriptionError] = useState(true);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [isPriceError, setIsPriceError] = useState(true);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (description === "") {
      setIsDescriptionError(true);
      setDescriptionError("Description is required.");
    } else if (description.length <= 3) {
      setIsDescriptionError(true);
      setDescriptionError("must be at least 4 characters.");
    } else {
      setIsDescriptionError(false);
    }
  }, [description]);

  useEffect(() => {
    if (price === "") {
      setIsPriceError(true);
      setPriceError("Price is required.");
    } else if (parseInt(price) < 0) {
      setIsPriceError(true);
      setPriceError("must be at more then 0.");
    } else {
      setIsPriceError(false);
    }
  }, [price]);

  const createBundle = () => {
    let bundleDetails = {
      description: description,
      mrc: parseInt(price),
    };
    addBundle(bundleDetails)
      .then(() => {
        onClose();
        fetchBundles();
        showsuccess("Created Successfully");
        setPrice("");
        setIsPriceFocused(false);
        setDescription("");
        setIsDescriptionFocused(false);
      })
      .catch((e) => showerror(e.message));
  };
  return (
    <Box>
      <IconButton
        cursor={"pointer"}
        width={70}
        height={70}
        rounded={"full"}
        bg={"primary.60"}
        onClick={onOpen}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <AddIcon
          w={30}
          h={30}
          color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
        />
      </IconButton>
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
            onClick={() => {
              onClose();
              setPrice("");
              setIsPriceFocused(false);
              setDescription("");
              setIsDescriptionFocused(false);
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
        isOpen={isOpen}
        modalTitle={"Create Bundle"}
        modalMinH={"550px"}
        modalMinW={"50%"}
        transparent
        btnAction={
          <Button
            bg={"primary.80"}
            color={"text.primary"}
            width={120}
            _hover={{ bg: "primary.60" }}
            onClick={createBundle}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            Create
          </Button>
        }
      >
        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
            Description
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <FormControl isInvalid={isDescriptionError && isDescriptionFocused}>
              <Input
                type="text"
                bg={"primary.80"}
                color={"text.primary"}
                borderRadius={0}
                border={0}
                height={45}
                w={"100%"}
                onBlur={() => setIsDescriptionFocused(true)}
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
                placeholder="Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              {isDescriptionError && isDescriptionFocused ? (
                <FormErrorMessage
                  fontWeight={"bold"}
                  alignItems={"flex-start"}
                  pt={2}
                  marginTop={0}
                  minH={10}
                >
                  {descriptionError}
                </FormErrorMessage>
              ) : (
                <Box minH={10}></Box>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box w={"100%"} gap={5} as={Flex} alignItems={"center"} mt={2}>
          <Text fontWeight={"bold"} color={"text.primary"} mb={10} w={"30%"}>
            Price
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <FormControl isInvalid={isPriceError && isPriceFocused}>
              <Input
                type="number"
                bg={"primary.80"}
                color={"text.primary"}
                borderRadius={0}
                border={0}
                height={45}
                w={"100%"}
                onBlur={() => setIsPriceFocused(true)}
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
                placeholder="Price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                min={0}
              />
              {isPriceError && isPriceFocused ? (
                <FormErrorMessage
                  fontWeight={"bold"}
                  alignItems={"flex-start"}
                  pt={2}
                  marginTop={0}
                  minH={10}
                >
                  {priceError}
                </FormErrorMessage>
              ) : (
                <Box minH={10}></Box>
              )}
            </FormControl>
          </Box>
        </Box>
      </FunctionalModalV2>
    </Box>
  );
}

export function DeleteBundle({ fetchBundles, bundle_id }) {
  const themeCtx = useContext(ThemeContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        cursor={"pointer"}
        size={"sm"}
        rounded={"full"}
        bg={"primary.60"}
        onClick={onOpen}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <DeleteIcon color={themeCtx.darkMode ? "#000000" : "#FFFFFF"} />
      </IconButton>
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
            onClick={() => {
              onClose();
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
        isOpen={isOpen}
        transparent
        modalTitle={`Delete bundle ${bundle_id}`}
        modalMinH={"200px"}
        modalMinW={"50%"}
        btnAction={
          <Button
            w={"fit-content"}
            backgroundColor={"primary.80"}
            boxShadow={
              themeCtx.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 5px 7px 1px rgba(0,0,0,0.2)"
            }
            color={"danger.100"}
            _hover={{ color: "primary.100", bg: "primary.60" }}
            onClick={() => {
              deleteBundle(bundle_id).then(() => {
                showsuccess("Successfully deleted");
                onClose();
                fetchBundles();
              });
            }}
          >
            Delete bundle {bundle_id}
          </Button>
        }
      >
        <Text
          color={"text.primary"}
          textAlign={"center"}
          fontWeight={"bold"}
          py={20}
        >
          Are you sure you want to delete bundle {bundle_id}?
        </Text>
      </FunctionalModalV2>
    </>
  );
}

export function FilterModal({
  name,
  filterFunc,
  customers,
  numberPerPage,
  setFilter,
  customerNameFiltered,
}) {
  const themeCtx = useContext(ThemeContext);
  const [customerName, setCustomerName] = useState(customerNameFiltered);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        cursor={"pointer"}
        size={"sm"}
        as={BiFilter}
        rounded={"full"}
        color={"primary.100"}
        bg={"primary.60"}
        onClick={onOpen}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      />
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
            onClick={() => {
              setCustomerName(-1);
              onClose();
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
        isOpen={isOpen}
        transparent
        modalTitle={`Filter ${name}`}
        modalMinH={"200px"}
        modalMinW={"50%"}
        btnAction={
          <Button
            w={"fit-content"}
            backgroundColor={"primary.80"}
            boxShadow={
              themeCtx.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 5px 7px 1px rgba(0,0,0,0.2)"
            }
            color={"text.primary"}
            _hover={{ color: "primary.100", bg: "primary.60" }}
            isDisabled={customerName === -1}
            onClick={() => {
              setFilter(customerName),
                filterFunc(0, numberPerPage, customerName),
                onClose();
            }}
          >
            Filter
          </Button>
        }
        btnReset={
          <Button
            w={"fit-content"}
            backgroundColor={"primary.80"}
            boxShadow={
              themeCtx.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 5px 7px 1px rgba(0,0,0,0.2)"
            }
            color={"text.warning"}
            _hover={{ color: "primary.100", bg: "primary.60" }}
            isDisabled={customerName === -1}
            onClick={() => {
              setCustomerName(-1),
                setFilter(""),
                filterFunc(0, numberPerPage, "", true),
                onClose();
            }}
          >
            Reset
          </Button>
        }
      >
        <Box
          w={"100%"}
          gap={5}
          as={Flex}
          alignItems={"center"}
          mt={2}
          pt={5}
          pb={7}
        >
          <Text fontWeight={"bold"} color={"text.primary"} w={"30%"}>
            Customer Name
          </Text>
          <Box
            as={Flex}
            w={"70%"}
            alignItems={"flex-start"}
            flexDirection={"column"}
          >
            <Box w={"100%"}>
              <StyledSelect
                value={customerName}
                onchange={setCustomerName}
                required={true}
                general={true}
                options={customers.map((customer) => {
                  return { label: customer.customer, value: customer.customer };
                })}
              />
            </Box>
          </Box>
        </Box>
      </FunctionalModalV2>
    </>
  );
}

function Billing() {
  const [bundles, setBundles] = useState(undefined);
  const [charges, setCharges] = useState(undefined);
  const [chargesTablePage, setChargesTablePage] = useState(0);
  const [orders, setOrders] = useState(undefined);
  const [ordersTablePage, setOrdersTablePage] = useState(0);
  const [batches, setBatches] = useState({
    data: undefined,
    numberOfPages: 0,
    pageNum: 0,
    numberPerPage: 5,
  });
  const [paymentLogs, setPaymentLogs] = useState({
    data: undefined,
    numberOfPages: 0,
    pageNum: 0,
    numberPerPage: 5,
  });
  const pageNumberPaymentLogs = useRef(0);
  const numberPerPageRefPaymentLogs = useRef(5);
  const [paymentLogsLoading, setPaymentLogsLoading] = useState(true);
  const [createFormValid, setCreateFormValid] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [arrowLeft, setArrowLeft] = useState(false);
  const [arrowRight, setArrowRight] = useState(false);
  const pageNumber = useRef(0);
  const numberPerPageRef = useRef(5);
  const themeCtx = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState(-1);
  const [devicesNumber, setDevicesNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");
  const [customerFromCharges, setCustomerFromCharges] = useState([]);
  const user = getUserInfo();
  const admin = user.cypod_admin;
  const [customerNameFilter, setCustomerNameFilter] = useState(
    admin ? -1 : user.customer
  );
  const [customerNameFilterPayments, setCustomerNameFilterPayments] = useState(
    admin ? -1 : user.customer
  );
  const refBundles = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchBundles();
    fetchCustomerCharges();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [bundles]);

  useEffect(() => {
    let query = { page_id: 1, page_size: 5 };
    if (customerNameFilter !== -1) {
      query.costumer_name = customerNameFilter;
    }
    getBatches(query)
      .then((b) => {
        if (admin) {
          for (let i = 0; i < b.data.batches.length; i++) {
            b.data.batches[i].Edit = { value: b.data.batches[i] };
            b.data.batches[i].Delete = { value: b.data.batches[i] };
            b.data.batches[i].Delete.callBack = update;
            b.data.batches[i].Edit.callBack = update;
          }
        }
        setBatchesLoading(false);
        setBatches({
          ...batches,
          data: b.data.batches,
          numberOfPages: b.data.pages,
        });
      })
      .catch((e) => showerror(e.message));
  }, []);

  useEffect(() => {
    let query = { page_id: 1, page_size: 5 };
    if (customerNameFilterPayments !== -1) {
      query.costumer_name = customerNameFilterPayments;
    }
    getPaymentLogs(query)
      .then((b) => {
        if (admin) {
          for (let i = 0; i < b.data.payments.length; i++) {
            b.data.payments[i].edit_payment = { value: b.data.payments[i] };
            b.data.payments[i].edit_payment.callBack = update_payment_logs;
          }
        }
        setPaymentLogsLoading(false);
        setPaymentLogs({
          ...paymentLogs,
          data: b.data.payments,
          numberOfPages: b.data.pages,
        });
      })
      .catch((e) => showerror(e.message));
  }, []);

  useEffect(() => {
    setArrowRight(
      !(
        Math.ceil(refBundles.current.scrollLeft + refBundles.current.clientWidth) >=
        refBundles.current.scrollWidth
      )
    );
    setArrowLeft(refBundles.current.scrollLeft > 0);
  }, [bundles]);

  const fetchBundles = () => {
    getBundles()
      .then((bundles) => {
        setBundles(bundles.data);
      })
      .catch((e) => showerror(e.message));
  };

  const fetchCustomerCharges = () => {
    getCustomerCharges(admin ? null : customerNameFilter)
      .then((charges) => {
        setCharges(charges.data);
        let custmors = [];
        charges.data.map((charge) => {
          custmors.push({ label: charge.customer, value: charge.id });
        });
        setCustomerFromCharges(custmors);
      })
      .catch((e) => showerror(e.message));
  };

  const fetchOrders = () => {
    if (bundles) {
      getOrders()
        .then((orders) => {
          const options = [];
          if (admin) {
            for (let i = 0; i < bundles.length; i++) {
              options.push({
                label: bundles[i].bundle_id.toString(),
                value: bundles[i].bundle_id.toString(),
              });
            }
          }
          if (admin) {
            for (let i = 0; i < orders.data.length; i++) {
              orders.data[i].edit_order = { value: orders.data[i] };
              orders.data[i].edit_order.callBack = fetchOrders;
              orders.data[i].bundles = options;
            }
          }
          setOrders(orders.data);
        })
        .catch((e) => showerror(e.message));
    }
  };

  const update = () => {
    getBatchesPagination(pageNumber.current, batches.numberPerPage);
  };

  const update_payment_logs = () => {
    getPaymentLogsPagination(pageNumber.current, batches.numberPerPage);
  };

  const createBatch = () => {
    let batchDetails = {
      activation_status: status,
      customer_name: customerName,
      delivery_date: new Date(deliveryDate).toISOString(),
      name: name,
      no_of_devices: parseInt(devicesNumber),
      warranty_end: new Date(warrantyDate).toISOString(),
    };
    addBatch(batchDetails)
      .then(() => {
        showsuccess("Create Successfully");
        onClose(),
          setName(""),
          setCustomerName(""),
          setStatus(-1),
          setDevicesNumber(""),
          setDeliveryDate(""),
          setWarrantyDate("");
        getBatchesPagination(batches.pageNum, batches.numberPerPage);
      })
      .catch((e) => showerror(e.message));
  };

  const getBatchesPagination = (
    pageNum,
    numberPerPage,
    customer_name,
    reset
  ) => {
    setBatchesLoading(true);
    pageNumber.current = pageNum;
    numberPerPageRef.current = numberPerPage;
    let query = { page_id: pageNum + 1, page_size: numberPerPage };
    if (!reset) {
      if (customer_name) {
        query.costumer_name = customer_name;
      } else {
        if (customerNameFilter !== -1) {
          query.costumer_name = customerNameFilter;
        }
      }
    }
    getBatches(query)
      .then((res) => {
        if (res.data.batches.length === 0 && pageNum > 0) {
          getBatchesPagination(
            pageNum - 1,
            numberPerPage,
            customer_name ? customer_name : customerNameFilter,
            reset
          );
        } else {
          setBatchesLoading(false);
          if (admin) {
            for (let i = 0; i < res.data.batches.length; i++) {
              res.data.batches[i].Edit = { value: res.data.batches[i] };
              res.data.batches[i].Delete = { value: res.data.batches[i] };
              res.data.batches[i].Delete.callBack = update;
              res.data.batches[i].Edit.callBack = update;
            }
          }
          setBatches({
            data: res.data.batches,
            numberOfPages: res.data.pages,
            pageNum: pageNum,
            numberPerPage: numberPerPage,
          });
        }
      })
      .catch(() => {
        setBatchesLoading(false);
      });
  };

  const getPaymentLogsPagination = (
    pageNum,
    numberPerPage,
    customer_name,
    reset
  ) => {
    setPaymentLogsLoading(true);
    pageNumberPaymentLogs.current = pageNum;
    numberPerPageRefPaymentLogs.current = numberPerPage;
    let query = { page_id: pageNum + 1, page_size: numberPerPage };
    if (!reset) {
      if (customer_name) {
        query.costumer_name = customer_name;
      } else {
        if (customerNameFilterPayments !== -1) {
          query.costumer_name = customerNameFilterPayments;
        }
      }
    }
    getPaymentLogs(query)
      .then((res) => {
        if (admin) {
          for (let i = 0; i < res.data.payments.length; i++) {
            res.data.payments[i].edit_payment = { value: res.data.payments[i] };
            res.data.payments[i].edit_payment.callBack = update_payment_logs;
          }
        }
        if (res.data.payments.length === 0 && pageNum > 0) {
          getPaymentLogsPagination(pageNum - 1, numberPerPage);
        } else {
          setPaymentLogsLoading(false);
          setPaymentLogs({
            data: res.data.payments,
            numberOfPages: res.data.pages,
            pageNum: pageNum,
            numberPerPage: numberPerPage,
          });
        }
      })
      .catch((e) => {
        setPaymentLogsLoading(false);
        showerror(e.message);
      });
  };

  const handleClickToScrollRight = (refto) => {
    refto.current.scrollLeft += 100;
  };

  const handleClickToScrollLeft = (refto) => {
    refto.current.scrollLeft -= 100;
  };

  const handleBundlesScroll = (refto) => {
    setArrowRight(
      !(
        Math.ceil(refto.current.scrollLeft + refto.current.clientWidth) >=
        refto.current.scrollWidth
      )
    );
    setArrowLeft(refto.current.scrollLeft > 0);
  };

  return (
    <>
      <Box
        ref={refBundles}
        onScroll={() => {
          handleBundlesScroll(refBundles);
        }}
        overflowX={"scroll"}
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "scroll-behavior": "smooth",
        }}
        mt={-5}
        pt={5}
        pb={5}
        display={"flex"}
        flexDir={"row"}
        pl={1}
        pr={2}
        ml={5}
        mr={5}
        gap={4}
        bg={"transparent"}
      >
        <IconButton
          cursor={"pointer"}
          width={45}
          left={2.5}
          display={arrowLeft ? "flex" : "none"}
          top={refBundles.current && refBundles.current.clientHeight / 2 + 35}
          position={"absolute"}
          zIndex={1}
          height={45}
          rounded={"full"}
          bg={"primary.60"}
          onClick={() => handleClickToScrollLeft(refBundles)}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <ChevronLeftIcon
            w={8}
            h={8}
            color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
          />
        </IconButton>
        <IconButton
          cursor={"pointer"}
          width={45}
          right={2.5}
          display={arrowRight ? "flex" : "none"}
          top={refBundles.current && refBundles.current.clientHeight / 2 + 35}
          position={"absolute"}
          zIndex={1}
          height={45}
          rounded={"full"}
          bg={"primary.60"}
          onClick={() => handleClickToScrollRight(refBundles)}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <ChevronRightIcon
            w={8}
            h={8}
            color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
          />
        </IconButton>
        {admin && <Card
          minW="xxs"
          maxW="sm"
          bg={"transparent"}
          borderWidth={2}
          borderColor={"action.100"}
          borderStyle={"dashed"}
          borderRadius={10}
          minH={admin ? 255 : 200}
          boxShadow={
            themeCtx.darkMode
              ? "2px 2px 7px 1px rgba(0,0,0,0.6)"
              : "2px 2px 7px 1px rgba(0,0,0,0.2)"
          }
        >
          <CardBody
            minW={200}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <CreateBundle fetchBundles={fetchBundles} />
          </CardBody>
        </Card>}
        {bundles &&
          bundles.map((bundle) => {
            return (
              <Card
                minW="xs"
                maxW="sm"
                bg={"primary.80"}
                borderRadius={10}
                boxShadow={
                  themeCtx.darkMode
                    ? "2px 2px 7px 1px rgba(0,0,0,0.6)"
                    : "2px 2px 7px 1px rgba(0,0,0,0.2)"
                }
              >
                <CardBody>
                  <Stack mt="6" spacing="3" mb={admin ? 0 : 4}>
                    <Heading color={"text.primary"} size="md">
                      <span>Bundle Id: </span>
                      {bundle.bundle_id}
                    </Heading>
                    <Text color={"text.primary"}>{bundle.description}</Text>
                    <Text color="action.100" fontSize="2xl">
                      ${bundle.mrc}
                    </Text>
                  </Stack>
                </CardBody>
                {admin && <Divider color="primary.60" />}
                <CardFooter
                  width={"100%"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  display={admin ? "flex" : "none"}
                >
                  <AssignBundle
                    customers={customerFromCharges}
                    bundle={bundle}
                    callBack={fetchBundles}
                  />
                  <DeleteBundle
                    fetchBundles={fetchBundles}
                    bundle_id={bundle.bundle_id}
                  />
                </CardFooter>
              </Card>
            );
          })}
      </Box>
      {!admin && (
        <Box
          ml={5}
          mr={5}
          mb={5}
          display={"flex"}
          alignItems={"center"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          boxShadow={
            themeCtx.darkMode
              ? "2px 2px 7px 1px rgba(0,0,0,0.6)"
              : "2px 2px 7px 1px rgba(0,0,0,0.2)"
          }
          borderRadius={10}
          bg={"primary.80"}
        >
          <Box display={"flex"} pl={3} alignItems={"center"} flexDir={"row"}>
            <Icon as={BiDollar} boxSize={"30px"} color={"primary.60"} />

            <Heading
              minW={"300px"}
              pt={5}
              pb={5}
              pl={2}
              color={"text.primary"}
              size={"md"}
            >
              Charges
            </Heading>
          </Box>
          <Box
            pl={45}
            display={"flex"}
            pr={3}
            gap={10}
            alignItems={"center"}
            flexDir={"row"}
          >
            <Text
              pt={5}
              pb={5}
              pl={2}
              fontSize={17}
              color={"text.primary"}
              fontWeight={"bold"}
            >
              Paid:{" "}
              <span
                style={{
                  color:
                    themeCtx.theme.colors && themeCtx.theme.colors.text.success,
                }}
              >
                {" "}
                {charges && charges[0]
                  ? charges && charges[0].paid + " $"
                  : "N/A"}{" "}
              </span>
            </Text>
            <Text
              pt={5}
              pb={5}
              pl={2}
              fontSize={17}
              color={"text.primary"}
              fontWeight={"bold"}
            >
              Due:{" "}
              <span
                style={{
                  color:
                    themeCtx.theme.colors && themeCtx.theme.colors.danger[100],
                }}
              >
                {" "}
                {charges && charges[0]
                  ? charges && charges[0].due + " $"
                  : "N/A"}{" "}
              </span>
            </Text>
          </Box>
        </Box>
      )}
      <Box ml={5} mr={5} mb={5}>
        <TableV2
          title={"Batches"}
          height={"305"}
          minWidth={"90px"}
          icon={<Icon as={FcDatabase} boxSize={"40px"} color={"action.100"} />}
          fetchData={getBatchesPagination}
          data={
            batches.data === undefined
              ? {
                  ...batches,
                  data: [],
                }
              : batches
          }
          extractFn={extractHeaders}
          hiddenCols={["id", "device"]}
          defaultPageSize={25}
          firstCol={"name"}
          loading={batchesLoading}
        >
          <Box gap={2} as={Flex} justifyContent={"flex-end"}>
            <Box display={admin ? "flex" : "none"}>
              <IconButton
                cursor={"pointer"}
                size={"sm"}
                rounded={"full"}
                bg={"primary.60"}
                onClick={onOpen}
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                <AddIcon color={themeCtx.darkMode ? "#000000" : "#FFFFFF"} />
              </IconButton>
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
                    onClick={() => {
                      onClose(),
                        setName(""),
                        setCustomerName(""),
                        setStatus(-1),
                        setDevicesNumber(""),
                        setDeliveryDate(""),
                        setWarrantyDate("");
                    }}
                    boxShadow={
                      themeCtx.darkMode
                        ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                        : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                    }
                  />
                }
                isOpen={isOpen}
                modalTitle={"Create Batch"}
                modalMinH={"550px"}
                modalMinW={"50%"}
                transparent
                btnAction={
                  <Button
                    bg={"primary.80"}
                    color={"text.warning"}
                    width={120}
                    _hover={{ bg: "primary.60" }}
                    onClick={createBatch}
                    isDisabled={!createFormValid}
                    boxShadow={
                      themeCtx.darkMode
                        ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                        : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                    }
                  >
                    Create
                  </Button>
                }
              >
                <CreateOrEditBatch
                  setValid={setCreateFormValid}
                  name={name}
                  setName={setName}
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  status={status}
                  setStatus={setStatus}
                  devicesNumber={devicesNumber}
                  setDevicesNumber={setDevicesNumber}
                  deliveryDate={deliveryDate}
                  setDeliveryDate={setDeliveryDate}
                  warrantyDate={warrantyDate}
                  setWarrantyDate={setWarrantyDate}
                />
              </FunctionalModalV2>
            </Box>
            {admin && (
              <FilterModal
                name={"Batches"}
                filterFunc={getBatchesPagination}
                numberPerPage={batches.numberPerPage}
                customers={charges ? charges : []}
                setFilter={setCustomerNameFilter}
                customerNameFiltered={customerNameFilter}
              />
            )}
            <Box
              as={Flex}
              flexWrap={"wrap"}
              gap={1}
              justifyContent={"end"}
              alignContent={"flex-start"}
            >
              <IconButton
                size={"sm"}
                rounded={"full"}
                bg={"primary.60"}
                onClick={() =>
                  getBatchesPagination(batches.pageNum, batches.numberPerPage)
                }
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                {!batchesLoading ? (
                  <RepeatIcon
                    color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
                  />
                ) : (
                  <Center minH={"250px"} w={"100%"}>
                    <Spinner
                      thickness="2px"
                      speed="0.85s"
                      emptyColor="text.primary"
                      color="primary.60"
                      size="xs"
                    />
                  </Center>
                )}
              </IconButton>
            </Box>
          </Box>
        </TableV2>
      </Box>
      <Box display={admin ? "flex" : "none"} mt={1} w={"100%"} pl={5} pr={5}>
        <ComplexTable
          pageNumber={chargesTablePage}
          setPageNumber={setChargesTablePage}
          extractFn={extractHeadersDefault}
          loading={charges === undefined}
          data={charges === undefined ? [] : charges}
          hiddenCols={[]}
          title={"Charges"}
          height={320}
          icon={<Icon as={FcDatabase} boxSize={"40px"} color={"action.100"} />}
        >
          <Box />
        </ComplexTable>
      </Box>

      <Box display={admin ? "flex" : "none"} mt={1} w={"100%"} pl={5} pr={5}>
        <ComplexTable
          pageNumber={ordersTablePage}
          setPageNumber={setOrdersTablePage}
          extractFn={extractHeadersDefault}
          loading={orders === undefined}
          data={orders === undefined ? [] : orders}
          hiddenCols={["bundles"]}
          title={"Orders"}
          height={320}
          icon={<Icon as={FcDatabase} boxSize={"40px"} color={"action.100"} />}
        >
          <Box />
        </ComplexTable>
      </Box>
      <Box ml={5} mr={5} mb={5}>
        <TableV2
          title={"Payment Logs"}
          height={"305"}
          minWidth={"90px"}
          icon={<Icon as={FcDatabase} boxSize={"40px"} color={"action.100"} />}
          fetchData={getBatchesPagination}
          data={
            paymentLogs.data === undefined
              ? {
                  ...paymentLogs,
                  data: [],
                }
              : paymentLogs
          }
          extractFn={extractHeaders}
          defaultPageSize={25}
          hiddenCols={[]}
          firstCol={"id"}
          loading={paymentLogsLoading}
        >
          <Box gap={2} as={Flex} justifyContent={"flex-end"}>
            <Box
              as={Flex}
              flexWrap={"wrap"}
              gap={1}
              justifyContent={"end"}
              alignContent={"flex-start"}
            >
              {" "}
              {admin && (
                <FilterModal
                  name={"Payment Logs"}
                  filterFunc={getPaymentLogsPagination}
                  numberPerPage={paymentLogs.numberPerPage}
                  customers={charges ? charges : []}
                  setFilter={setCustomerNameFilterPayments}
                  customerNameFiltered={customerNameFilterPayments}
                />
              )}
              <IconButton
                size={"sm"}
                rounded={"full"}
                bg={"primary.60"}
                onClick={() =>
                  getPaymentLogsPagination(
                    paymentLogs.pageNum,
                    paymentLogs.numberPerPage
                  )
                }
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                {!paymentLogsLoading ? (
                  <RepeatIcon
                    color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
                  />
                ) : (
                  <Center minH={"250px"} w={"100%"}>
                    <Spinner
                      thickness="2px"
                      speed="0.85s"
                      emptyColor="text.primary"
                      color="primary.60"
                      size="xs"
                    />
                  </Center>
                )}
              </IconButton>
            </Box>
          </Box>
        </TableV2>
      </Box>
    </>
  );
}

export default Billing;
