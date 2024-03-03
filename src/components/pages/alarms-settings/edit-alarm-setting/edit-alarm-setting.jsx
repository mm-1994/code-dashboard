import React, { useContext, useEffect, useState } from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { editAlarmSetting } from "../../../../api/alarms";
import {
  createAlarmSettingSchema,
  getAlarmSettingUiSchema,
  getFormsWidgets,
} from "../../../../data/alarms";
import { EditIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";
import { showsuccess } from "../../../../helpers/toast-emitter";
import {
  Box,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import { DevicesContext } from "../../../../context/devices";
import ObjectFieldTemplate from "../../../form-widgets/custom-object";
import { ThemeContext } from "../../../../context/theme";

function EditAlarmSetting({ alarm, callback, alarmTypes }) {
  const [schema, setSchema] = useState({});
  const formRef = React.useRef(null);
  const [alarmSetting] = useState(alarm);
  const [formData, setFormData] = useState({});
  const deviceCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);
  const setDefaultValues = (formdata, alarmSetting) => {
    formdata.severity = alarmSetting.severity;
    formdata.alarm_type = alarmSetting.alarm_type.name;
    formdata.enabled = alarmSetting.enabled;
    if (alarmSetting.configurations) {
      Object.keys(alarmSetting.configurations).forEach(
        (key) => (formdata[key] = alarmSetting.configurations[key])
      );
    }
    return formdata;
  };
  useEffect(() => {
    if (alarmTypes) {
      setSchema(
        createAlarmSettingSchema(
          alarmTypes,
          deviceCtx.geofences || [],
          deviceCtx.routes || []
        )
      );
      setFormData(setDefaultValues(formData, alarmSetting));
    }
  }, [deviceCtx]);
  const editAlarmSettingCall = (data) => {
    const editObj = {};
    if (data.severity !== alarm.severity) {
      editObj.severity = data.severity;
      delete data.severity;
    }
    if (data.enabled !== alarm.enabled) {
      editObj.enabled = data.enabled;
      delete data.enabled;
    }
    const configurations = {};
    Object.keys(alarm.configurations).forEach((key) => {
      if (key !== "alarm_type") {
        configurations[key] = data[key];
      }
    });
    if (Object.keys(configurations).length !== 0) {
      Object.keys(configurations).forEach((key) => {
        if (configurations[key] !== alarm.configurations[key]) {
          editObj.configurations = configurations;
        }
      });
    }
    editAlarmSetting({ alarm_settings_id: alarm.id, ...editObj }).then(
      (res) => {
        showsuccess("Successfully edited alarm setting");
        callback(alarmTypes);
        onClose();
      }
    );
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box w='100%'    pl={2}>
              <IconButton
         onClick={onOpen}
         size={"sm"}
          rounded={"full"}
          bg={'primary.60'}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,1)"
              : "5px 7px 15px 1px rgba(0,0,0,0.3)"
          }
          icon={<Icon  boxSize={"20px"}  as={EditIcon} color={"primary.100"} />}
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
              onClick={onClose}
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            />
        }
        isOpen={isOpen}
        modalTitle={"Edit Configurations"}
        modalMinH={"100%"}
        footer={true}
        modalMinW={"70%"}
        onClose={onClose}
      >
        <Box pb={4}>
        <Form
          showErrorList={false}
          ref={formRef}
          formData={formData}
          schema={schema}
          validator={validator}
          onSubmit={() => editAlarmSettingCall(formRef.current.state.formData)}
          uiSchema={getAlarmSettingUiSchema(
            alarm.alarm_type.uneditable_fields,
            true
          )}
          widgets={getFormsWidgets()}
          templates={{ ObjectFieldTemplate }}
        />
        </Box>
      </FunctionalModalV2>
    </Box>
  );
}

export default EditAlarmSetting;
