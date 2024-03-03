import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { showerror, showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import { ThemeContext } from "../../../../context/theme";
import { EditIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";
import CreateOrEditBatch from "../create-edit-batch/create-edit-batch";

function editBatch({ callBack, batch, editAction }) {
  const themeCtx = useContext(ThemeContext);
  const [name, setName] = useState(batch.name);
  const [customerName, setCustomerName] = useState(batch.customer_id);
  const [status, setStatus] = useState(batch.activation_status);
  const [devicesNumber, setDevicesNumber] = useState(batch.no_of_devices);
  const [deliveryDate, setDeliveryDate] = useState(
    batch.delivery_date.Time.slice(0, -1)
  );
  const [warrantyDate, setWarrantyDate] = useState(
    batch.warranty_end.Time.slice(0, -1)
  );
  const [createFormValid, setCreateFormValid] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        cursor={"pointer"}
        size={"sm"}
        rounded={"full"}
        bg={"primary.60"}
        onClick={onOpen}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
      >
        <EditIcon color={themeCtx.darkMode ? "#000000" : "#FFFFFF"} />
      </IconButton>

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
            onClick={() => {
              onClose(),
                setStatus(batch.activation_status),
                setDevicesNumber(batch.no_of_devices),
                setDeliveryDate(batch.delivery_date.Time.slice(0, -1)),
                setWarrantyDate(batch.warranty_end.Time.slice(0, -1));
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
        isOpen={isOpen}
        transparent
        modalTitle={`Edit ${name}`}
        modalMinH={"200px"}
        modalMinW={"50%"}
        btnAction={
          <Button
            w={"fit-content"}
            backgroundColor={"primary.80"}
            boxShadow={
              themeCtx.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 5px 7px 1px rgba(0,0,0,0.2)"
            }
            color={"text.primary"}
            _hover={{ color: "primary.100", bg: "primary.60" }}
            onClick={() => {
              let batchDetails = {
                activation_status: status,
                delivery_date: {
                  time: new Date(deliveryDate).toISOString(),
                  valid: true,
                },
                no_of_devices: parseInt(devicesNumber),
                warranty_end: {
                  time: new Date(warrantyDate).toISOString(),
                  valid: true,
                },
              };

              editAction(batch.id, batchDetails)
                .then(() => {
                  showsuccess("Successfully edited");
                  onClose();
                  callBack();
                })
                .catch((e) => {
                  showerror(e.message);
                });
            }}
            isDisabled={!createFormValid}
          >
            Edit {name}
          </Button>
        }
      >
        <CreateOrEditBatch
          setValid={setCreateFormValid}
          name={name}
          setName={setName}
          customerName={customerName}
          setCustomerName={setCustomerName}
          status={status}
          setStatus={setStatus}
          devicesNumber={devicesNumber}
          setDevicesNumber={setDevicesNumber}
          deliveryDate={deliveryDate}
          setDeliveryDate={setDeliveryDate}
          warrantyDate={warrantyDate}
          setWarrantyDate={setWarrantyDate}
          hideName={true}
          hideCustomerName={true}
        />
      </FunctionalModalV2>
    </>
  );
}
export default editBatch;
