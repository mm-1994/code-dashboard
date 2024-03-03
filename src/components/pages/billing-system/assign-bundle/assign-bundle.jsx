import { IconButton, useDisclosure, Button ,Box,Text} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { default as React, useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../context/theme";
import FunctionalModalV2 from "../../../ui/functional-modal-v2/functional-modal-v2";
import StyledSelect from "../../../ui/styled-select/styled-select";
import { assignBundle } from "../../../../api/billing-system";
import { showsuccess, showerror } from "../../../../helpers/toast-emitter";


function AssignBundle({customers,bundle,callBack}) {
  const themeCtx = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer,setSelectedCustomer]=useState([])

const setOldCustomer=()=>{
  let oldCustomers=[]
  bundle.assigned_customers.map((customer)=>{
    oldCustomers.push({label:customer.customer,value:customer.customer_id})
  })
  setSelectedCustomer(oldCustomers)
}

  useEffect(()=>{
   setOldCustomer()
  },[])

const setAssignBundle=()=>{
  let customersToSend=[]
  selectedCustomer.map((customer)=>{
    customersToSend.push({customer_id:customer.value,customer_name:customer.label})
  })
  assignBundle({bundle_id:bundle.bundle_id,assigned_customers:customersToSend}).then(() => {
    onClose();
    callBack()
    showsuccess("Assigned Bundle Successfully");
  })
  .catch((e) => showerror(e.message))
}




  return (
    <>
      <Button
        bg={"primary.60"}
        color={"text.primary"}
        width={120}
        _hover={{ bg: "primary.60" }}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
        }
        onClick={onOpen}
      >
        Assign
      </Button>
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
            
              setOldCustomer()
              onClose();
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
        isOpen={isOpen}
        modalTitle={"Assign Bundle"}
        modalMinH={"550px"}
        modalMinW={"30%"}
        transparent
        btnAction={
          <Button
            bg={"primary.80"}
            color={"text.primary"}
            width={120}
            _hover={{ bg: "primary.60" }}
            onClick={()=>{setAssignBundle()}}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            Assign
          </Button>
        }

      >


<Box  p={1}>
          <Text p={1} color={"text.primary"} fontWeight={"bold"}>
            Choose Customer:
          </Text>
          <StyledSelect
            multi
            value={selectedCustomer}
            general={true}
            options={customers}
            onchange={(e)=>{console.log(e)
              setSelectedCustomer(e)}}
            disabled={true}
          />
        </Box>

        </FunctionalModalV2>
    </>
  );
}

export default AssignBundle;
