import { globalErrorHandler } from "./api-helpers";
import axios from "axios";
import { getToken, setAuthToken } from "./user";

const baseUrl = process.env.REACT_APP_TICKETING_URL;
setAuthToken(getToken());
const token = getToken();
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
} else {
  delete axios.defaults.headers.common.Authorization;
}
export async function getTickets(
  userAssigned,
  pageId,
  pageSize,
  category,
  assignedTo
) {
  setAuthToken(getToken());
  let requestUrl = `tickets?page_id=${pageId}&page_size=${pageSize}`;
  if (userAssigned) {
    requestUrl = requestUrl + `&user_assigned=${userAssigned}`;
  }
  if (category) {
    requestUrl = requestUrl + `&category_id=${category}`;
  }
  if (assignedTo) {
    requestUrl = requestUrl + `&assigned_to=${assignedTo}`;
  }
  return axios
    .get(baseUrl + requestUrl, { withCredentials: false })
    .catch(globalErrorHandler);
}

export async function getTicket(ticketId) {
  setAuthToken(getToken());
  let requestUrl = `tickets/${ticketId}`;
  return axios
    .get(baseUrl + requestUrl, { withCredentials: false })
    .catch(globalErrorHandler);
}

export function getCategories(pageId, pageSize) {
  setAuthToken(getToken());
  return axios
    .get(baseUrl + `categories?page_id=${pageId}&page_size=${pageSize}`)
    .catch(globalErrorHandler);
}

export function createCategories(name) {
  setAuthToken(getToken());
  return axios.post(baseUrl + "categories", { name }).catch(globalErrorHandler);
}

export function createTicket(
  categoryId,
  description,
  status,
  title,
  userAssigned
) {
  setAuthToken(getToken());
  return axios
    .post(baseUrl + "tickets", {
      category_id: categoryId,
      description: description,
      status: "open",
      title: title,
      user_assigned: userAssigned,
    })
    .catch(globalErrorHandler);
}

export function editTicket(ticketId, assignedTo, status) {
  setAuthToken(getToken());
  return axios
    .put(baseUrl + "tickets/" + ticketId, {
      assigned_to: assignedTo,
      status: status,
    })
    .catch(globalErrorHandler);
}

export function deleteTicket(ticketId) {
  setAuthToken(getToken());
  return axios
    .delete(baseUrl + `tickets/${ticketId}`)
    .catch(globalErrorHandler);
}

export function getComments(ticketId, pageId, pageSize) {
  setAuthToken(getToken());
  return axios
    .get(
      baseUrl +
        `tickets/${ticketId}/comments?page_id=${pageId}&page_size=${pageSize}`
    )
    .catch(globalErrorHandler);
}

export function createComment(ticketId, commentText, user) {
  setAuthToken(getToken());
  return axios
    .post(baseUrl + `tickets/${ticketId}/comments`, {
      comment_text: commentText,
      user_commented: user,
    })
    .catch(globalErrorHandler);
}

export function editComment(ticketId, commentId, commentText) {
  setAuthToken(getToken());
  return axios
    .put(baseUrl + `tickets/${ticketId}/comments/${commentId}`, {
      comment_text: commentText,
    })
    .catch(globalErrorHandler);
}

export function deleteComment(ticketId, commentId) {
  setAuthToken(getToken());
  return axios
    .delete(baseUrl + `tickets/${ticketId}/comments/${commentId}`)
    .catch(globalErrorHandler);
}


