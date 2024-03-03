import React, { useContext, useEffect, useState } from "react";
import {
  createAlarmSetting,
  getAlarmSettings,
  getAlarmsTypes,
} from "../../../api/alarms";
import { Box, Button, Flex, useDisclosure, IconButton } from "@chakra-ui/react";
import ComplexTable from "../../ui/table/complex-table";
import { Icon } from "@chakra-ui/icon";
import { BiAlarm } from "react-icons/bi";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { BiX } from "react-icons/bi";

import {
  createAlarmSettingSchema,
  getAlarmSettingUiSchema,
  getFormsWidgets,
} from "../../../data/alarms";
import { showsuccess } from "../../../helpers/toast-emitter";
import { extractAlarmHeaders, flattenObject } from "../../../helpers/array-map";
import { capatalizeName } from "../../../helpers/string-operations";
import ObjectFieldTemplate from "../../form-widgets/custom-object";
import FunctionalModalV2 from "../../ui/functional-modal-v2/functional-modal-v2";
import { DevicesContext } from "../../../context/devices";
import { DEVICES, PERMISSIONS } from "../../../types/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import { ThemeContext } from "../../../context/theme";
const NO_TYPE_SELECTED = "choose a type";
const UNDETECTED_TAG = "undetected_tag";

function AlarmsSettings() {
  const [alarmTypes, setAlarmTypes] = useState(undefined);
  const [schema, setSchema] = useState({});
  const formRef = React.useRef(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alarmSetting, setAlarmSetting] = useState(undefined);
  const deviceCtx = useContext(DevicesContext);
  const theme = useContext(ThemeContext);
  const hiddenCols = [
    "id",
    "uneditable_fields",
    "notification_settings",
    "message_types",
  ];
  if (!hasPermission(PERMISSIONS.EDIT_ALARMS_SETTINGS)) {
    hiddenCols.push("edit");
  }
  if (!hasPermission(PERMISSIONS.ASSIGN_ALARMS_SETTINGS)) {
    hiddenCols.push("entities");
  }
  const findDeviceTypes = (msgTypes) => {
    let cylockFlag = false;
    let cytagFlag = false;
    msgTypes.forEach((type) => {
      type.device_types.forEach((dev) => {
        if (dev.name === DEVICES.CYCOLLECTOR) {
          cylockFlag = true;
        } else if (dev.name === DEVICES.CYTAG) {
          cytagFlag = true;
        }
      });
    });
    if ((cylockFlag && cytagFlag) || (!cylockFlag && !cytagFlag)) {
      return "";
    }
    if (cylockFlag && !cytagFlag) {
      return DEVICES.CYCOLLECTOR;
    }
    if (!cylockFlag && cytagFlag) {
      return DEVICES.CYTAG;
    }
  };
  const getAlarmSettingsCall = (allalarmTypes) => {
    setLoading(true);
    getAlarmSettings()
      .then((settingRes) => {
        setLoading(false);
        setAlarmSetting(
          settingRes.data.map((o) => {
            const newObj = flattenObject(o);
            return {
              ...newObj,
              entities: {
                callback: getAlarmSettingsCall,
                alarmTypes: allalarmTypes,
                value: newObj.entities,
                type:
                  newObj.name === UNDETECTED_TAG
                    ? DEVICES.CYTAG
                    : findDeviceTypes(newObj.message_types),
              },
              edit: {
                alarm: o,
                callback: getAlarmSettingsCall,
                alarmTypes: allalarmTypes,
              },
              delete: {
                alarmSetting: o,
                callback: getAlarmSettingsCall,
                alarmTypes: allalarmTypes,
              },
            };
          })
        );
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    deviceCtx.getDevicesCall();
  }, []);

  useEffect(() => {
    if (!alarmTypes) {
      getAlarmsTypes().then((res) => {
        const allalarmTypes = [
          ...res.data.map((t) => {
            return {
              ...t,
              configurations_schema: {
                ...t.configurations_schema,
                title: t.name,
              },
            };
          }),
        ];
        const alarmTypesFiltered = [];
        allalarmTypes.forEach((alarmtype) => {
          if (alarmtype.name === "geofence") {
            if (
              alarmtype.configurations_schema.properties.geofence_name.enum
                .length !== 0
            ) {
              alarmTypesFiltered.push(alarmtype);
            }
          } else if (
            alarmtype.name !== "out_of_route" &&
            alarmtype.name !== "connectivity"
          ) {
            alarmTypesFiltered.push(alarmtype);
          }
        });
        console.log("AA", alarmTypesFiltered);
        setAlarmTypes(alarmTypesFiltered);
      });
    }
  }, []);

  useEffect(() => {
    if (alarmTypes !== undefined) {
      getAlarmSettingsCall(alarmTypes);
    }
  }, [alarmTypes]);

  useEffect(() => {
    if (alarmTypes !== undefined) {
      setSchema(
        createAlarmSettingSchema(
          alarmTypes,
          deviceCtx.geofences || [],
          deviceCtx.routes || []
        )
      );
    }
  }, [alarmTypes, deviceCtx]);

  useEffect(() => {
    if (update) {
      setUpdate(false);
      getAlarmSettings().then((settingRes) => {
        setAlarmSetting(
          settingRes.data.map((o) => {
            const newObj = flattenObject(o);
            return {
              ...newObj,
              entities: {
                value: newObj.entities,
                type:
                  newObj.name === UNDETECTED_TAG
                    ? DEVICES.CYTAG
                    : findDeviceTypes(newObj.message_types),
              },
              edit: { alarm: o, alarmTypes: alarmTypes },
              delete: {
                alarmSetting: o,
                callback: getAlarmSettingsCall,
                alarmTypes: alarmTypes,
              },
            };
          })
        );
      });
      setSchema(
        createAlarmSettingSchema(
          alarmTypes,
          deviceCtx.geofences || [],
          deviceCtx.routes || []
        )
      );
    }
  }, [update]);

  const createAlarmSettingCall = (data) => {
    const alarmType = alarmTypes.find(
      (type) => type.name === data.alarm_type
    ).id;
    if (data.alarm_type === "CyLock Battery") {
      data.telemetry_type = "Cylock Battery";
    }
    if (data.alarm_type === "CyTag Battery") {
      data.telemetry_type = "battery";
    }
    delete data.alarm_type;
    const severity = data.severity;
    delete data.severity;
    const enabled = data.enabled ? data.enabled : false;
    delete data.enabled;
    createAlarmSetting(alarmType, data, severity, enabled).then((res) => {
      setUpdate(true);
      onClose();
      showsuccess("Added new settings");
    });
  };
  const { isOpen, onOpen, onClose } = useDisclosure({
    id: "modal-alarm-settings",
  });

  return (
    <>
      <Box mb={5} pr={5} as={Flex} justifyContent={"end"}>
        {hasPermission(PERMISSIONS.CREATE_ALARMS_SETTINGS) && (
          <Button
            color={"text.primary"}
            bg={"primary.60"}
            boxShadow={
              theme.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
            onClick={onOpen}
          >
            Create Alarm Configurations
          </Button>
        )}

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
                theme.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            />
          }
          isOpen={isOpen}
          modalTitle={"Create Alarm Configurations"}
          modalMinH={"100%"}
          footer={true}
          modalMinW={"70%"}
        >
          <Box pb={3}>
            <Form
              showErrorList={false}
              ref={formRef}
              formData={
                formRef.current
                  ? { ...formRef.current.state.formData }
                  : { alarm_type: -1 }
              }
              schema={schema}
              validator={validator}
              onSubmit={() =>
                createAlarmSettingCall(
                  formRef.current && formRef.current.state.formData
                )
              }
              uiSchema={getAlarmSettingUiSchema(
                [],
                false,
                deviceCtx && deviceCtx.geofences ? deviceCtx.geofences : [],
                deviceCtx && deviceCtx.routes ? deviceCtx.routes : []
              )}
              widgets={getFormsWidgets()}
              templates={{ ObjectFieldTemplate }}
            />
          </Box>
        </FunctionalModalV2>
      </Box>
      {alarmTypes &&
        alarmTypes.map((type, index) => {
          return (
            type.name !== NO_TYPE_SELECTED && (
              <Box key={index} px={5} mb={2}>
                <ComplexTable
                  customPageSize={10}
                  data={
                    alarmSetting &&
                    alarmSetting.filter((sett) => sett.name === type.name)
                  }
                  extractFn={extractAlarmHeaders}
                  hiddenCols={hiddenCols}
                  loading={loading}
                  title={
                    capatalizeName(type.name).replaceAll("_", " ") +
                    " Alarm Settings"
                  }
                  icon={
                    <Icon as={BiAlarm} boxSize={"30px"} color={"action.100"} />
                  }
                />
              </Box>
            )
          );
        })}
    </>
  );
}

export default AlarmsSettings;
