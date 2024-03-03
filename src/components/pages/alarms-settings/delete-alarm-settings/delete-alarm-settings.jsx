import React, { useEffect, useState, useContext } from "react";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import { AlarmAction } from "../../dashboard/dashboard";
import { formatDate } from "../../../../helpers/array-map";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteAlarmSettings } from "../../../../api/alarms";
import { showsuccess } from "../../../../helpers/toast-emitter";
import { ThemeContext } from "../../../../context/theme";
import { useMediaQuery } from "@chakra-ui/react";

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

function DeleteAlarmSetting({ alarmSetting, callback, alarmTypes }) {
  const themeCtx = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");

  const [alarms, setAlarms] = useState([]);
  const filterAlarms = (alarmId) => {
    setAlarms([...alarms.filter((alarm) => alarm.id !== alarmId)]);
  };
  const deleteAlarmSettingCall = () => {
    deleteAlarmSettings(alarmSetting.id)
      .then(() => {
        showsuccess("successfully deleted alarm setting");
        callback(alarmTypes);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setAlarms(err.response.data.data);
        }
      });
  }; 
  return (
    <Box w={'100%'} pl={4}>
      <FunctionalModal
        iconBtn={DeleteIcon}
        modalTitle={"Delete alarm setting"}
        btnColor={"primary.60"}
        cancelable={true}
        modalMinW={isNonMobile ? "fit-content" : "200px"}
        reset={()=> {setAlarms([])}}
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
            onClick={deleteAlarmSettingCall}
          >
            Delete
          </Button>
        }
      >
        {alarms.length === 0 ? (
                <Text
                color={"text.primary"}
                textAlign={"center"}
                fontWeight={"bold"}
                py={20}
              >
                Are you sure you want to delete this alarm setting?
              </Text>
        ) : (
          <AlarmsList alarms={alarms} callbackFn={filterAlarms} />
        )}

      </FunctionalModal>
    </Box>
  );
}
export default DeleteAlarmSetting;
