import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Center,
  Spinner,
  Tag
} from "@chakra-ui/react";
import empty from "../../../assets/images/logo/no data.png";
import StyledSelect from "../styled-select/styled-select";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons";
import { BsArrowDownUp } from "react-icons/bs";
import { ThemeContext } from "../../../context/theme";

const DESC = "desc";
const ASC = "asc";

function TableV2({
  title,
  fetchData,
  data,
  extractFn,
  hiddenCols,
  children,
  icon,
  redirectToDevice,
  firstCol,
  loading,
  label ,
  minWidth,
  height
}) {
  
  const headers = extractFn(data.data).reverse().filter(
    
      (header) => !hiddenCols.find((colName) => colName === header.accessor)
    );
  const [numberPerPage, setNumberPerPage] = useState(data.numberPerPage);
  const [sortedField, setSortedField] = React.useState(null);
  const [sortType, setSortType] = React.useState(null);

  const sortAsc = (x, y) => {
    if (x > y) {
      return 1;
    }
    if (x < y) {
      return -1;
    }
    return 0;
  };
  const sortDesc = (x, y) => {
    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
    return 0;
  };

  const sortRows = (key) => {
    setSortedField(key);
    if (key === sortedField) {
      if (sortType === DESC) {
        setSortType(ASC);
        return data.data.sort(function (a, b) {
          let x = a[key] || 0;
          let y = b[key] || 0;
          return sortAsc(x, y);
        });
      } else {
        setSortType(DESC);
        return data.data.sort(function (a, b) {
          let x = a[key] || 0;
          let y = b[key] || 0;
          return sortDesc(x, y);
        });
      }
    } else {
      setSortedField(key);
      setSortType(DESC);
      return data.data.sort(function (a, b) {
        let x = a[key] || 0;
        let y = b[key] || 0;
        return sortDesc(x, y);
      });
    }
  };
  const themeCtx = useContext(ThemeContext);

  return (
    <Box
      backgroundColor={"primary.80"}
      borderRadius={"10px"}
      w={"100%"}
      p={2}
      mb={5}
      //minH={data.data.length !== 0 ? "425px" : "50px"}
      boxShadow={
        themeCtx.darkMode
          ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
          : "5px 4px 15px 1px rgba(0,0,0,0.2)"
      }
    >
      <Box         flexWrap={"wrap"}
        pr={2}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={2}
        as={Flex}
        my={4}>
        <Box  gap={2} as={Flex} width={'20%'}  minW={"fit-content"} >
          {icon}
          <Heading
            w={"100%"}
            color={"text.primary"}
            display={"flex"}
            alignItems={"center"}
            fontSize={"xl"}
          >
            {title}
          </Heading>
        </Box>
        <Box fontSize={"md"} minW={"fit-content"}  >
          <Tag
            fontSize={"md"}
            minW={"fit-content"}
            p={2}
            color={"text.primary"}
            fontWeight={"semibold"}
            bg={"primary.100"}
            display={label && label.length > 0 ? 'flex' : 'none'}
          >
            {label}
          </Tag>      
        </Box>
        <Box width={'20%'} minW={"fit-content"}>
        {children ? (
          <Box as={Flex} flexWrap={"wrap"} justifyContent={"end"} >
            {children}
          </Box>
        ) : null}
        </Box>
      </Box>
      {data.data.length !== 0 ? (
        <>
          <TableContainer overflowX={"auto"} overflowY={"auto"} h={height ? height : "400px"}>
            <Table h={"auto"} color={"secondary.100"} variant={"unstyled"}>
              <Thead pos={"sticky"} top={"0"} bg={"primary.80"}>
                <Tr >
                  <Th
                    textAlign={"start"}
                    color={"primary.60"}
                    pl={2}
                    h={"10px"}
                    borderStyle={"solid"}
                    borderBottomWidth={1}
                    borderColor={"primary.60"}
                    key={firstCol}
                  >
                    {firstCol && firstCol.toUpperCase().replaceAll("_", " ")}
                    <IconButton
                      onClick={() => sortRows(firstCol)}
                      ml={1}
                      size={"xs"}
                      bg={"transparent"}
                      icon={
                        firstCol === sortedField ? (
                          sortType === DESC ? (
                            <ArrowDownIcon color={"text.primary"} />
                          ) : (
                            <ArrowUpIcon color={"text.primary"} />
                          )
                        ) : (
                          <BsArrowDownUp color={"text.primary"} />
                        )
                      }
                    />
                  </Th>
                  {headers
                    .filter((head) => head.accessor !== firstCol)
                    .map((header) => {
                      return (
                        <Th
                          textAlign={"start"}
                          h={"10px"}
                          pl={2}
                          color={"primary.60"}
                          key={header.accessor}
                          borderStyle={"solid"}
                          borderBottomWidth={1}
                          borderColor={"primary.60"}
                        >
                          {header.Header}
                          <IconButton
                            onClick={() => sortRows(header.accessor)}
                            ml={1}
                            size={"xs"}
                            bg={"transparent"}
                            color={"text.primary"}
                            icon={
                              header.accessor === sortedField ? (
                                sortType === DESC ? (
                                  <ArrowDownIcon />
                                ) : (
                                  <ArrowUpIcon />
                                )
                              ) : (
                                <BsArrowDownUp />
                              )
                            }
                          />
                        </Th>
                      );
                    })}
                </Tr>
              </Thead>
              <Tbody height={"80%"}>
                {data.data.map((row, index) => {
                  return (
                    <Tr
                      h={"8px"}
                      cursor={redirectToDevice ? "pointer" : "default"}
                      borderStyle={"solid"}
                      borderBottomWidth={1}
                      borderColor={"primary.60"}
                      _hover={{
                        backgroundColor: "primary.100",
                        borderColor: "primary.60",
                      }}
                      className={row["newly"]==true?"table-v2-bgcolor":''}
                      onClick={() =>
                        redirectToDevice ? redirectToDevice(row.cells) : null
                      }
                      key={index}
                      width={"100%"}
                    >
                      <Td p={1} minWidth={minWidth ? minWidth : "200px"} key={firstCol}>
                        {firstCol !== "Acknowledge" &&
                        firstCol !== "severity" &&
                        firstCol !== "Geofence_Actions" &&
                        firstCol !== "Route_Actions" ? (
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"flex-start"}
                            textAlign={"start"}
                            p={1}
                            h={"40px"}
                            w={"100%"}
                            fontSize={"sm"}
                            fontWeight={"bold"}
                            color={"text.primary"}
                          >
                            {" "}
                            {typeof row[firstCol] !== "undefined"
                              ? headers
                                  .find(
                                    (header) => header.accessor === firstCol
                                  )
                                  .Cell({ value: row[firstCol] })
                              : "-"}
                          </Box>
                        ) : (
                          <Box
                            p={2}
                            w={"100%"}
                            textAlign={"start"}
                            fontSize={"sm"}
                          >
                            {headers
                              .find((header) => header.accessor === firstCol)
                              .Cell({ value: row[firstCol] })}
                          </Box>
                        )}
                      </Td>
                      {headers
                        .filter((head) => head.accessor !== firstCol)
                        .map((header, index2) => {
                          return (
                            <Td p={1} minWidth={minWidth ? minWidth : "200px"} key={index2}>
                              {header.accessor !== "Acknowledge" &&
                              header.accessor !== "severity" &&
                              header.accessor !== "Geofence_Actions" &&
                              header.accessor !== "Route_Actions" ? (
                                <Box
                                  display={"flex"}
                                  alignItems={"center"}
                                  justifyContent={"flex-start"}
                                  textAlign={"start"}
                                  p={1}
                                  h={"40px"}
                                  w={"100%"}
                                  fontSize={"sm"}
                                  fontWeight={"bold"}
                                  color={"text.primary"}
                                >
                                  {" "}
                                  {typeof row[header.accessor] !== "undefined"
                                    ? header.Cell({
                                        value: row[header.accessor],
                                      })
                                    : "-"}
                                </Box>
                              ) : (
                                <Box
                                  p={2}
                                  w={"100%"}
                                  textAlign={"start"}
                                  fontSize={"sm"}
                                >
                                  {header.Cell({ value: row[header.accessor] })}
                                </Box>
                              )}
                            </Td>
                          );
                        })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex m={2} justifyContent={"space-between"}>
            <Box as={Flex} gap={2}>
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowLeftIcon />}
                size={"xs"}
                onClick={() => fetchData(0, numberPerPage)}
                isDisabled={data.pageNum === 0}
              />
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowBackIcon />}
                size={"xs"}
                onClick={() => fetchData(data.pageNum - 1, numberPerPage)}
                isDisabled={data.pageNum === 0}
              />
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowForwardIcon />}
                size={"xs"}
                onClick={() => fetchData(data.pageNum + 1, numberPerPage)}
                isDisabled={data.pageNum + 1 === data.numberOfPages}
              />
              <IconButton
                rounded="full"
                bg={"transparent"}
                color="secondary.100"
                icon={<ArrowRightIcon />}
                size={"xs"}
                onClick={() => fetchData(data.numberOfPages - 1, numberPerPage)}
                isDisabled={data.pageNum + 1 === data.numberOfPages}
              />
            </Box>
            <Box color={"text.primary"}>
              {data.pageNum + 1} out of {data.numberOfPages}
            </Box>
            <StyledSelect
              size={"xs"}
              value={numberPerPage}
              onchange={(res) => {
                setNumberPerPage(parseInt(res));
                fetchData(data.pageNum, parseInt(res));
              }}
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
                { value: 25, label: "25" },
              ]}
            />
          </Flex>
        </>
      ) : (
        <Box minH={"250px"} display={'flex'}  flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
          {loading? (
          <Center minH={"350px"} w={"100%"}>
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
          </Center>):(
            <Center minH={"350px"} w={"100%"} display={'flex'} flexDir={'column'}>
              <Image position={"relative"} src={empty} h={40} mb={5}/>
              <Heading
                              w={"100%"}
                              color={"text.primary"}
                              fontWeight={'semibold'}
                              fontSize={"xl"}
                              textAlign={"center"}
                            > 
                            There is no data to display.
                            </Heading></Center>)}
            
        </Box>
      )}
    </Box>
  );
}

export default TableV2;
