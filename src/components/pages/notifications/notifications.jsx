import { Box, Flex, Text, Spinner, Center } from "@chakra-ui/react";
import React, { useEffect, useState, useContext } from "react";
import { SEVERITY } from "../../../data/alarms";
import {
  getNotificationsSettings,
  editNotificationsSettings,
} from "../../../api/notifications";
import { ThemeContext } from "../../../context/theme";
import NotificationsForm from "./notifications-form/notifications-form";
import { showsuccess } from "../../../helpers/toast-emitter";
import { useMediaQuery } from "@chakra-ui/react";

function Notifications() {
  const themeCtx = useContext(ThemeContext);
  const defaultObj = {
    enabled: false,
    contact_details: {
      email: "",
      sms: "",
    },
    notification_type: [],
  };
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");

  const [highData, setHighData] = useState(null);
  const [medData, setMedData] = useState();
  const [urgData, setUrgData] = useState(null);
  const [loading, setLoading] = useState(true);

  const setFormData = (notifSetting) => {
    return {
      enabled: notifSetting.notification_settings.enabled,
      contact_details: {
        email: notifSetting.notification_settings.contact_details.email
          ? notifSetting.notification_settings.contact_details.email
          : "",
        sms: notifSetting.notification_settings.contact_details.sms
          ? notifSetting.notification_settings.contact_details.sms
          : "",
      },
      notification_type: notifSetting.notification_settings.notification_type,
    };
  };

  const removeUnneededkeys = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "") {
        delete obj[key];
      }
    });
    return obj;
  };

  const highEditCall = (body) => {
    editNotificationsSettings({
      alarms: [
        {
          severity: SEVERITY.URGENT,
          notification_settings: {
            ...urgData,
            contact_details: removeUnneededkeys(urgData.contact_details),
          },
        },
        {
          severity: SEVERITY.MEDIUM,
          notification_settings: {
            ...medData,
            contact_details: removeUnneededkeys(medData.contact_details),
          },
        },
        {
          severity: SEVERITY.HIGH,
          notification_settings: {
            ...body,
            contact_details: removeUnneededkeys(body.contact_details),
          },
        },
      ],
    }).then((res) => {
      showsuccess("Successfully updated notification settings");
    });
  };
  const medEditCall = (body) => {
    editNotificationsSettings({
      alarms: [
        {
          severity: SEVERITY.URGENT,
          notification_settings: {
            ...urgData,
            contact_details: removeUnneededkeys(urgData.contact_details),
          },
        },
        {
          severity: SEVERITY.HIGH,
          notification_settings: {
            ...highData,
            contact_details: removeUnneededkeys(highData.contact_details),
          },
        },
        {
          severity: SEVERITY.MEDIUM,
          notification_settings: {
            ...body,
            contact_details: removeUnneededkeys(body.contact_details),
          },
        },
      ],
    }).then((res) => {
      showsuccess("Successfully updated notification settings");
    });
  };
  const urgEditCall = (body) => {
    editNotificationsSettings({
      alarms: [
        {
          severity: SEVERITY.HIGH,
          notification_settings: {
            ...highData,
            contact_details: removeUnneededkeys(highData.contact_details),
          },
        },
        {
          severity: SEVERITY.MEDIUM,
          notification_settings: {
            ...medData,
            contact_details: removeUnneededkeys(medData.contact_details),
          },
        },
        {
          severity: SEVERITY.URGENT,
          notification_settings: {
            ...body,
            contact_details: removeUnneededkeys(body.contact_details),
          },
        },
      ],
    }).then((res) => {
      showsuccess("Successfully updated notification settings");
    });
  };

  useEffect(() => {
    setLoading(true)
    getNotificationsSettings().then((res) => {
      setLoading(false)
      const notificationsData = res.data.message.alarms;
      setHighData(defaultObj);
      setMedData(defaultObj);
      setUrgData(defaultObj);
      notificationsData.forEach((element) => {
        switch (element.severity) {
          case SEVERITY.HIGH:
            setHighData(setFormData(element));
            break;
          case SEVERITY.MEDIUM:
            setMedData(setFormData(element));
            break;
          case SEVERITY.URGENT:
            setUrgData(setFormData(element));
            break;
          default:
            break;
        }
      });
    }).catch(()=>{
      setLoading(false)
    })
  }, []);
  
  return (
    <>
    {loading ? 
              <Center w={"100%"} h={"80vh"}>
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
            </Center>
    :
    <Box
      justifyContent={"space-between"}
      flexWrap={"wrap"}
      ml={5}
      mr={5}
      display={"flex"}
      flexDir={isNonMobile ? "row" : "column"}
    >
      <Box
        w={isNonMobile ? "49.5%" : "100%"}
        mb={5}
        bg={"primary.80"}
        borderRadius={"10px"}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,1)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <Box
          p={2}
          h={"50px"}
          as={Flex}
          justifyContent={"space-between"}
          alignItems={"center"}
          bg={"primary.60"}
          borderTopRadius={"10px"}
        >
          <Text
            color={"text.primary"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            pl={2}
          >
            High Severity
          </Text>
        </Box>
        <Box py={5} px={5}>
          {highData && (
            <NotificationsForm
              formData={highData}
              title={"High Severity"}
              disabled={false}
              saveAction={highEditCall}
            />
          )}
        </Box>
      </Box>
      <Box
        w={isNonMobile ? "49.5%" : "100%"}
        mb={5}
        bg={"primary.80"}
        borderRadius={"10px"}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,1)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <Box
          p={2}
          h={"50px"}
          as={Flex}
          justifyContent={"space-between"}
          alignItems={"center"}
          bg={"primary.60"}
          borderTopRadius={"10px"}
        >
          <Text
            color={"text.primary"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            pl={2}
          >
            Medium Severity
          </Text>
        </Box>
        <Box p={5}>
          {medData && (
            <NotificationsForm
              formData={medData}
              title={"Medium Severity"}
              disabled={false}
              saveAction={medEditCall}
            />
          )}
        </Box>
      </Box>
      <Box
        w={isNonMobile ? "49.5%" : "100%"}
        mb={5}
        bg={"primary.80"}
        borderRadius={"10px"}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,1)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <Box
          p={2}
          h={"50px"}
          as={Flex}
          justifyContent={"space-between"}
          alignItems={"center"}
          bg={"primary.60"}
          borderTopRadius={"10px"}
        >
          <Text
            color={"text.primary"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            pl={2}
          >
            Urgent Severity
          </Text>
        </Box>
        <Box p={5}>
          {urgData && (
            <NotificationsForm
              formData={urgData}
              title={"Urgent Severity"}
              disabled={false}
              saveAction={urgEditCall}
            />
          )}
        </Box>
      </Box>
    </Box>}
    </>
  );
}

export default Notifications;
