import axios from 'axios';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';

let baseUrl = "https://billing.cypod.solutions/"

export async function getBatches(data){
    setAuthToken(getToken());
  let requestUrl = `batches?`;
  if(data.costumer_name)
  requestUrl+=`customer_name=${data.costumer_name}`
  requestUrl+=`&page_id=${data.page_id}&page_size=${data.page_size}`
  try {
    return await axios
      .get(baseUrl + requestUrl);
  } catch (err) {
    return globalErrorHandler(err);
  }

}
export async function addBatch(data){
    setAuthToken(getToken());
  let requestUrl = `batches`;
  try {
    return await axios
      .post(baseUrl + requestUrl, data);
  } catch (err) {
    return globalErrorHandler(err);
  }

}

export async function editBatch(id,data){
    setAuthToken(getToken());
  let requestUrl = `batches/${id}`;
  try {
    return await axios
      .put(baseUrl + requestUrl, data );
  } catch (err) {
    return globalErrorHandler(err);
  }

}

export async function deleteBatch(id){
    setAuthToken(getToken());
  let requestUrl = `batches/${id}`;
  try {
    return await axios
      .delete(baseUrl + requestUrl);
  } catch (err) {
    return globalErrorHandler(err);
  }

}

///// Bundles


export async function getBundles(costumer_name){
    setAuthToken(getToken());
  let requestUrl = `bundles`;
  if(costumer_name)
  requestUrl+=`?costumer_name=${costumer_name}`
  try {
    return await axios
      .get(baseUrl + requestUrl);
  } catch (err) {
    return globalErrorHandler(err);
  }
}

export async function addBundle(data){
    setAuthToken(getToken());
  let requestUrl = `bundles`;
  try {
    return await axios
      .post(baseUrl + requestUrl, data);
  } catch (err) {
    return globalErrorHandler(err);
  }

}

export async function assignBundleToCustomer(data){
    setAuthToken(getToken());
  let requestUrl = `bundles/assign`;
  try {
    return await axios
      .post(baseUrl + requestUrl, { data });
  } catch (err) {
    return globalErrorHandler(err);
  }

}

export async function deleteBundle(id){
    setAuthToken(getToken());
  let requestUrl = `bundles/${id}`;
  try {
    return await axios
      .delete(baseUrl + requestUrl);
  } catch (err) {
    return globalErrorHandler(err);
  }

}

export async function getCustomerCharges(costumer_name){
  setAuthToken(getToken());
let requestUrl = `charges`;
if(costumer_name)
  requestUrl+=`?customer_name=${costumer_name}`

try {
  return await axios
    .get(baseUrl + requestUrl);
} catch (err) {
  return globalErrorHandler(err);
}

}

export async function getPaymentLogs(data){
  setAuthToken(getToken());
let requestUrl = `payments_logs?`;
if(data.costumer_name)
requestUrl+=`customer_name=${data.costumer_name}`
requestUrl+=`&page_id=${data.page_id}&page_size=${data.page_size}`
try {
  return await axios
    .get(baseUrl + requestUrl);
} catch (err) {
  return globalErrorHandler(err);
}

}


export async function editPaymentLogs(id,data){
  setAuthToken(getToken());
let requestUrl = `payments_logs/${id}`;
try {
  return await axios
    .put(baseUrl + requestUrl, data );
} catch (err) {
  return globalErrorHandler(err);
}
}

export async function assignBundle(data){
  setAuthToken(getToken());
let requestUrl = `bundles/assign`;
try {
  return await axios
    .post(baseUrl + requestUrl, data );
} catch (err) {
  return globalErrorHandler(err);
}
}

export async function getOrders(){
  setAuthToken(getToken());
let requestUrl = `orders`;
try {
  return await axios
    .get(baseUrl + requestUrl);
} catch (err) {
  return globalErrorHandler(err);
}

}

export async function editOrder(id,data){
  setAuthToken(getToken());
let requestUrl = `orders/${id}`;
try {
  return await axios
    .put(baseUrl + requestUrl, data );
} catch (err) {
  return globalErrorHandler(err);
}
}