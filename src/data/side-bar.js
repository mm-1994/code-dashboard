import {
  MdHome,
  MdAssessment,
  MdNotifications,
  MdPerson,
  MdAssignmentLate,
  MdGroupWork,
} from "react-icons/md";
import { FaMapMarkedAlt, FaRoute, FaMoneyBill } from "react-icons/fa";
import { RiAlarmFill, RiDeviceFill } from "react-icons/ri";
import { hasPermission } from "../helpers/permissions-helper";
import { PERMISSIONS } from "../types/devices";
import { BiSupport } from "react-icons/bi";

export const sideBarData = {
  data: [
    {
      id: 1,
      name: "Dashboard",
      path: "/",
      icon: MdHome,
      choices: [
        { key: "cyconnectors", name: "Cyconnectors" },
        { key: "cylocks", name: "CyLocks" },
      ],
    },
    {
      id: 2,
      name: "Reports",
      path: "/reports",
      icon: MdAssessment,
    },

    {
      id: 6,
      name: "Notification Settings",
      path: "/notifications",
      icon: MdNotifications,
    },
    {
      id: 7,
      name: "Devices Management",
      path: "/devices",
      icon: RiDeviceFill,
    },
    {
      id: 12,
      name: "Billing",
      path: "/billing",
      icon: FaMoneyBill,
    },
    {
      id: 11,
      name: "Support",
      path: "/support",
      icon: BiSupport,
    },
  ],
};

if (hasPermission(PERMISSIONS.GET_DEVICE_GROUP)) {
  sideBarData.data.push({
    id: 9,
    name: "Device Groups",
    path: "/view-device-groups",
    icon: MdGroupWork,
  });
}

if (hasPermission(PERMISSIONS.GET_SUPER_ROLES)) {
  sideBarData.data.push({
    id: 8,
    name: "User Roles",
    path: "/view-roles",
    icon: MdAssignmentLate,
  });
}

if (
  hasPermission(PERMISSIONS.GET_ALARMS_SETTINGS) &&
  hasPermission(PERMISSIONS.GET_ALARMS_TYPES)
) {
  sideBarData.data.push({
    id: 5,
    name: "Alarms Settings",
    path: "/alarms-settings",
    icon: RiAlarmFill,
  });
}

if (hasPermission(PERMISSIONS.GET_ROUTES)) {
  sideBarData.data.push({
    id: 4,
    name: "Routes",
    path: "/routes",
    icon: FaRoute,
  });
}

if (hasPermission(PERMISSIONS.GET_GEOFENCES)) {
  sideBarData.data.push({
    id: 3,
    name: "GeoFences",
    path: "/geofences",
    icon: FaMapMarkedAlt,
  });
}

if (hasPermission(PERMISSIONS.GET_USERS)) {
  sideBarData.data.push({
    id: 10,
    name: "User Management",
    path: "/users",
    icon: MdPerson,
  });
}

sideBarData.data.sort((a, b) => a.id - b.id);
