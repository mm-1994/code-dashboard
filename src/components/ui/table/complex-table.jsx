import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  IconButton,
  Text,
  Flex,
  Button,
  Center,
  Heading,
  Tag,
  TagLabel,
  Spinner,
  Image,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { extractHeaders, flattenObject } from "../../../helpers/array-map";
import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from "react-table";
import { useMediaQuery } from "@chakra-ui/react";
import GlobalFilter from "./components/global-filter/global-filter";
import StyledSelect from "../styled-select/styled-select";
import { BsArrowDownUp } from "react-icons/bs";
import { MdClear, MdVerified } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import FunctionalModal from "../functional-modal/functional-modal";
import DeviceForm from "../../pages/device-management/device-form/device-form";
import CyTagIcon from "../icon/cytag-icon";
import empty from "../../../assets/images/logo/no data.png";
import { ThemeContext } from "../../../context/theme";
import "./complex-table.css";

function ComplexTable({
  reverse = false,
  flatten = false,
  extractFn = extractHeaders,
  data,
  icon,
  title,
  redirectToDevice,
  children,
  cytagsBtn,
  minW,
  alarms = false,
  hiddenCols = [],
  deleteBtn,
  editBtn,
  idLabel,
  type,
  id,
  name,
  setId,
  setName,
  setPageNumber,
  pageNumber,
  CreateDevice,
  loading,
  height,
  customPageSize,
  width,
  onClick,
}) {
  const [flatData, setFlatData] = useState(data);
  useEffect(() => {
    if (flatten) {
      setFlatData([...data].map((obj) => flattenObject(obj)));
    }
  }, [data]);

  const columns = React.useMemo(
    () =>
      reverse
        ? [...extractFn(data, hiddenCols).reverse()]
        : [...extractFn(data, hiddenCols)],
    [data]
  );

  hiddenCols = [...hiddenCols, "cycollector_id", "roles"];
  const themeCtx = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: flatten && flatData ? flatData : data,
      manualPagination: false,
      manualSortBy: false,
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetPageIndex: false,
      initialState: {
        pageIndex: pageNumber ? pageNumber : 0,
        pageSize: 5,
        globalFilter: "",
        hiddenColumns: [...hiddenCols, "cycollector_id", "roles"],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  useEffect(() => {
    if (pageNumber != undefined) {
      if (pageIndex) {
        setPageNumber(pageIndex);
      }
    }
  }, [pageIndex]);

  useEffect(() => {
    if (pageNumber != undefined) {
      gotoPage(pageNumber);
    }
  }, [pageNumber]);

  useEffect(() => {
    if (customPageSize) {
      setPageSize(customPageSize);
    }
  }, [customPageSize]);

  const handleAnimationEnd = (row, index, page) => {
    row ? console.log("row.cells= ", row + " - " + index + " - " + page) : "";
    const trElement = document.querySelectorAll(".tableBgcolor");
    trElement.forEach((item) => {
      item.classList.remove("tableBgcolor");
    });
    console.log(
      "===========================================Animation Ended=============================================="
    );
    data
      ? data.map((item) => {
          item["newly"] = false;
        })
      : "";
    setFlatData(data);
  };
  return (
    <>
      <Box
        backgroundColor={"primary.80"}
        borderRadius={"10px"}
        w={"100%"}
        p={2}
        mb={5}
        minW={minW}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <Flex
          px={1}
          justifyContent={"space-between"}
          alignItems={"center"}
          minH={"65px"}
          flexWrap={"wrap"}
          as={Flex}
          flexDir={"row"}
        >
          <Box minW={"fit-content"} gap={2} as={Flex}>
            {icon}
            <Heading
              w={"100%"}
              lineHeight={"normal"}
              color={"text.primary"}
              fontSize={"2xl"}
            >
              {title}
            </Heading>
          </Box>
          {CreateDevice}
          {children ? (
            <Box
              as={Flex}
              justifyContent={"space-between"}
              alignItems={"center"}
              minW={"fit-content"}
              gap={1}
            >
              {children}
              {columns.length !== 0 && (
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  width={"200px"}
                />
              )}
            </Box>
          ) : null}
        </Flex>
        {loading || !data ? (
          <Center
            minH={
              title === "CyLocks" || title === "Cylocks"
                ? "315px"
                : title === "Alarms"
                ? "360px"
                : title === "CyTags" || title === "Cytags"
                ? "310px"
                : title === "Audit Logs"
                ? height
                  ? height
                  : "250px"
                : height
                ? height
                : "432.1px"
            }
            w={"100%"}
          >
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
          </Center>
        ) : columns.length !== 0 ? (
          <>
            <Box
              overflowX={"auto"}
              overflowY={"auto"}
              h={
                title === "CyLocks" || title === "Cylocks"
                  ? "315px"
                  : title === "Alarms"
                  ? "360px"
                  : title === "CyTags" || title === "Cytags"
                  ? "310px"
                  : title === "Audit Logs"
                  ? height
                    ? height
                    : "250px"
                  : title === "Cylocks"
                  ? "350px"
                  : height
                  ? height
                  : "390px"
              }
            >
              <Table
                h={"100%"}
                color={"secondary.100"}
                {...getTableProps()}
                variant={"unstyled"}
              >
                <Thead pos={"sticky"} top={"0"} zIndex={1} overflow={"hidden"}>
                  {headerGroups.map((headerGroup, index) => (
                    <Tr
                      borderStyle={"solid"}
                      borderBottomWidth={1}
                      borderColor={"primary.60"}
                      key={index}
                      color={"primary.60"}
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column, i) => {
                        return column.id === "severity" ? (
                          <Th
                            textAlign={"start"}
                            backgroundColor={"primary.80"}
                            h={"50px"}
                            w={"fit-content"}
                            minW={isNonMobile ? "none" : "100px"}
                            key={i}
                            p={0}
                            {...column.getHeaderProps()}
                          >
                            <Text marginLeft={1} textAlign={"start"}>
                              {column.render("Header")}
                            </Text>
                          </Th>
                        ) : (
                          <Th
                            textAlign={"start"}
                            h={"50px"}
                            w={"fit-content"}
                            minW={
                              isNonMobile
                                ? title === "Scheduled Reports"
                                  ? "200px"
                                  : width
                                  ? width
                                  : "none"
                                : column.id === "cytags" && title === "Cylocks"
                                ? "270px"
                                : "180px"
                            }
                            backgroundColor={"primary.80"}
                            key={i}
                            {...column.getSortByToggleProps()}
                            p={0}
                          >
                            <Flex
                              textAlign={"start"}
                              display={"flex"}
                              alignItems={"center"}
                            >
                              <Text marginLeft={1}>
                                {" "}
                                {column.render("Header")}
                              </Text>
                              <IconButton
                                ml={1}
                                size={"xs"}
                                bg={"transparent"}
                                icon={
                                  column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <IconButton
                                        as={ArrowDownIcon}
                                        size={"50px"}
                                        bg={"transparent"}
                                        color={"text.primary"}
                                      />
                                    ) : (
                                      <IconButton
                                        as={ArrowUpIcon}
                                        size={"50px"}
                                        bg={"transparent"}
                                        color={"text.primary"}
                                      />
                                    )
                                  ) : (
                                    <IconButton
                                      as={BsArrowDownUp}
                                      size={"50px"}
                                      bg={"transparent"}
                                      color={"text.primary"}
                                    />
                                  )
                                }
                              />
                            </Flex>
                          </Th>
                        );
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <Tr
                        onAnimationEnd={(row, index, page) => {
                          handleAnimationEnd(row, index, page);
                        }}
                        h={"50px"}
                        className={
                          row["original"]["newly"] == true ? "tableBgcolor" : ""
                        }
                        cursor={
                          redirectToDevice || onClick ? "pointer" : "default"
                        }
                        borderStyle={"solid"}
                        borderBottomWidth={1}
                        borderColor={"primary.60"}
                        _hover={{
                          backgroundColor: "primary.100",
                          borderColor: "primary.60",
                        }}
                        onClick={() => {
                          if (redirectToDevice) {
                            redirectToDevice(row.cells);
                          }
                          if (onClick) {
                            onClick(row.cells[2].value.geofence.center);
                          }
                        }}
                        key={index}
                        {...row.getRowProps()}
                        width={"100%"}
                      >
                        {row.cells.map((cell, index) => {
                          return (
                            <Td
                              p={1}
                              key={index}
                              {...cell.getCellProps()}
                              w={"fit-content"}
                            >
                              {cell.column.id !== "Acknowledge" &&
                              cell.column.id !== "edit" &&
                              cell.column.id !== "delete" &&
                              cell.column.id !== "Clear" &&
                              cell.column.id !== "severity" &&
                              cell.column.id !== "Geofence_Actions" &&
                              cell.column.id !== "alarm_details" &&
                              cell.column.id !== "Route_Actions" ? (
                                <Box
                                  display={"flex"}
                                  alignItems={"flex-start"}
                                  justifyContent={"flex-start"}
                                  textAlign={"start"}
                                  p={0}
                                  w={"fit-content"}
                                  fontSize={"sm"}
                                  fontWeight={"bold"}
                                  color={"text.primary"}
                                >
                                  {typeof cell.value !== "undefined" &&
                                  cell.value !== null
                                    ? cell.render("Cell")
                                    : "-"}
                                </Box>
                              ) : (
                                <Box
                                  w={"fit-content"}
                                  gap={
                                    cell.column.id !== "Geofence_Actions"
                                      ? 0
                                      : 10
                                  }
                                  pl={
                                    cell.column.id === "Route_Actions" ? 10 : 0
                                  }
                                  display={"flex"}
                                  justifyContent={
                                    cell.column.id === "Route_Actions"
                                      ? "flex-start"
                                      : "space-evenly"
                                  }
                                  textAlign={"start"}
                                  fontSize={"sm"}
                                >
                                  {cell.render("Cell")}
                                </Box>
                              )}
                            </Td>
                          );
                        })}
                        {cytagsBtn && (
                          <Td>
                            {" "}
                            <IconButton
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                cytagsBtn(
                                  row.cells.find(
                                    (col) => col.column.Header === "IMEI"
                                  ).value
                                );
                              }}
                              size={"sm"}
                              bg={"action.100"}
                              icon={
                                <CyTagIcon
                                  boxSize={"30px"}
                                  display={"block"}
                                  margin={"auto"}
                                  p={"15%"}
                                  color={
                                    themeCtx.theme.colors &&
                                    themeCtx.theme.colors.text.primary
                                  }
                                />
                              }
                              rounded={"full"}
                            />{" "}
                          </Td>
                        )}
                        {alarms && (
                          <>
                            <Td as={Flex} gap={2}>
                              <Button
                                size={"sm"}
                                bg={"danger.100"}
                                icon={<MdClear color={"danger.100"} />}
                                rounded={"full"}
                              >
                                Clear{" "}
                              </Button>
                              <Button
                                size={"sm"}
                                bg={"action.100"}
                                icon={<MdVerified color={"danger.100"} />}
                                rounded={"full"}
                              >
                                Acknowledge
                              </Button>
                            </Td>
                          </>
                        )}
                        {deleteBtn && (
                          <Td>
                            <FunctionalModal
                              iconBtn={DeleteIcon}
                              modalMinH={"500px"}
                              btnColor={"danger.100"}
                              modalTitle={`Delete ${type}`}
                              btnAction={
                                <Button
                                  bg={"danger.100"}
                                  color={"text.primary"}
                                  onClick={() => deleteBtn(row.cells[0].value)}
                                >
                                  Delete {type}
                                </Button>
                              }
                            >
                              <Text>
                                Are you sure you want to delete this {type}?
                              </Text>
                              <Tag
                                size="lg"
                                colorScheme="danger"
                                borderRadius="full"
                              >
                                <TagLabel>
                                  {row.cells[1].value} : {row.cells[0].value}
                                </TagLabel>
                              </Tag>
                            </FunctionalModal>
                          </Td>
                        )}
                        {editBtn && (
                          <Td>
                            <FunctionalModal
                              modalMinH={"500px"}
                              iconBtn={AiFillEdit}
                              btnColor={"action.100"}
                              modalTitle={`Edit ${type}`}
                              btnAction={
                                <Button
                                  bg={"primary.100"}
                                  color={"text.primary"}
                                  onClick={editBtn}
                                >
                                  Edit {type}
                                </Button>
                              }
                            >
                              <DeviceForm
                                id={id}
                                name={name}
                                initialId={row.cells[0].value}
                                initialName={row.cells[1].value}
                                idLabel={idLabel}
                                setName={setName}
                                setId={setId}
                              />
                            </FunctionalModal>
                          </Td>
                        )}
                      </Tr>
                    );
                  })}
                  <Box h={"-moz-available"}></Box>
                </Tbody>
              </Table>
            </Box>
            <Flex m={2} flexWrap={"wrap"} justifyContent={"space-between"}>
              <Box as={Flex} gap={2}>
                <IconButton
                  rounded="full"
                  bg={"transparent"}
                  color="secondary.100"
                  icon={<ArrowLeftIcon />}
                  size={"xs"}
                  onClick={() => gotoPage(0)}
                  isDisabled={!canPreviousPage}
                />
                <IconButton
                  rounded="full"
                  bg={"transparent"}
                  color="secondary.100"
                  icon={<ArrowBackIcon />}
                  size={"xs"}
                  onClick={() => previousPage()}
                  isDisabled={!canPreviousPage}
                />
                <IconButton
                  rounded="full"
                  bg={"transparent"}
                  color="secondary.100"
                  icon={<ArrowForwardIcon />}
                  size={"xs"}
                  onClick={() => nextPage()}
                  isDisabled={!canNextPage}
                />
                <IconButton
                  rounded="full"
                  bg={"transparent"}
                  color="secondary.100"
                  icon={<ArrowRightIcon />}
                  size={"xs"}
                  onClick={() => gotoPage(pageCount - 1)}
                  isDisabled={!canNextPage}
                />
              </Box>
              <Box color={"text.primary"}>
                {pageIndex + 1} out of {pageOptions.length}
              </Box>
              <StyledSelect
                size={"xs"}
                options={[
                  { value: 3, label: "3" },
                  { label: "5", value: 5 },
                  { value: 10, label: "10" },
                  { value: 12, label: "12" },
                  { value: 15, label: "15" },
                  { value: 20, label: "20" },
                  { value: 25, label: "25" },
                  { value: 30, label: "30" },
                  { value: 35, label: "35" },
                  { value: 40, label: "40" },
                  { value: 45, label: "45" },
                  { value: 50, label: "50" },
                ]}
                value={pageSize}
                onchange={(res) => setPageSize(parseInt(res))}
              />
            </Flex>
          </>
        ) : (
          <Center
            minH={
              title === "CyLocks" || title === "Cylocks"
                ? "315px"
                : title === "Alarms"
                ? "360px"
                : title === "CyTags" || title === "Cytags"
                ? "310px"
                : title === "Audit Logs"
                ? height
                  ? height
                  : "250px"
                : title === "Cylocks"
                ? "350px"
                : height
                ? height
                : "432.1px"
            }
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Image position={"relative"} src={empty} h={40} mb={5} />
            <Heading
              w={"100%"}
              color={"text.primary"}
              fontWeight={"semibold"}
              fontSize={"xl"}
              textAlign={"center"}
            >
              There is no data to display.
            </Heading>
          </Center>
        )}
      </Box>
    </>
  );
}

export default ComplexTable;
