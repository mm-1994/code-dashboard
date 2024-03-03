import React, { useState, useContext } from "react";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import { Box, Button, Flex, Spinner, Center } from "@chakra-ui/react";
import HistoryPicker from "../../../ui/history-picker/history-picker";
import Map from "../../../ui/map/map";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { getLocationHistory } from "../../../../api/devices";
import { ThemeContext } from "../../../../context/theme";
import { formatDate } from "../../../../helpers/array-map";
import { formatLocalToISOUTC } from "../../../../helpers/array-map";

function LocationReplay({ name, id }) {
  const [startDate, setStartDate] = useState("");
  const themeCtx = useContext(ThemeContext);
  const [endDate, setEndDate] = useState("");
  const [locationListCallLoading, setLocationListCallLoading] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [clear, setClear] = useState(false);

  const setLocationListCall = (reset) => {
    setLocationListCallLoading(true);
    getLocationHistory(
      id,
      reset ? null : startDate === "" ? null : formatLocalToISOUTC(startDate),
      reset ? null : endDate === "" ? null : formatLocalToISOUTC(endDate)
    ).then((res) => {
      setLocationList(
        res.data.data.map((point) => {
          return {
            ...point,
            lat: parseFloat(point.lat),
            lng: parseFloat(point.lng),
          };
        })
      );
      setLocationListCallLoading(false);
    });
  };

  useEffect(() => {
    setLocationListCall();
  }, [id]);

  return (
    <FunctionalModal
      modalTitle={"Replay trips"}
      iconBtn={RepeatClockIcon}
      modalMinW={"70%"}
      modalMinH={"200px"}
      btnColor={"primary.60"}
      btnMinH={"40px"}
      footer={false}
    >
      <Box display={"flex"} alignItems={"center"} flexDir={"column"}>
        <Box
          w={"100%"}
          as={Flex}
          flexDir={"row"}
          flexWrap={"wrap"}
          alignItems={"flex-end"}
          justifyContent={"space-between"}
          gap={5}
          mx={0}
          mb={8}
        >
          <HistoryPicker
            startDate={startDate}
            endDate={endDate}
            selectEndDate={setEndDate}
            selectStartDate={setStartDate}
            showBtn={false}
            width={"30%"}
          />
          <Box as={Flex} alignItems={"end"} py={1} gap={2}>
            <Button
              h={"40px"}
              isDisabled={startDate === "" && endDate === ""}
              w={120}
              color={"text.primary"}
              bg={"primary.80"}
              _hover={{ bg: "primary.60" }}
              onClick={() => setLocationListCall(false)}
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            >
              {locationListCallLoading ? (
                <Center minH={"250px"} w={"100%"}>
                  <Spinner
                    thickness="3px"
                    speed="0.85s"
                    emptyColor="text.primary"
                    color="primary.60"
                    size="sm"
                  />
                </Center>
              ) : (
                "Show Trip"
              )}
            </Button>
            <Button
              h={"40px"}
              w={120}
              isDisabled={startDate === "" && endDate === ""}
              color={"text.warning"}
              bg={"primary.80"}
              _hover={{ bg: "primary.60" }}
              onClick={() => {
                setStartDate(""), setEndDate(""), setLocationListCall(true);
                setClear((prevState) => {
                  return !prevState;
                });
              }}
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            >
              {locationListCallLoading ? (
                <Center minH={"250px"} w={"100%"}>
                  <Spinner
                    thickness="3px"
                    speed="0.85s"
                    emptyColor="text.primary"
                    color="primary.60"
                    size="sm"
                  />
                </Center>
              ) : (
                "Reset"
              )}
            </Button>
          </Box>
        </Box>
        <Map
          clear={clear}
          setClear={setClear}
          deviceName={name}
          minH="340px"
          trips={locationList.length > 0}
          tripChoice={locationList.reverse()}
        />
      </Box>
    </FunctionalModal>
  );
}

export default LocationReplay;
