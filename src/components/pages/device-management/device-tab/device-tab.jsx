import React from "react";
import ComplexTable from "../../../ui/table/complex-table";
import { capatalizeName } from "../../../../helpers/string-operations";
import { getDeviceIdentifier } from "../../../../data/device-form";
import { useNavigate } from "react-router";
import { DEVICES } from "../../../../types/devices";
import { sortAlpabitcally } from "../../../../helpers/array-map";

function DeviceTab({
  type,
  deviceList,
  CreateDevice,
  loading
}) {
  const navigate = useNavigate();
  const redirectToCytag = (row) => {
    return navigate(
      "/device/Cytag/" +
        row.find((col) => col.column.Header === "NAME").value +
        "/" +
        row.find((col) => col.column.Header === "ID").value
    );
  };
  const redirectToDevice = (row) => {
    return navigate(
      "/device/" +
        row.find((col) => col.column.Header === "ATTACHED TO").value +
        "/" +
        row.find((col) => col.column.Header === "NAME").value +
        "/" +
        row.find((col) => col.column.Header === "ID").value
    );
  };
  return (
    <>
      <ComplexTable
        hiddenCols={[
          "pccw_iccid",
          "satcom_iccid",
          "lat",
          "lng",
          "lock_status",
          "Battery",
          "latest_values",
          "cylock_battery_timestamp",
          "communication_type_timestamp",
          "lat_timestamp",
          "lng_timestamp",
          "location_type_timestamp",
        ]}
        title={capatalizeName(type) + "s"}
        data={deviceList.sort((a,b) => sortAlpabitcally(a,b,'name',false))}
        redirectToDevice={type === DEVICES.CYLOCK ? redirectToDevice : redirectToCytag}
        idLabel={getDeviceIdentifier(type)}
        type={type}
        CreateDevice={CreateDevice}
        loading={loading}
      >
      </ComplexTable>
    </>
  );
}

export default DeviceTab;
