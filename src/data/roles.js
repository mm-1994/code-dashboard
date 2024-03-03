import { FiUser } from "react-icons/fi";
import { FaMapMarkedAlt, FaRoute, FaRoad } from "react-icons/fa";
import { RiDeviceLine } from "react-icons/ri";
import { BiAlarm, BiTrip } from "react-icons/bi";
import { SettingsIcon } from "@chakra-ui/icons";
import { FiClipboard } from "react-icons/fi";

export const icons = {
  General: <SettingsIcon />,
  Geofences: <FaMapMarkedAlt />,
  Devices: <RiDeviceLine />,
  Users: <FiUser />,
  "Alarm settings": <BiAlarm />,
  Routes: <FaRoute />,
  Roles: <FiClipboard />,
  "Device groups": <RiDeviceLine />,
  Trips: <FaRoad />,
};
