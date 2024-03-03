import { Button, Text, Box,  Table,
  IconButton,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
   } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { DevicesContext } from "../../../../context/devices";
import { showsuccess } from "../../../../helpers/toast-emitter";
import { BiX } from "react-icons/bi";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { DEVICES } from "../../../../types/devices";
import { ThemeContext } from "../../../../context/theme";
import { formatDate } from "../../../../helpers/array-map";
import { AlarmAction } from "../../dashboard/dashboard";
import { useMediaQuery } from "@chakra-ui/react";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";

export function AlarmsList({ alarms, callbackFn }) {
    const [alarmsMapped, setAlarmsMapped] = useState([]);

    useEffect(() => {
      const alarmsmap = [];
      alarms.forEach((alarm) => {
        alarmsmap.push({
          id: alarm.id,
          severity: alarm.alarm_settings.severity,
          entity: alarm.entity ? alarm.entity.name : "",
          type: alarm.alarm_settings.alarm_type.name,
          start_time: alarm.start_time,
          updated_time: alarm.updated_time,
          Clear: { alarm: alarm.id },
        });
      });
      setAlarmsMapped([...alarmsmap]);
    }, [alarms]);

    return (
      <TableContainer>
        <Text fontWeight={"bold"} color={"text.primary"}>
          You need to clear these alarms first before you can delete this alarm
          settings
        </Text>
        {alarmsMapped && alarmsMapped.length > 0 && (
          <Table >
            <Thead>
              <Tr>
                {Object.keys(alarmsMapped[0]).map((key) => {
                  return <Th color={"primary.60"} >{key.toUpperCase().replaceAll("_", " ")}</Th>;
                })}
              </Tr>
            </Thead>
            <Tbody>
              {alarmsMapped.map((alarm) => {
                return (
                  <Tr color={"text.primary"} fontWeight={"bold"}>
                    {Object.keys(alarmsMapped[0]).map((key) => {
                      if (key === "Clear") {
                        return (
                          <Box mt={2} ml={5}>
                          <AlarmAction
                            useAlarmId={true}
                            callback={callbackFn}
                            actionPerformed={false}
                            acknowldgeAction={false}
                            alarm={alarm.id}
                          /></Box>
                        );
                      } else if (key === "updated_time" || key === "start_time") {
                        return <Td>{formatDate(alarm[key])}</Td>;
                      } else {
                        return <Td>{alarm[key]}</Td>;
                      }
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>
    );
  }


function AssignEntities({
  type,
  assignedEntities,
  multi = true,
  assignAction,
  mainId,
  callback,
  alarmTypes
}) {
  const devCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");
  const [entityValue, setEntityValue] = useState(
    assignedEntities.length !== 0 && typeof assignedEntities !== "string"
      ? assignedEntities.map((et) => {
          return { value: et.id, label: et.name };
        })
      : []
  );
  const [allEntitties, setAllEntitties] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const filterAlarms = (alarmId) => {
    setAlarms([...alarms.filter((alarm) => alarm.id !== alarmId)]);
  };
  const assignFn = () => {    
    assignAction(
      mainId,
      entityValue.map((e) => e.value)
    )
      .then(() => { 
        showsuccess("Successfully assigned entity")
        onClose();
        callback(alarmTypes)

      })
      .catch((err) => {
        if (err.response.status === 403) {
          setAlarms(err.response.data.data);
        }
      });
  };

  const resetOptions = () => {
    setAlarms([])
    setEntityValue(
      assignedEntities.length !== 0 && typeof assignedEntities !== "string"
        ? assignedEntities.map((et) => {
            return { value: et.id, label: et.name };
          })
        : []
    );
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (devCtx.devicesObj) {
      const cytags = [];
      const cylocks = [];
      if (devCtx.devicesObj.devices.cytag) {
        cytags.push(...devCtx.devicesObj.devices.cytag);
      }
      if (devCtx.devicesObj.devices.cycollector) {
        cylocks.push(...devCtx.devicesObj.devices.cycollector);
      }
      if (type === DEVICES.CYTAG) {
        setAllEntitties([...cytags]);
      } else if (type === DEVICES.CYCOLLECTOR) {
        setAllEntitties([...cylocks]);
      } else {
        setAllEntitties([...cylocks, ...cytags]);
      }
    }
  }, [devCtx]);
  return (
    <>
    <Button
    w={'fit-content' }
    h={'fit-content' }
    boxShadow={
      themeCtx.darkMode
        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
        : "3px 5px 7px 1px rgba(0,0,0,0.2)"
    }
    color={"text.primary"}
    bg={"primary.60"}
    p={3}
    mr={2}
    _hover={{color:'primary.100', bg:'primary.60'}}
    onClick={(e) => {onOpen();}}
  >
    Edit Entities
    </Button>
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
            onClick={() => {onClose(); resetOptions();}}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
      }
      isOpen={isOpen}
      modalMinH={"600px"}
      footer={true}
      modalTitle={"Edit " + (type === "alarm" ? "Entities" : "Devices")}
      onClose={onClose}
      modalMinW={isNonMobile ? "fit-content" : "200px"}
      btnAction={
        <Button
          bg={"primary.80"}
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
          onClick={() => assignFn()}
        >
          Edit Entity
        </Button>
      }
    >
      <Box py={10} px={5} display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} gap={2}>
      {alarms.length === 0 ? (
        <>
              <Text w={330} fontWeight={"bold"} color={"text.primary"}>
              {" "}
              {type !== "alarm" ? "Pick Devices" : "Pick Entities"}
            </Text>
            <Box w={330} >
            <StyledSelect
              value={entityValue}
              onchange={setEntityValue}
              multi={multi}
              options={allEntitties.map((en) => {
                return { label: en.name, value: en.id };
              })}
            />
            </Box>
            </>
        ) : (
          <AlarmsList alarms={alarms} callbackFn={filterAlarms} />
        )}
       
      </Box>
    </FunctionalModalV2>
    </>
  );
}

export default AssignEntities;
