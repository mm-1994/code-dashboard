import { CheckIcon, CloseIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { editComment, deleteComment } from "../../../../api/ticketing";
import { formatDateOps } from "../../../../helpers/array-map";
import { getUserInfo } from "../../../../api/user";
import { ThemeContext } from "../../../../context/theme";
import { showsuccess } from "../../../../helpers/toast-emitter";

export function Comment({ comment, ticketId, callback, pageNum }) {
  const [edit, setEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment_text);
  const themeCtx = useContext(ThemeContext);

  const editCommentCall = () => {
    if (editedComment !== comment.comment_text) {
      editComment(ticketId, comment.comment_id, editedComment).then((res) => {
        callback(pageNum);
        setEdit(false);
        showsuccess("Comment Edited");
      });
    }
  };

  const deleteCommentCall = () => {
    deleteComment(ticketId, comment.comment_id).then((res) => {
      callback(pageNum);
      setEdit(false);
      showsuccess("Comment Deleted");
    });
  };

  return (
    <>
      <Box
        w={"100%"}
        as={Flex}
        alignItems={"baseline"}
        flexDirection={
          comment.user_commented === getUserInfo().user_name
            ? "row-reverse"
            : "row"
        }
        gap={4}
      >
        <Avatar size={"sm"} name={comment.user_commented} bg={"primary.60"} />
        <Box w={"fit-content"} as={Flex} flexWrap={"wrap"} gap={2}>
          <Box
            p={5}
            borderRadius={"10px"}
            bg={
              comment.user_commented === getUserInfo().user_name
                ? "primary.60"
                : "primary.80"
            }
            color={
              comment.user_commented === getUserInfo().user_name
                ? "text.primary"
                : "text.primary"
            }
            w={"100%"}
            as={Flex}
            justifyContent={"flex-start"}
            gap={2}
            boxShadow={
              themeCtx.darkMode
                ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                : "3px 2px 7px 1px rgba(0,0,0,0.2)"
            }
          >
            <Box
              gap={5}
              w={"100%"}
              as={Flex}
              flexWrap={"wrap"}
              alignItems={"baseline"}
            >
              {comment.user_commented !== getUserInfo().user_name ? (
                <Box gap={5} w={"100%"} as={Flex} alignItems={"baseline"}>
                  <Text h={10} outline={"2px solid transparent"} w={"100%"}>
                    {comment.comment_text}
                  </Text>
                </Box>
              ) : (
                <>
                  {edit ? (
                    <Box gap={5} w={"100%"} as={Flex} alignItems={"baseline"}>
                      <Input
                        w={"100%"}
                        value={editedComment}
                        variant={"filled"}
                        onChange={(e) => setEditedComment(e.target.value)}
                        bg={"primary.80"}
                        _hover={{ bg: "primary.80" }}
                      />
                    </Box>
                  ) : (
                    <Box gap={5} w={"100%"} as={Flex} alignItems={"baseline"}>
                      <Text h={10} outline={"2px solid transparent"} w={"100%"}>
                        {comment.comment_text}
                      </Text>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
          <Box as={Flex} justifyContent={"start"} w={"100%"} gap={2}>
            <Text color={"text.gray.100"} fontSize={"md"}>
              {comment.user_commented}
            </Text>
            <Text color={"text.gray.100"} fontSize={"md"}>
              at:{" "}
              {formatDateOps(
                comment.created_at.replace("Z", ""),
                "DD MMM, HH:mm"
              )}
            </Text>
            {comment.user_commented === getUserInfo().user_name ? (
              <>
                {edit ? (
                  <Box gap={5} as={Flex} alignItems={"baseline"}>
                    <IconButton
                      icon={<CloseIcon color={"text.dark"} />}
                      size={"xs"}
                      onClick={() => setEdit(false)}
                      bg={"primary.60"}
                      color={"text.100"}
                    />
                    <IconButton
                      icon={<CheckIcon color={"text.dark"} />}
                      size={"xs"}
                      onClick={editCommentCall}
                      bg={"primary.60"}
                      color={"text.100"}
                    />
                  </Box>
                ) : (
                  <Box gap={2} as={Flex} alignItems={"baseline"}>
                    <IconButton
                      size="xs"
                      icon={<EditIcon color={"text.dark"} />}
                      onClick={() => setEdit(true)}
                      bg={"primary.60"}
                      color={"text.100"}
                    />

                    <IconButton
                      size="xs"
                      icon={<DeleteIcon color={"text.dark"} />}
                      onClick={() => deleteCommentCall()}
                      bg={"primary.60"}
                      color={"text.100"}
                    />
                  </Box>
                )}
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default Comment;
