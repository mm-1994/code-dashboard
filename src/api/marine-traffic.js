import axios from "axios";
import { globalErrorHandler } from "./api-helpers";


const baseUrl = "/api-v2/marine_traffic_data/";



export function getMarineTrafficLogs(containerId,) {
  return axios
    .get(baseUrl+ `?container_id=${containerId}`)
    .catch(globalErrorHandler);
}