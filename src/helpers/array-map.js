import React from "react";
import { Icon, Box } from "@chakra-ui/react";
import { assignCytag, unAssignCytag } from "../api/device-actions";
import EditGeofence from "../components/pages/geofences/edit-geofence/edit-geofence";
import DeleteGeofence from "../components/pages/geofences/delete-geofence/delete-geofence";
import DeleteTrip from "../components/pages/routes-page/delete-trip/delete-trip";
import { EditTrips } from "../components/pages/routes-page/routes-page";
import { deleteGeofence, deleteRoute, deleteTrip } from "../api/geofences";
import {
  deleteBatch,
  editBatch,
  editPaymentLogs,
  editOrder,
} from "../api/billing-system";

import { GEOFENCE_TYPE, SEVERITY } from "../data/alarms";
import { assignAlarmSettingToEntity } from "../api/alarms";
import AssignEntities from "../components/pages/alarms-settings/assign-entities/assign-entities";
import EditAlarmSetting from "../components/pages/alarms-settings/edit-alarm-setting/edit-alarm-setting";
import { AlarmAction } from "../components/pages/dashboard/dashboard";
import moment from "moment-timezone";
import { FaLock, FaLockOpen } from "react-icons/fa";
import CytagChip from "../components/ui/cytag-chip/cytag-chip";
import DeleteAlarmSetting from "../components/pages/alarms-settings/delete-alarm-settings/delete-alarm-settings";
import { hasPermission } from "./permissions-helper";
import { PERMISSIONS } from "../types/devices";
import DeleteBatch from "../components/pages/billing-system/delete/delete";
import EditBatch from "../components/pages/billing-system/edit-batch/edit-batch";
import EditPaymentLog from "../components/pages/billing-system/edit-payment-log/edit-payment-log";
import EditOrder from "../components/pages/billing-system/edit-order/edit-order";

export function extractUniqueKeys(data) {
  const keys = [];
  data.forEach((item) => {
    keys.push(...Object.keys(item));
  });
  return Array.from(new Set(keys)).reverse();
}

export function sortHeaders(headers) {
  let timekey = "";
  let devicekey = "";
  const keys = [];
  const res = [];
  headers.forEach((header) => {
    if (switchSortWeight(header) === 1) {
      timekey = header;
    } else if (switchSortWeight(header) === 2) {
      devicekey = header;
    } else {
      keys.push(header);
    }
  });
  if (devicekey.length !== 0) {
    res.push(devicekey);
  }
  if (timekey.length !== 0) {
    res.push(timekey);
  }
  res.push(...keys);
  return res;
}

export function switchSortWeight(header) {
  switch (header) {
    case "device":
      return 2;
    case "date":
    case "start_time":
    case "updated_time":
    case "offload_time":
    case "assign_time":
    case "timestamp":
    case "message_time":
      return 1;
    default:
      return 99;
  }
}

export function extractTelemetryHeaders(data = [], alarms) {
  return data.length !== 0
    ? extractUniqueKeys(data)
        .sort()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchMainHeader(key, props),
            isSorted: false,
            isSortedDesc: false,
          };
        })
    : [];
}

export function extractContainerHeaders(data = [], alarms) {
  return data.length !== 0
    ? extractUniqueKeys(data)
        .sort()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchMainHeader(key, props),
          };
        })
    : [];
}
export function extractHeadersDefault(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) => switchMainHeader(key, props),
        };
      })
    : [];
}

export function extractHeaders(data = [], alarms) {
  return data.length !== 0
    ? Object.keys(data[0])
        .reverse()
        .map((key) => {
          return {
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            Cell: (props) => switchMainHeader(key, props),
          };
        })
    : [];
}

export function extractNestedHeaders(data = [], hiddenCols) {
  const res = [];
  if (data.length !== 0) {
    Object.keys(data[0]).forEach((key) => {
      if (!hiddenCols.find((coll) => coll === key)) {
        if (typeof data[0][key] === "object" && data[0][key]) {
          const keys = [];
          Object.keys(data[0][key]).forEach((subKey) => {
            keys.push({
              Header: subKey.toUpperCase().replaceAll("_", " "),
              accessor: subKey,
              Cell: (props) => switchMainHeader(key, props),
            });
          });
          res.push({
            Header: key.toUpperCase().replaceAll("_", " "),
            columns: keys,
            accessor: key,
          });
        } else {
          res.push({
            Header: key.toUpperCase().replaceAll("_", " "),
            accessor: key,
            columns: [
              {
                Header: "",
                accessor: key,
                Cell: (props) => switchMainHeader(key, props),
              },
            ],
          });
        }
      }
    });
    return res;
  } else {
    return [];
  }
}
export function formatDate(date) {
  return moment(date + "Z")
    .utcOffset(moment().utcOffset())
    .format("DD/MM/YYYY, HH:mm:ss");
}

export function formatLocalToISOUTC(date) {
  return moment(date).utc().toISOString().replace("Z", "");
}

export function sortAlpabitcally(a, b, propertyName, DESC) {
  const propertyA = a[propertyName].toUpperCase();
  const propertyB = b[propertyName].toUpperCase();
  if (propertyA.length !== propertyB.length) {
    return DESC
      ? propertyA.length < propertyB.length
      : propertyA.length > propertyB.length;
  } else {
    return DESC ? propertyA < propertyB : propertyA > propertyB;
  }
}

export function switchMainHeader(key, props) {
  if (key.includes("inspect") && !key.includes("duration")) {
    return String(formatDate(props.value));
  } else {
    switch (key) {
      case "cytags":
        return (
          <CytagChip
            showOnly={props.value.showOnly}
            cycollectorId={props.row.original.id}
            assignAction={assignCytag}
            unAssignAction={unAssignCytag}
          />
        );
      case "Lock feedback":
        return String(props.value === "1" ? "Locked" : "Unlocked");
      case "lock_status":
        return (
          <Box
            w={"100%"}
            h={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <Icon
              color={"action.100"}
              boxSize={5}
              ml={9}
              as={props.value === "true" ? FaLock : FaLockOpen}
          />
          </Box>
        );
      case "date":
      case "start_time":
      case "start_date":
      case "end_date":
      case "updated_time":
      case "offload_time":
      case "assign_time":
      case "release_time":
      case "timestamp":
      case "warranty_end":
        return props.value.Time
          ? String(formatDate(props.value.Time.slice(0, -1)))
          : String(formatDate(props.value));
      case "edit_payment":
        return (
          <EditPaymentLog
            editAction={editPaymentLogs}
            paymentLog={props.value.value}
            callBack={props.value.callBack}
          />
        );
      case "edit_order":
        return (
          <EditOrder
            editAction={editOrder}
            order={props.value.value}
            callBack={props.value.callBack}
          />
        );
      case "Edit":
        return (
          <EditBatch
            editAction={editBatch}
            batch={props.value.value}
            callBack={props.value.callBack}
          />
        );
      case "Delete":
        return (
          <DeleteBatch
            deleteAction={deleteBatch}
            id={props.value.value.id}
            callBack={props.value.callBack}
            name={props.value.value.name}
          />
        );
      case "nrc":
        return props.value.Float64;
      case "start_date":
        return String(formatDate(props.value.slice(0, -1)));
      case "end_date":
        return String(formatDate(props.value.slice(0, -1)));
      case "delivery_date":
        return String(formatDate(props.value.Time.slice(0, -1)));
      case "message_time":
        return String(formatDate(props.value));
      case "confirmation_date":
        return String(formatDate(props.value.Time.slice(0, -1)));
      case "due_date":
        return String(formatDate(props.value.slice(0, -1)));
      case "route":
        if (props.value) {
          return props.value.name;
        }
        return "N/A";
      default:
        return String(props.value);
    }
  }
}

export function extractGeoHeaders(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) =>
            key === "Geofence_Actions" ? (
              <>
                {hasPermission(PERMISSIONS.EDIT_GEOFENCES) && (
                  <EditGeofence
                    geofence={props.value.geofence}
                    geofences={props.value.geofences}
                  />
                )}
                {hasPermission(PERMISSIONS.DELETE_GEOFENCES) && (
                  <DeleteGeofence
                    deleteAction={deleteGeofence}
                    id={props.value.geofence.id}
                    callBack={props.value.geofence.callBack}
                    name={props.value.geofence.name}
                  />
                )}
              </>
            ) : (
              props.value
            ),
        };
      })
    : [];
}

export function extractTripHeaders(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) => {
            switch (key) {
              case "start_date":
              case "end_date":
              case "created_at":

              case "updated_at":
                return String(formatDate(props.value));
              case "trip_actions":
                return (
                  <Box display={"flex"} flexDir={"row"} gap={5}>
                    <EditTrips
                      trip={props.value.trip}
                      callBack={props.value.trip.callBack}
                    />
                    <DeleteTrip
                      deleteAction={deleteTrip}
                      id={props.value.trip.id}
                      callBack={props.value.trip.callBack}
                      name={"Trip"}
                    />
                  </Box>
                );
              case "status":
                return (
                  props.value.charAt(0).toUpperCase() + props.value.slice(1)
                ).replace("_", " ");
              case "route":
                if (props.value) {
                  return props.value.name;
                }
              default:
                return String(props.value);
            }
          },
        };
      })
    : [];
}

export function extractRouteHeaders(data = []) {
  return data.length !== 0
    ? Object.keys(data[0]).map((key) => {
        return {
          Header: key.toUpperCase().replaceAll("_", " "),
          accessor: key,
          Cell: (props) =>
            key === "Route_Actions" ? (
              <>
                <DeleteGeofence
                  deleteAction={deleteRoute}
                  id={props.value.geofence.id}
                  callBack={props.value.geofence.callBack}
                  name={props.value.geofence.name}
                />
              </>
            ) : (
              props.value
            ),
        };
      })
    : [];
}

export function mapThreatToProgress(threat) {
  switch (threat) {
    case "Critical":
      return 100;
    case "Major":
      return 75;
    default:
      return 50;
  }
}

export function extractAlarmHeaders(data = []) {
  if (data.length !== 0) {
    let keys = [];
    [...data].forEach((datum) => keys.push(...Object.keys(datum)));
    let res = [];
    Array.from(new Set(keys)).forEach((key) => {
      res.push({
        Header:
          key === "Acknowledge"
            ? "ACK."
            : key.toUpperCase().replaceAll("_", " "),
        accessor: key,
        Cell: (props) => switchAlarmsTableFields(key, props),
      });
    });
    return res;
  } else {
    return [];
  }
}

export function prepareTitle(text) {
  return (
    text[0].toUpperCase() + text.slice(1, text.length).replaceAll("_", " ")
  );
}

export function switchAlarmsTableFields(field, props) {
  if (typeof props.value !== undefined) {
    let index = 0;
    switch (field) {
      case "severity":
        return (
          <Box
            w={"100%"}
            textAlign={"start"}
            display={"flex"}
            alignItems={"center"}
            fontWeight={"bold"}
            color={mapThreatToColor(props.value)}
          >
            {props.value[0].toUpperCase() + props.value.slice(1)}
          </Box>
        );
      case "entities":
        return (
          <AssignEntities
            type={props.value.type}
            assignAction={assignAlarmSettingToEntity}
            mainId={props.row.original.id}
            assignedEntities={props.value.value}
            alarmTypes={props.value.alarmTypes}
            callback={props.value.callback}
          />
        );

      case "edit":
        return (
          <EditAlarmSetting
            alarmTypes={props.value.alarmTypes}
            alarm={props.value.alarm}
            callback={props.value.callback}
          />
        );
      case "delete":
        return (
          <DeleteAlarmSetting
            alarmSetting={props.value.alarmSetting}
            callback={props.value.callback}
            alarmTypes={props.value.alarmTypes}
          />
        );

      case "Acknowledge":
        return (
          <AlarmAction
            acknowldgeAction={true}
            actionPerformed={props.value.actionPerformed}
            alarm={props.value.alarm}
            callback={props.value.callback}
          />
        );
      case "Clear":
        return (
          <AlarmAction
            acknowldgeAction={false}
            actionPerformed={props.value.actionPerformed}
            alarm={props.value.alarm}
            callback={props.value.callback}
          />
        );
      case "alarm_details":
        return (
          <Box
            key={index}
            width={"100%"}
            display={"flex"}
            fontWeight={"bold"}
            color={"text.primary"}
            gap={3}
            fontSize={"sm"}
            justifyContent={"space-between"}
          >
            {Object.keys(props.value).map((key) => {
              return (
                <Box
                  h={"50px"}
                  textAlign={"start"}
                  rounded={"md"}
                  isTruncated
                  width={"100%"}
                  minW={"fit-content"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                >
                  {key === "geofence_type"
                    ? `${GEOFENCE_TYPE[props.value[key]].replace(
                        "geofence",
                        ""
                      )}`
                    : prepareTitle(key) === "Geofence name" ||
                      prepareTitle(key) === "Tamper" ||
                      prepareTitle(key) === "Undetected tag" ||
                      prepareTitle(key).includes("Battery") ||
                      prepareTitle(key).includes("Assigned")
                    ? props.value[key]
                    : prepareTitle(key) === "Lat"
                    ? `(${props.value[key]},`
                    : prepareTitle(key) === "Lng"
                    ? `${props.value[key]})`
                    : `${prepareTitle(key)}: ${props.value[key]}`}
                </Box>
              );
            })}
          </Box>
        );
      case "type":
        if (props.value.includes("Cylock Battery")) return "CyLock Battery";
        if (props.value.includes("CyTag Battery")) return "CyTag Battery";
        return (
          props.value[0].toUpperCase() +
          props.value.slice(1, props.value.length).replaceAll("_", " ")
        );
      case "start_time":
      case "updated_time":
        return String(formatDate(props.value));
      default:
        return (
          props.value.toString()[0].toUpperCase() +
          props.value
            .toString()
            .slice(1, props.value.toString().length)
            .replaceAll("_", " ")
        );
    }
  }
}

export function formatDateOps(date, format) {
  return moment(date + "Z")
    .utcOffset(moment().utcOffset())
    .format(format);
}

export function searchObjects(array, searchTerm) {
  const filtered = [];
  array.forEach((obj) => {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      const key = Object.keys(obj)[i];
      if (
        typeof obj[key] !== "object" &&
        (obj[key] + "").length !== 0 &&
        (obj[key] + "").toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        filtered.push(obj);
        break;
      }
    }
  });
  return filtered;
}

export function mapThreatToColor(threat) {
  switch (threat) {
    case SEVERITY.URGENT:
      return "#780000";
    case SEVERITY.HIGH:
      return "#dc0000";
    case SEVERITY.MEDIUM:
      return "#fd8c00";
    default:
      return "#fdc500";
  }
}

export function getPage(data, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

export function mapToKeyValPair(objects) {
  const arrrr = Object.entries(objects).map((obj) => {
    return { value: obj[1] + "", label: obj[0] + "" };
  });
  return arrrr;
}

export function findVlaById(objects, id) {
  let val = "";
  try {
    val = mapToKeyValPair(objects).find((obj) => obj.id === id + "").val;
  } catch (error) {
    console.error(error);
  }
  return val;
}

export function flattenObject(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (
      typeof object[key] === "object" &&
      !Array.isArray(object[key]) &&
      object[key]
    ) {
      Object.keys(object[key]).forEach((smallKey) => {
        if (smallKey !== "id") {
          if (
            typeof object[key][smallKey] === "object" &&
            !Array.isArray(object[key][smallKey]) &&
            object[key][smallKey]
          ) {
            Object.keys(object[key][smallKey]).forEach((smallerKey) => {
              if (smallerKey !== "id") {
                newObject[smallerKey] = object[key][smallKey][smallerKey];
              }
            });
          } else {
            newObject[smallKey] = object[key][smallKey];
          }
        }
      });
    } else {
      newObject[key] = object[key];
    }
  });
  return newObject;
}
