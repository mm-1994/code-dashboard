import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  Button,
  Text,
  Input,
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
  Center,
  Checkbox,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import StyledSelect from "../../../ui/styled-select/styled-select";
import {
  getDeviceConfigurations,
  getDeviceModes,
  getFirmwareLastUpdate,
  getPreDeviceConfigurations,
  getDeviceAlarmInterval,
} from "../../../../api/configurations";
import { formatDate } from "../../../../helpers/array-map";
import { AttachmentIcon, CloseIcon } from "@chakra-ui/icons";
import { getDeviceGeofences } from "../../../../api/geofences";
import { DevicesContext } from "../../../../context/devices";
import { ThemeContext } from "../../../../context/theme";
import { useMediaQuery } from "@chakra-ui/react";

const deviceModes = {
  "5 Minute Reporting Rate": 0,
  "30 Minute Reporting Rate": 1,
  "1 Hour Reporting Rate": 2,
  "3 Hours Reporting Rate": 4,
  "6 Hours Reporting Rate": 5,
  "1 Day Reporting": 3,
};
const deviceMainModes = {
  "Demo Mode": 1,
  "SATCOM Demo Mode": 2,
  "Normal Mode": 3,
  "Power Saving Mode": 4,
  "Ultra-Power Saving Mode": 5,
};
const alarmIntervalMode = {
  "Alarm Interval 1 Min": 1,

  "Alarm Interval 5 Min": 2,

  "Alarm Interval 15 Min": 3,

  "Alarm Interval 1 Hour": 4,

  "Alarm Interval 6 Hours": 5,

  "Alarm Interval 24 Hours": 6,
};

function DeviceFunction({
  keyToDisplay,
  lastUpdateTime,
  lastReqTime,
  previousValue,
  value,
  setFunction,
  options,
}) {
  const ops = [];
  Object.keys(options).forEach((optKey) =>
    ops.push({ label: optKey, value: options[optKey] })
  );

  return (
    <Box p={5}>
      <Text color={"text.primary"} fontWeight={"bold"} mb={1}>
        {keyToDisplay}
      </Text>
      <StyledSelect
        general={true}
        required={true}
        options={ops}
        value={value}
        onchange={setFunction}
      />
      <Text
        mt={2}
        color={"text.primary"}
        fontWeight={"bold"}
        w={"100%"}
        fontSize={"12px"}
        m={2}
      >
        Requested {keyToDisplay}:{" "}
        {value === undefined || value === -1
          ? "No value choosen before"
          : value ||
            (value === 0 && ops.find((opp) => opp.value === parseInt(value)))
          ? ops.find((opp) => opp.value === parseInt(value)).label
          : value || value}
      </Text>
      <Text
        w={"100%"}
        color={"text.primary"}
        fontWeight={"bold"}
        fontSize={"12px"}
        m={2}
      >
        Last Requested At : {formatDate(lastReqTime)}
      </Text>
      {previousValue !== undefined && previousValue !== null ? (
        <>
          <Text
            color={"text.primary"}
            fontWeight={"bold"}
            w={"100%"}
            fontSize={"12px"}
            m={2}
          >
            Current Configuration: {previousValue}
          </Text>
          <Text
            color={"text.primary"}
            fontWeight={"bold"}
            w={"100%"}
            fontSize={"12px"}
            m={2}
          >
            Last Update At : {formatDate(lastUpdateTime)}
          </Text>
        </>
      ) : null}
    </Box>
  );
}

function DeviceFunctions({
  imei,
  changeMode,
  changeThres,
  changeWifi,
  setConfig,
  updateFirmware,
  updateDeviceGeofence,
  updateDeviceGeofenceList,
  removeDeviceGeofence,
  editDeviceAlarmInterval,
}) {
  const [update, setUpdate] = useState(true);
  const [gpsIntervals, setGpsIntervals] = useState([]);
  const [scanIntervals, setScanIntervals] = useState([]);
  const [isNoneMobile] = useMediaQuery("(min-width: 600px)");
  const [thresholdEnabled, setThresholdEnabled] = useState();
  const deviceCtx = useContext(DevicesContext);
  const [mode, setMode] = useState();
  const [deviceMode, setDeviceMode] = useState();
  const [gpsInterval, setGpsInterval] = useState();
  const [cytagScan, setCytagScan] = useState();
  const [previouswifiName, setpreviousWifiName] = useState();
  const [wifiName, setWifiName] = useState();
  const [wifiPassword, setWifiPassword] = useState();
  const [maxT, setMaxT] = useState();
  const [minT, setMinT] = useState();
  const [maxLight, setMaxLight] = useState();
  const [minLight, setMinLight] = useState();
  const [minH, setMinH] = useState();
  const [maxH, setMaxH] = useState();
  const [minProx, setMinProx] = useState();
  const [maxProx, setMaxProx] = useState();
  const themeCtx = useContext(ThemeContext);

  const hiddenFileInput = React.useRef(null);
  const [file, setFile] = useState();
  const [version, setVersion] = useState();
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const [previousMode, setPreviousMode] = useState(undefined);
  const [modeUpdatedTime, setModeUpdateTime] = useState("Getting data .. ");
  const [modeRequestedTime, setModeRequestedTime] =
    useState("Getting data .. ");

  const [mainModeUpdatedTime, setMainModeUpdatedTime] =
    useState("Getting data .. ");
  const [mainModeRequesedTime, setMainModeRequesedTime] =
    useState("Getting data .. ");
  const [previousMainMode, setPreviousMainMode] = useState("Getting data .. ");

  const [previousGPSInterval, setPreviousGPSInterval] =
    useState("Getting data .. ");
  const [gpsIntervalUpdatedTime, setGPSIntervalUpdatedTime] =
    useState("Getting data .. ");
  const [gpsIntervalRequestedTime, setGPSIntervalRequestedTime] =
    useState("Getting data .. ");

  const [previousScanInterval, setPreviousScanInterval] =
    useState("Getting data .. ");
  const [scanIntervalUpdatedTime, setScanIntervalUpdatedTime] =
    useState("Getting data .. ");
  const [scanIntervalRequestedTime, setScanIntervalRequestedTime] =
    useState("Getting data .. ");

  const [updateRequestUpdatedTime, setupdateRequestUpdateTime] =
    useState("Getting data .. ");
  const [updateRequestRequestedTime, setupdateRequestRequestedTime] =
    useState("Getting data .. ");
  const [previousUpdateRequest, setPreviousUpdateRequest] =
    useState("Getting data .. ");
  const [updateRequest, setUpdateRequest] = useState("Getting data .. ");
  // ALARM INTERVAL

  const [previousAlarmInterval, setPreviousAlarmInterval] = useState();
  const [AlarmIntervalUpdatedTime, setAlarmIntervalUpdatedTime] =
    useState("Getting data .. ");
  const [updateAlarmRequestUpdatedTime, setupdateAlarmRequestUpdateTime] =
    useState("Getting data .. ");
  const [previousAlarmUpdateRequest, setAlarmPreviousUpdateRequest] =
    useState("Getting data .. ");
  //
  const [keysToDisplay, setKeysToDisplay] = useState("");
  const [alarmInterval, setAlarmInterval] = useState();

  const [spatialLoading, setSpatialLoading] = useState(false);
  const [firmwareLoader, setFirmwareLoader] = useState(false);
  const [modesLoader, setmodesLoader] = useState(false);
  const [confLoader, setConfLoader] = useState(false);
  const [bundleModeLoader, setBundleModeLoader] = useState(false);
  const [alarmIntLoader, setAlarmIntLoader] = useState(false);

  const getbundleMode = () => {
    setBundleModeLoader(true);
    getPreDeviceConfigurations(imei)
      .then((res) => {
        setMainModeUpdatedTime(res.data.conf_updated_time);
        setMode(deviceMainModes[res.data.conf]);
        setMainModeRequesedTime(res.data.requested_at);
        setPreviousMainMode(res.data.previous_conf);
        setBundleModeLoader(false);
      })
      .catch((e) => {
        setBundleModeLoader(false);
      });
  };

  const getFitmwareData = () => {
    setFirmwareLoader(true);
    getFirmwareLastUpdate(imei)
      .then((res) => {
        setupdateRequestUpdateTime(res.data.update_request_updated_time);
        setupdateRequestRequestedTime(res.data.requested_at);
        setPreviousUpdateRequest(res.data.previous_update_request);
        setUpdateRequest(res.data.update_request);
        setFirmwareLoader(false);
      })
      .catch((e) => {
        setFirmwareLoader(false);
      });
  };

  const getDeviceAlarmIntData = () => {
    setAlarmIntLoader(true);
    getDeviceAlarmInterval(imei)
      .then((res) => {
        setPreviousAlarmInterval(res.data.alarm_interval);
        setAlarmIntervalUpdatedTime(res.data.alarm_interval_updated_time);
        setupdateAlarmRequestUpdateTime(res.data.alarm_interval_requested_at);
        setAlarmPreviousUpdateRequest(res.data.previous_alarm_interval);
        setAlarmInterval(alarmIntervalMode[res.data.alarm_interval]);
        setDeviceMode(deviceModes[res.data.Mode]);
        setAlarmIntLoader(false);
      })
      .catch((e) => {
        setAlarmIntLoader(false);
      });
  };

  const getMode_Conf_Thresholds = () => {
    getConfData();
    setmodesLoader(true);
    getDeviceModes(imei)
      .then((res) => {
        setModeUpdateTime(res.data.Mode_updated_time);
        setModeRequestedTime(res.data.Mode_requested_at);
        setGPSIntervalUpdatedTime(res.data.GPS_Interval_updated_time);
        setGPSIntervalRequestedTime(res.data.GPS_Interval_requested_at);
        setScanIntervalUpdatedTime(res.data.Scan_Interval_updated_time);
        setScanIntervalRequestedTime(res.data.Scan_Interval_requested_at);
        setPreviousMode(res.data.previous_Mode);
        setPreviousGPSInterval(res.data.previous_GPS_Interval);
        setPreviousScanInterval(res.data.previous_Scan_Interval);

        setmodesLoader(false);
      })
      .catch((e) => {
        setmodesLoader(false);
      });
  };
  const getConfData = () => {
    setConfLoader(true);
    getDeviceConfigurations(imei)
      .then((res) => {
        const previous = res.data.current_configurations;
        setCytagScan(previous.scan_interval);
        setGpsInterval(previous.gps_interval);
        setMaxH(previous.Max_Humidity_Threshold);
        setMinH(previous.Min_Humidity_Threshold);
        setMinProx(previous.Min_Proximity_Threshold);
        setMaxProx(previous.Max_Proximity_Threshold);
        setMaxT(previous.Max_Temperature_Threshold);
        setMinT(previous.Min_Temperature_Threshold);
        setMaxLight(previous.Max_Light_Threshold);
        setMinLight(previous.Min_Light_Threshold);
        setThresholdEnabled(previous.thresholds_enabled);
        setDeviceMode(previous.mode);
        setKeysToDisplay(res.data.key_to_display);
        const configurations = res.data.cycollector_configurations_all;
        const gpsIntervalEntries = Object.entries(configurations.gps_interval);
        gpsIntervalEntries.sort((a, b) => a[1] - b[1]);
        const gpsIntervalSortedObj = Object.fromEntries(gpsIntervalEntries);
        setGpsIntervals(gpsIntervalSortedObj);
        const bleScanEntries = Object.entries(configurations.scan_interval);
        bleScanEntries.sort((a, b) => a[1] - b[1]);
        const bleScanEntriesSortedObj = Object.fromEntries(bleScanEntries);
        setScanIntervals(bleScanEntriesSortedObj);
        setConfLoader(false);
      })
      .then((e) => setConfLoader(false));
  };

  const getSpatialDetails = () => {
    setSpatialLoading(true);
    if (devicesContext.geofences && devicesContext.geofences.length == 0) {
      deviceCtx.getGeofencesCall();
    }
    getDeviceGeofences(imei)
      .then((res) => {
        setDeviceGeofences(res.data.device_geofences);
        setSpatialLoading(false);
      })
      .catch((err) => spatialLoading(false));
  };

  const callback = () => setUpdate(true);

  const devicesContext = useContext(DevicesContext);

  const [deviceGeofences, setDeviceGeofences] = useState([]);
  const [geofenceChoice, setGeofenceChoice] = useState();
  const [geofenceType, setGeofenceType] = useState();
  const [geofenceStatus, setGeofenceStatus] = useState();

  const [geofences, setGeofences] = useState([]);
  useEffect(() => {
    setGeofences(devicesContext.geofences ? devicesContext.geofences : []);
    setUpdate(false);
  }, [update, devicesContext]);

  return (
    <Box
      alignItems={"center"}
      justifyContent={"space-around"}
      w={"100%"}
      as={Flex}
      gap={4}
      flexWrap={"wrap"}
    >
      <Box
        alignItems={"center"}
        justifyContent={"space-around"}
        w={"100%"}
        as={Flex}
        gap={4}
        flexWrap={"wrap"}
      >
        <FunctionalModal
          modalTitle={"Configurations"}
          btnMinH={"50px"}
          btnColor={"primary.100"}
          btnTitle={"Manage Device Configurations"}
          transparent={true}
          modalMinH={"fit-content"}
          footer={false}
          btnMinW={"280px"}
        >
          <Center>
            <Flex
              h={"100%"}
              gap={5}
              flexWrap={"wrap"}
              justifyContent={"center"}
              p={4}
            >
              <Box as={Center} w={"100%"}>
                <FunctionalModal
                  modalTitle={"Set Mode"}
                  btnMinH={"50px"}
                  btnColor={"primary.60"}
                  btnTitle={"Set Mode"}
                  btnW={250}
                  btnH={50}
                  modalMinH={"500px"}
                  modalMinW="200px"
                  btnMinW={"200px"}
                  parentButtonFunc={getbundleMode}
                  btnAction={
                    <Button
                      bg={"primary.60"}
                      color={"text.primary"}
                      w={"fit-content"}
                      boxShadow={
                        themeCtx.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      }
                      p={5}
                      mr={2}
                      _hover={{ color: "primary.100", bg: "primary.60" }}
                      onClick={() => changeMode({ mode, callback })}
                    >
                      Set Mode
                    </Button>
                  }
                >
                  {bundleModeLoader ? (
                    <Center minH={"200px"} w={"100%"}>
                      <Spinner
                        thickness="6px"
                        speed="0.85s"
                        emptyColor="text.primary"
                        color="primary.60"
                        size="xl"
                      />
                    </Center>
                  ) : (
                    <DeviceFunction
                      keyToDisplay={keysToDisplay.mode}
                      value={
                        mode !== -1 || mode !== "" || !mode
                          ? mode
                          : deviceMainModes[previousMainMode]
                      }
                      setFunction={setMode}
                      previousValue={previousMainMode}
                      lastUpdateTime={mainModeUpdatedTime}
                      lastReqTime={mainModeRequesedTime}
                      options={deviceMainModes}
                    />
                  )}
                </FunctionalModal>
              </Box>
              <Box as={Center} w={"100%"}>
                <FunctionalModal
                  modalTitle={"Trigger Events"}
                  btnH={50}
                  btnColor={"primary.60"}
                  parentButtonFunc={getMode_Conf_Thresholds}
                  btnTitle={"Trigger Events"}
                  modalMinH={"500px"}
                  btnW={250}
                  modalMinW="300px"
                  btnMinW={"200px"}
                  btnAction={
                    <Button
                      bg={"primary.60"}
                      color={"text.primary"}
                      w={"fit-content"}
                      boxShadow={
                        themeCtx.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      }
                      p={5}
                      mr={2}
                      _hover={{ color: "primary.100", bg: "primary.60" }}
                      onClick={() =>
                        changeThres({
                          maxT,
                          maxH,
                          minLight,
                          minH,
                          maxLight,
                          minT,
                          minProx,
                          maxProx,
                          thresholdEnabled,
                          callback,
                        })
                      }
                    >
                      Change Trigger Events
                    </Button>
                  }
                >
                  {modesLoader && confLoader ? (
                    <Center minH={"200px"}>
                      <Spinner
                        thickness="6px"
                        speed="0.85s"
                        emptyColor="text.primary"
                        color="primary.60"
                        size="xl"
                      />
                    </Center>
                  ) : (
                    <Box pt={5} pb={5}>
                      <Box gap={4} as={Flex} flexWrap={"wrap"}>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Min Temperature °C
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            min={-20}
                            max={60}
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMinT(valueString)}
                            value={minT}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Max Temperature °C
                          </Text>

                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            min={-20}
                            max={60}
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMaxT(valueString)}
                            value={maxT}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Min Light Intensity hlx
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            min={0}
                            max={1000}
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMinLight(valueString)}
                            value={minLight}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Max Light Intensity hlx
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            min={0}
                            max={1000}
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMaxLight(valueString)}
                            value={maxLight}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Min Humidity %RH
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            min={0}
                            max={100}
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMinH(valueString)}
                            value={minH}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Max Humidity %RH
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            min={0}
                            max={100}
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMaxH(valueString)}
                            value={maxH}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        {/* /////// */}
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Min Proximity
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMinProx(valueString)}
                            value={minProx}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        <Box w={48} minW={isNoneMobile ? 48 : "350px"}>
                          <Text fontWeight={"medium"} color={"text.primary"}>
                            Max Proximity
                          </Text>
                          <NumberInput
                            bg={"primary.80"}
                            color={"text.primary"}
                            boxShadow={
                              themeCtx.darkMode
                                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                            }
                            borderRadius={0}
                            border={0}
                            height={45}
                            borderBottom={4}
                            borderStyle={"solid"}
                            borderColor={"action.100"}
                            _autofill={{
                              textFillColor: "text.primary",
                              boxShadow: `0 0 0px 1000px ${
                                themeCtx.darkMode ? "#171821" : "#primary.80"
                              } inset`,
                              textFillColor: themeCtx.darkMode
                                ? "#FFFFFF"
                                : "#000000",
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
                            placeholder="N/A"
                            onChange={(valueString) => setMaxProx(valueString)}
                            value={maxProx}
                          >
                            <NumberInputField border={0} borderRadius={0} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>

                        <Box w={48}>
                          <Checkbox
                            color={"text.primary"}
                            fontWeight={"medium"}
                            onChange={(e) =>
                              setThresholdEnabled(e.target.checked)
                            }
                            isChecked={thresholdEnabled}
                            value={thresholdEnabled}
                          >
                            Enable Thresholds
                          </Checkbox>
                        </Box>
                      </Box>
                      <Text
                        fontWeight={"medium"}
                        color={"text.primary"}
                        mt={2}
                        w={"100%"}
                        fontSize={13}
                        mb={2}
                      >
                        Thresholds mode status:{" "}
                        {thresholdEnabled ? "enabled" : "disabled"}
                      </Text>
                    </Box>
                  )}
                </FunctionalModal>
              </Box>
              {/* <Box as={Center} w={"100%"}>
                  <FunctionalModal
                    modalTitle={"Set Wifi Credentials"}
                    btnH={50}
                    btnMinH={"50px"}
                    btnW={250}
                    btnColor={"primary.60"}
                    btnTitle={"Set Wifi Credentials"}
                    modalMinH={"500px"}
                    btnMinW={"200px"}
                    btnAction={
                      <Button
                        bg={"primary.60"}
                        color={"text.primary"}
                        w={"fit-content"}
                        boxShadow={
                          themeCtx.darkMode
                            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                            : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                        }
                        p={5}
                        mr={2}
                        _hover={{ color: "primary.100", bg: "primary.60" }}
                        onClick={() =>
                          changeWifi({ wifiName, wifiPassword, callback })
                        }
                      >
                        Update Credentials
                      </Button>
                    }
                  >
                    <Box gap={"2%"} as={Flex} flexWrap={"wrap"}>
                      <Box w={"48%"}>
                        <Text fontWeight={"bold"} color={"text.primary"} mb={1}>
                          Wifi name
                        </Text>
                        <Input
                          maxLength={32}
                          bg={"primary.80"}
                          color={"text.primary"}
                          boxShadow={
                            themeCtx.darkMode
                              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                          }
                          borderRadius={0}
                          border={0}
                          height={45}
                          borderBottom={4}
                          borderStyle={"solid"}
                          borderColor={"action.100"}
                          _autofill={{
                            textFillColor: "text.primary",
                            boxShadow: `0 0 0px 1000px ${
                              themeCtx.darkMode ? "#171821" : "#primary.80"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          placeholder="N/A"
                          value={wifiName}
                          onChange={(e) => setWifiName(e.target.value)}
                          type={"text"}
                        />
                      </Box>
                      <Box w={"48%"}>
                        <Text fontWeight={"bold"} color={"text.primary"} mb={1}>
                          Wifi password
                        </Text>
                        <Input
                          bg={"primary.80"}
                          color={"text.primary"}
                          boxShadow={
                            themeCtx.darkMode
                              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                          }
                          borderRadius={0}
                          border={0}
                          height={45}
                          borderBottom={4}
                          borderStyle={"solid"}
                          borderColor={"action.100"}
                          _autofill={{
                            textFillColor: "text.primary",
                            boxShadow: `0 0 0px 1000px ${
                              themeCtx.darkMode ? "#171821" : "#primary.80"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          placeholder="N/A"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          type={"password"}
                        />
                      </Box>
                    </Box>
                    <Text
                      fontWeight={"bold"}
                      color={"text.primary"}
                      w={"100%"}
                      fontSize={"12px"}
                      mb={2}
                      mt={2}
                    >
                      Last Wifi Name: &nbsp;{" "}
                      {previouswifiName ? previouswifiName : "N/A"}
                    </Text>
                  </FunctionalModal>
                </Box> */}
              <Box as={Center} w={"100%"}>
                <FunctionalModal
                  modalTitle={"Set Configurations"}
                  btnH={50}
                  btnMinH={"50px"}
                  btnW={250}
                  btnColor={"primary.60"}
                  btnTitle={"Set Configurations"}
                  modalMinH={"100%"}
                  modalMinW={"200px"}
                  btnMinW={"200px"}
                  parentButtonFunc={getMode_Conf_Thresholds}
                  btnAction={
                    <Button
                      bg={"primary.60"}
                      color={"text.primary"}
                      w={"fit-content"}
                      boxShadow={
                        themeCtx.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      }
                      p={5}
                      mr={2}
                      _hover={{ color: "primary.100", bg: "primary.60" }}
                      onClick={() =>
                        setConfig({
                          deviceMode,
                          gpsInterval,
                          cytagScan,
                          callback,
                        })
                      }
                    >
                      Set Mode
                    </Button>
                  }
                >
                  {modesLoader && confLoader ? (
                    <Center minH={"200px"}>
                      <Spinner
                        thickness="6px"
                        speed="0.85s"
                        emptyColor="text.primary"
                        color="primary.60"
                        size="xl"
                      />
                    </Center>
                  ) : (
                    <>
                      <DeviceFunction
                        keyToDisplay={keysToDisplay.mode}
                        value={
                          deviceMode !== -1 || deviceMode !== "" || !deviceMode
                            ? deviceMode
                            : deviceModes[previousMode]
                        }
                        setFunction={setDeviceMode}
                        options={deviceModes}
                        previousValue={previousMode}
                        lastUpdateTime={modeUpdatedTime}
                        lastReqTime={modeRequestedTime}
                      />
                      <DeviceFunction
                        keyToDisplay={keysToDisplay.gps_interval}
                        value={
                          !gpsInterval ||
                          gpsInterval !== "" ||
                          gpsInterval !== -1
                            ? gpsInterval
                            : gpsIntervals[previousGPSInterval]
                        }
                        setFunction={setGpsInterval}
                        options={gpsIntervals}
                        previousValue={previousGPSInterval}
                        lastUpdateTime={gpsIntervalUpdatedTime}
                        lastReqTime={gpsIntervalRequestedTime}
                      />
                      <DeviceFunction
                        keyToDisplay={keysToDisplay.scan_interval}
                        value={
                          !cytagScan || cytagScan !== "" || cytagScan !== -1
                            ? cytagScan
                            : scanIntervals[previousScanInterval]
                        }
                        setFunction={setCytagScan}
                        options={scanIntervals}
                        previousValue={previousScanInterval}
                        lastUpdateTime={scanIntervalUpdatedTime}
                        lastReqTime={scanIntervalRequestedTime}
                      />
                    </>
                  )}
                </FunctionalModal>
              </Box>
              <Box as={Center} w={"100%"}>
                <FunctionalModal
                  modalTitle={"Remote Update"}
                  btnH={50}
                  btnMinH={"50px"}
                  btnW={250}
                  parentButtonFunc={getFitmwareData}
                  btnColor={"primary.60"}
                  btnTitle={"Firmware Update"}
                  modalMinH={"500px"}
                  modalMinW={"200px"}
                  btnMinW={"200px"}
                  btnAction={
                    <Button
                      bg={"primary.60"}
                      color={"text.primary"}
                      w={"fit-content"}
                      boxShadow={
                        themeCtx.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      }
                      p={5}
                      mr={2}
                      _hover={{ color: "primary.100", bg: "primary.60" }}
                      onClick={() =>
                        updateFirmware({ file, version, callback })
                      }
                    >
                      Send Update
                    </Button>
                  }
                >
                  {firmwareLoader ? (
                    <Center minH={"200px"}>
                      <Spinner
                        thickness="6px"
                        speed="0.85s"
                        emptyColor="text.primary"
                        color="primary.60"
                        size="xl"
                      />
                    </Center>
                  ) : (
                    <>
                      <Box pb={2} mt={4} as={Flex} w={"100%"}>
                        <Text fontWeight={"bold"} color={"text.primary"} m={2}>
                          Version
                        </Text>
                        <Input
                          bg={"primary.80"}
                          color={"text.primary"}
                          boxShadow={
                            themeCtx.darkMode
                              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                          }
                          borderRadius={0}
                          border={0}
                          height={45}
                          borderBottom={4}
                          borderStyle={"solid"}
                          borderColor={"action.100"}
                          _autofill={{
                            textFillColor: "text.primary",
                            boxShadow: `0 0 0px 1000px ${
                              themeCtx.darkMode ? "#171821" : "#primary.80"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          placeholder={
                            previousUpdateRequest
                              ? previousUpdateRequest
                              : "N/A"
                          }
                          value={version}
                          onChange={(e) => setVersion(e.target.value)}
                          type={"text"}
                        />
                      </Box>
                      <Input
                        ref={hiddenFileInput}
                        type="file"
                        onChange={handleFileChange}
                        display={"none"}
                      />
                      <InputGroup m={2} size="lg" w={"100%"}>
                        <Input
                          mt={2}
                          type={"text"}
                          color={"text.primary"}
                          pr={"20%"}
                          variant={"unstyled"}
                          isDisabled={true}
                          placeholder="Upload a file"
                          _placeholder={{ color: "text.primary" }}
                          value={file ? file.name : ""}
                        />
                        <InputRightElement width={"20%"} gap={1}>
                          <IconButton
                            title="remove file"
                            bg={"primary.100"}
                            icon={<CloseIcon color={"danger.100"} />}
                            rounded={"full"}
                            size={"sm"}
                            onClick={() => setFile(null)}
                          />
                          <IconButton
                            title="upload file"
                            bg={"primary.100"}
                            icon={<AttachmentIcon color={"action.100"} />}
                            rounded={"full"}
                            size={"sm"}
                            onClick={() => hiddenFileInput.current.click()}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Text
                        fontWeight={"bold"}
                        color={"text.primary"}
                        w={"100%"}
                        fontSize={"12px"}
                        m={2}
                      >
                        Last Requested Update: {updateRequest}
                      </Text>
                      <Text
                        fontWeight={"bold"}
                        color={"text.primary"}
                        w={"100%"}
                        fontSize={"12px"}
                        m={2}
                      >
                        Requested At : {formatDate(updateRequestRequestedTime)}
                      </Text>
                      <Text
                        fontWeight={"bold"}
                        color={"text.primary"}
                        w={"100%"}
                        fontSize={"12px"}
                        m={2}
                      >
                        Current Update: {previousUpdateRequest}
                      </Text>
                      <Text
                        fontWeight={"bold"}
                        color={"text.primary"}
                        w={"100%"}
                        fontSize={"12px"}
                        m={2}
                      >
                        Last Update At : {formatDate(updateRequestUpdatedTime)}
                      </Text>
                    </>
                  )}
                </FunctionalModal>
              </Box>
              {/* ALARM INTERVAL */}
              <Box as={Center} w={"100%"}>
                <FunctionalModal
                  modalTitle={"Set Alarm Interval"}
                  btnH={50}
                  btnMinH={"50px"}
                  btnW={250}
                  btnColor={"primary.60"}
                  btnTitle={"Set Alarm Interval"}
                  modalMinH={"500px"}
                  modalMinW={"200px"}
                  parentButtonFunc={getDeviceAlarmIntData}
                  btnMinW={"200px"}
                  btnAction={
                    <Button
                      bg={"primary.60"}
                      color={"text.primary"}
                      w={"fit-content"}
                      boxShadow={
                        themeCtx.darkMode
                          ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                          : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                      }
                      p={5}
                      mr={2}
                      _hover={{ color: "primary.100", bg: "primary.60" }}
                      onClick={() =>
                        editDeviceAlarmInterval({ alarmInterval, callback })
                      }
                    >
                      Set Alarm Interval
                    </Button>
                  }
                >
                  {alarmIntLoader ? (
                    <Center minH={"200px"}>
                      <Spinner
                        thickness="6px"
                        speed="0.85s"
                        emptyColor="text.primary"
                        color="primary.60"
                        size="xl"
                      />
                    </Center>
                  ) : (
                    <DeviceFunction
                      keyToDisplay={"Alarm Interval"}
                      value={
                        !alarmInterval ||
                        alarmInterval !== "" ||
                        alarmInterval !== -1
                          ? alarmInterval
                          : alarmIntervalMode[previousAlarmUpdateRequest]
                      }
                      setFunction={setAlarmInterval}
                      previousValue={previousAlarmUpdateRequest}
                      lastUpdateTime={AlarmIntervalUpdatedTime}
                      lastReqTime={updateAlarmRequestUpdatedTime}
                      options={alarmIntervalMode}
                    />
                  )}
                </FunctionalModal>
              </Box>
            </Flex>
          </Center>
        </FunctionalModal>
        {/* <FunctionalModal
          modalTitle={"Configurations"}
          btnMinW={"280px"}
          btnMinH={"50px"}
          btnColor={"primary.100"}
          btnTitle={"Manage Spatial Configurations"}
          transparent={true}
          modalMinH={"fit-content"}
          footer={false}
          parentButtonFunc={getSpatialDetails}
        >
          <Center>
            {spatialLoading ? (
              <Center minH={"200px"}>
                <Spinner
                  thickness="6px"
                  speed="0.85s"
                  emptyColor="text.primary"
                  color="primary.60"
                  size="xl"
                />
              </Center>
            ) : (
              <Flex
                h={"100%"}
                gap={5}
                flexWrap={"wrap"}
                justifyContent={"center"}
                p={4}
              >
                <Box as={Center} w={"100%"}>
                  <FunctionalModal
                    modalTitle={"Add Geofences"}
                    btnH={50}
                    btnMinH={"50px"}
                    modalMinH={"500px"}
                    modalMinW="200px"
                    btnMinW={"250px"}
                    btnColor={"primary.60"}
                    reset={() => {setGeofenceChoice(-1); setGeofenceType(-1)}}
                    btnTitle={"Add Geofences"}
                    btnW={250}
                    btnAction={
                      <Button
                        bg={"primary.60"}
                        color={"text.primary"}
                        w={"fit-content"}
                        boxShadow={
                          themeCtx.darkMode
                            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                            : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                        }
                        p={5}
                        mr={2}
                        _hover={{ color: "primary.100", bg: "primary.60" }}
                        onClick={() => {
                          updateDeviceGeofenceList(
                            geofenceChoice,
                            geofenceType
                          );
                          getSpatialDetails();
                        }}
                      >
                        Add Geofence
                      </Button>
                    }
                  >
                    <Box
                      display={"flex"}
                      flexDir={"column"}
                      justifyContent={"center"}
                      pt={5}
                      pb={7}
                    >
                      <Text fontWeight={"bold"} color={"text.primary"} mb={2}>
                        Select Geofence
                      </Text>
                      <StyledSelect
                        general={true}
                        required={true}
                        options={geofences.map((geo) => {
                          return { label: geo.name, value: geo.id };
                        })}
                        value={geofenceChoice}
                        onchange={setGeofenceChoice}
                      />
                      <Text
                        fontWeight={"bold"}
                        color={"text.primary"}
                        mt={8}
                        mb={2}
                      >
                        Select Type
                      </Text>
                      <StyledSelect
                        general={true}
                        required={true}
                        options={[
                          {
                            value: "ASSERT_IN",
                            label: "Alert when device is outside geofence",
                          },
                          {
                            value: "ASSERT_OUT",
                            label: "Alert when device is inside geofence",
                          },
                        ]}
                        value={geofenceType}
                        onchange={setGeofenceType}
                      />
                    </Box>
                  </FunctionalModal>
                </Box>
                <Box as={Center} w={"100%"}>
                  <FunctionalModal
                    modalTitle={"Activate/Deactivate Geofences"}
                    btnH={50}
                    btnMinH={"50px"}
                    modalMinH={"500px"}
                    modalMinW="200px"
                    btnMinW={"250px"}
                    btnW={250}
                    reset={() => {setGeofenceStatus(-1); setGeofenceChoice(-1)}}
                    btnColor={"primary.60"}
                    btnTitle={"Activate/Deactivate Geofences"}
                    btnAction={
                      <Button
                        bg={"primary.60"}
                        color={"text.primary"}
                        w={"fit-content"}
                        boxShadow={
                          themeCtx.darkMode
                            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                            : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                        }
                        p={5}
                        mr={2}
                        _hover={{ color: "primary.100", bg: "primary.60" }}
                        onClick={() => {
                          updateDeviceGeofence(geofenceChoice, geofenceStatus);
                          getSpatialDetails();
                        }}
                      >
                        Activate/Deactivate Geofence
                      </Button>
                    }
                  >
                    <Box
                      display={"flex"}
                      flexDir={"column"}
                      justifyContent={"space-between"}
                      pt={5}
                      pb={7}
                    >
                      <Box width={'100%'} justifyContent={"space-between"} gap={2} as={Flex}  flexWrap={'wrap'} flexDir={'row'} mb={5}>
                      {deviceGeofences.map((deviceGeofence) => {
                        return(
                        <Box  as={Flex} flexDir={isNoneMobile ? 'column': 'row'}   gap={isNoneMobile ? 0 : 2}  minW={isNoneMobile ? 'fit-content': '100%'} flexWrap={isNoneMobile ? 'none' : 'wrap'} width={isNoneMobile ? 48 : "100%"} alignItems={'flex-start'} justifyContent={isNoneMobile ?'center':'flex-start'} boxShadow={
                          themeCtx.darkMode
                            ? "5px 4px 15px 1px rgba(0,0,0,1)"
                            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                        } py={3} px={3} borderRadius={10} borderColor={'primary.60'} borderWidth={2}>
                          <Box display={'flex'} minW={'fit-content'} flexDir={'row'} >
                          <Text fontWeight={"bold"} color={"primary.60"} >
                         Name:&nbsp; 
                        </Text>
                        <Text fontWeight={"bold"}  flexWrap={'wrap'} color={"text.primary"} >
                          {deviceGeofence.geofence.name}
                        </Text>
                          </Box>

                          <Box display={'flex'} minW={'fit-content'}flexWrap={'wrap'} flexDir={'row'} >
                          <Text fontWeight={"bold"} color={"primary.60"} >
                         Type:&nbsp; 
                        </Text>
                        <Text fontWeight={"bold"}  color={"text.primary"} >
                          {deviceGeofence.geofence_type.replaceAll("_", " ")}
                        </Text>
                          </Box>

                          
                          <Box display={'flex'} minW={'fit-content'} flexDir={'row'} >
                          <Text fontWeight={"bold"} color={"primary.60"} >
                         Active:&nbsp; 
                        </Text>
                        <Text fontWeight={"bold"} minW={'fit-content'} flexWrap={'wrap'} color={deviceGeofence.active ? 'text.success' : 'text.warning' } >
                          {deviceGeofence.active ? "True" : 'False'}
                        </Text>
                          </Box>
                         
                        </Box>)
                     
                      })}
                        </Box>
                      <Text fontWeight={"bold"} color={"text.primary"} mb={2}>
                        Select Geofence
                      </Text>
                      <StyledSelect
                        general={true}
                        required={true}
                        options={deviceGeofences.map((geo) => {
                          return {
                            label: geo.geofence.name,
                            value: geo.geofence.id,
                          };
                        })}
                        value={geofenceChoice}
                        onchange={setGeofenceChoice}
                      />

                      <Text
                        fontWeight={"bold"}
                        color={"text.primary"}
                        mt={8}
                        mb={2}
                      >
                        Select Status
                      </Text>
                      <StyledSelect
                        general={true}
                        required={true}
                        options={[
                          { value: false, label: "Inactive" },
                          { value: true, label: "Active" },
                        ]}
                        value={geofenceStatus}
                        onchange={setGeofenceStatus}
                      />
                    </Box>
                  </FunctionalModal>
                </Box>
                <Box as={Center} w={"100%"}>
                  <FunctionalModal
                    modalTitle={"Remove Geofences"}
                    btnH={50}
                    btnMinH={"50px"}
                    btnColor={"primary.60"}
                    btnTitle={"Remove Geofences"}
                    modalMinH={"500px"}
                    btnMinW={"200px"}
                    btnW={250}
                    reset={() => {setGeofenceChoice(-1)}}
                    btnAction={
                      <Button
                        bg={"primary.60"}
                        color={"text.primary"}
                        w={"fit-content"}
                        boxShadow={
                          themeCtx.darkMode
                            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                            : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                        }
                        p={5}
                        mr={2}
                        _hover={{ color: "primary.100", bg: "primary.60" }}
                        onClick={() => {
                          removeDeviceGeofence(geofenceChoice);
                          getSpatialDetails();
                        }}
                      >
                        Remove Geofence
                      </Button>
                    }
                  >
                    <Box
                      display={"flex"}
                      flexDir={"column"}
                      justifyContent={"center"}
                      pt={5}
                      pb={7}
                    >
                      <Text fontWeight={"bold"} color={"text.primary"} mb={2}>
                        Select Geofence
                      </Text>
                      <StyledSelect
                        general={true}
                        required={true}
                        options={deviceGeofences.map((geo) => {
                          return {
                            label: geo.geofence.name,
                            value: geo.geofence.id,
                          };
                        })}
                        value={geofenceChoice}
                        onchange={setGeofenceChoice}
                      />
                    </Box>
                  </FunctionalModal>
                </Box>
              </Flex>
            )}
          </Center>
        </FunctionalModal> */}
      </Box>
    </Box>
  );
}
export default DeviceFunctions;
