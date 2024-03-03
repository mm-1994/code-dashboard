import React, { useState, useEffect,useContext } from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  Icon,
  Spinner
} from "@chakra-ui/react";
import RolesAccordion from "../../../ui/roles-accordion/roles-accordion";
import { EditIcon, DeleteIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { getSuperRole, editSuperRole, deleteSuperRole } from "../../../../api/roles-management";
import { getMyUser } from "../../../../api/user-management";
import { useParams } from "react-router-dom";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import { useNavigate } from "react-router";
import { PERMISSIONS } from '../../../../types/devices';
import { hasPermission } from '../../../../helpers/permissions-helper';
import { ThemeContext } from "../../../../context/theme";

import "./edit-role.css";

function EditRole() {
  const themeCtx=useContext(ThemeContext)
  const [rolesSelected, setRolesSelected] = useState([]);
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [RolesGroups, setRolesGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSuperRole(id).then((res) => {
      setRolesSelected(res.data.data.roles_ids);
      if(res.data.data.admin){
        setIsAdmin(true)
      }else{
        setIsAdmin(false)
      }
    });

    getMyUser().then((res) => {
      setRolesGroupes(res.data.grouped_roles);
      setLoading(false);
    }).catch(()=>   {setLoading(false);
  });
  }, [id]);

  const handleEditRole = () => {
    editSuperRole(parseInt(id), rolesSelected).then((res) => {
      setIsDisabled(true);
      showsuccess("Successfully edited super role");
      setLoading(true);
      getSuperRole(id).then((res) => {
        setRolesSelected(res.data.data.roles_ids);
        setLoading(false);
      });
    });
  };

  const handleDeleteRole = () => {
    deleteSuperRole(parseInt(id)).then((res) => {
      setIsDisabled(true);
      showsuccess("Successfully deleted role");
      setLoading(true);
      navigate("/view-roles")
    });
  };
  
  

  const handleSwitchClick = (e) => {
    if (e.target.checked) {
      rolesSelected.push(parseInt(e.target.id));
      setRolesSelected([...rolesSelected]);
    } else {
      const index = rolesSelected.indexOf(parseInt(e.target.id));
      if (index !== -1) {
        rolesSelected.splice(index, 1);
        setRolesSelected([...rolesSelected]);
      }
    }
  };

  return (
    <Flex
      px={2}
      pb={2}
      flexWrap={"wrap"}
      w={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={2}
    >
      {loading ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"550px"}
        >
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
        </Box>
      ) : (
        <>
        <Box
            width={"95%"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            cursor={"pointer"}
            mb={4}
            display={!isAdmin ? "flex" : "none"}
          >
            {hasPermission(PERMISSIONS.DELETE_SUPER_ROLES) && (
            <FunctionalModal
              modalTitle={"Delete Role"}
              btnTitle={"Delete Role"}
              btnColor={"primary.60"}
              isDisabled={rolesSelected.length === 0}
              btnSize={"lg"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              cancelable={true}
              modalMinH={"300px"}
              iconBtn={DeleteIcon}
              btnAction={
                <Button onClick={handleDeleteRole}w={"fit-content"}
                backgroundColor={"primary.80"}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                color={"danger.100"}
                _hover={{ color: "primary.100", bg: "primary.60" }}>
                  Delete
                </Button>
              }
            >
          <Text
        color={"text.primary"}
        textAlign={"center"}
        fontWeight={"bold"}
        py={20}
      >
        Are you sure you want to delete this role?
      </Text>
            </FunctionalModal>)}

             {hasPermission(PERMISSIONS.EDIT_SUPER_ROLES) && (<IconButton onClick={() => setIsDisabled(!isDisabled)} size={'lg'} 
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,1)"
                    : "5px 7px 15px 1px rgba(0,0,0,0.3)"
                }
                 rounded={'full'} bg={"primary.60"} marginLeft={2} icon={ <Icon boxSize={"20px"} as={isDisabled ? EditIcon  : CloseIcon} color={'primary.100'} />} />)}
            {!isDisabled && <IconButton 
             boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,1)"
                : "5px 7px 15px 1px rgba(0,0,0,0.3)"
            }
            onClick={handleEditRole} size={'lg'} isDisabled={isDisabled} rounded={'full'} bg={"primary.60"} marginLeft={2} icon={<Icon boxSize={"20px"} as={CheckIcon} color={'primary.100'}
               />} />}
          </Box>
          <RolesAccordion RolesGroups={RolesGroups} rolesSelected={rolesSelected} handleSwitchClick={handleSwitchClick} isDisabled={isDisabled} />
        </>
      )}
    </Flex>
  );
}

export default EditRole;
