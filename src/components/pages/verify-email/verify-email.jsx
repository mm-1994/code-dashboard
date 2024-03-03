import React, { useEffect } from "react";
import {
  Flex,
  Spinner,
  Center
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { showsuccess } from "../../../helpers/toast-emitter";
import { verifyUserEmail } from "../../../api/user-management";

function Verify_Email() {
  const navigate = useNavigate();
  const { otp } = useParams();

  useEffect(() => {
    verifyUserEmail(otp).then(() => {
      showsuccess("Email verified successfully");
      navigate("/")
    }).catch(()=>{
      navigate("/")
    });
  }, []);

  return (
    <>
      <Flex p={2} w={"100%"} display={"flex"} flexDirection={"column"}>
      <Center w={"100%"} h={'80vh'}>
      <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
          </Center>
      </Flex>
    </>
  );
}

export default Verify_Email;
