import React, { useContext, useEffect, useState } from "react";
import { DevicesContext } from "../../../context/devices";
import { HStack, Tag, TagLabel, Button, Text, Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import FunctionalModal from "../functional-modal/functional-modal";
import CytagAssign from "../cytag-assign/cytag-assign";
import { showsuccess } from "../../../helpers/toast-emitter";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/theme";

function CytagChip({
  cycollectorId,
  assignAction,
  unAssignAction,
  showOnly = false,
}) {
  const [cytags, setCytags] = useState([]);
  const deviceCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);
  const navigate = useNavigate();
  const redirectToCytag = (name, id) => {
    return navigate(`/device/Cytag/${name}/${id}`);
  };
  useEffect(() => {
    setCytags(deviceCtx.getAssignedCytags(cycollectorId));
  }, [deviceCtx, cycollectorId]);

  return (
    <Box key={1}>
      <HStack
        h={"fit-content"}
        w={"fit-content"}
        maxW={"600px"}
        flexWrap={"wrap"}
        spacing={4}
      >
        {!showOnly ? (
          <CytagAssign
            assignAction={assignAction}
            cycollectorId={cycollectorId}
          />
        ) : null}

        {cytags.map(
          (cytag) =>
            cytag && (
              <>
                <Tag
                  size={"md"}
                  key={cytag.id}
                  borderRadius="full"
                  variant="solid"
                  bg="primary.100"
                  minW={showOnly ? "150px" : "165px"}
                  border={0.2}
                  borderStyle={"solid"}
                  borderColor={"primary.60"}
                  justifyContent={'space-evenly'}
                  cursor={"pointer"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    redirectToCytag(cytag.name, cytag.id);
                  }}
                  p={2}
                  _hover={{ backgroundColor: "primary.60" }}
                >
                  <TagLabel color={"text.primary"} mr={!showOnly && 2 }>{cytag.name}</TagLabel>
                  {!showOnly ? (
                    <FunctionalModal
                      btnSize={"xs"}
                      iconSize={"10px"}
                      iconBtn={CloseIcon}
                      cancelable={true}
                      btnColor={"primary.60"}
                      modalTitle={"Unassign Cytag"}
                      modalMinH={"500px"}
                      btnAction={
                        <Button
                        w={"fit-content"}
                        backgroundColor={"primary.80"}
                        boxShadow={
                          themeCtx.darkMode
                            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                            : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                        }
                        color={"danger.100"}
                        _hover={{ color: "primary.100", bg: "primary.60" }}
                          onClick={() => {
                            unAssignAction(cytag.id, cycollectorId).then(
                              (res) => {
                                showsuccess("Successfully unassigned cytag");
                                deviceCtx.getDevicesCall();
                              }
                            );
                          }}
                        >
                          Unassign cytag
                        </Button>
                      }
                    >
                      <Text px={5} pt={5}  color={"text.primary"} fontWeight={'bold'}>Are you sure you want to Unassign this cytag?</Text>
                      <Tag ml={4} mb={5} size="lg" colorScheme="danger" borderRadius="full">
                        <TagLabel>
                          {cytag.name} : {cytag.id}
                        </TagLabel>
                      </Tag>
                    </FunctionalModal>
                  ) : null}
                </Tag>
              </>
            )
        )}
        {cytags.length === 0 &&       
        <Tag
                  size={"md"}
                  borderRadius="full"
                  variant="solid"
                  bg="primary.100"
                  minW={ showOnly? "150px":"165px"}
                  border={0.2}
                  borderStyle={"solid"}
                  borderColor={"primary.60"}
                  cursor={"pointer"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    redirectToCytag(cytag.name, cytag.id);
                  }}
                  p={2}
                  _hover={{ backgroundColor: "primary.60" }}
                >
                  <TagLabel width={'100%'} textAlign={'center'} color={"text.primary"} mr={!showOnly && 2 }>-</TagLabel>

                  </Tag> }
      </HStack>
    </Box>
  );
}

export default CytagChip;
