import { Box, Button } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { editGeofence } from "../../../../api/geofences";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import Map from "../../../ui/map/map";
import { ThemeContext } from "../../../../context/theme";
import { EditIcon } from "@chakra-ui/icons";

function EditGeofence({ geofences, geofence }) {
  const themeCtx = useContext(ThemeContext);
  const [polygon, setPolygon] = useState(geofence.polygon);

  const editGeoFenceAction = () => {
    editGeofence(
      geofence.id,
      polygon.map((point) => [point.lat, point.lng])
    ).then((res) => {
      showsuccess("Successfully updated geofence");
      geofence.callBack(true);
    });
  };

  return (
    <FunctionalModal
      modalTitle={`Edit ${geofence.name}`}
      btnTitle={"Edit"}
      iconBtn={EditIcon}
      btnColor={"primary.60"}
      btnSize={"md"}
      iconSize={"20px"}
      modalMinH={"700px"}
      modalMinW={"80%"}
      btnAction={
        <Button
          onClick={editGeoFenceAction}
          w={"fit-content"}
          backgroundColor={"primary.80"}
          boxShadow={
            themeCtx.darkMode
              ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
              : "3px 5px 7px 1px rgba(0,0,0,0.2)"
          }
          color={"text.primary"}
          _hover={{ color: "primary.100", bg: "primary.60" }}
        >
          Edit {geofence.name}
        </Button>
      }
    >
      <Box w={"100%"} bg={"primary.80"} my={10} borderRadius={"5px"}>
        <Map
          oldCenter={geofence.center}
          zoom={16}
          trips={false}
          geofences={geofences.map((geo) => {
            if (geo.id === geofence.id) {
              return { ...geo, editMode: true, edit: setPolygon };
            }
            return geo;
          })}
        />
      </Box>
    </FunctionalModal>
  );
}

export default EditGeofence;
