import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';

const baseURL = 'api-v2/';

export async function getAllDeviceGroups () {
    setAuthToken(getToken());
    return axios.get(baseURL + 'device_groups/').catch(globalErrorHandler);
}

export async function getDeviceGroup (id) {
    setAuthToken(getToken());
    return axios.get(baseURL + `device_groups/?id=${id}`).catch(globalErrorHandler);
}

export async function editDeviceGroup (id, devices) {
    setAuthToken(getToken());
    return axios.put(baseURL + `device_groups/`, {"id":id, "devices": devices}).catch(globalErrorHandler);
}

export async function deleteDeviceGroup (id) {
    setAuthToken(getToken());
    return axios.delete(baseURL + `device_groups/`, { data: { id: id }}).catch(globalErrorHandler);
}

export async function createDeviceGroup (name, devices) {
    setAuthToken(getToken());
    return axios.post(baseURL + `device_groups/`, {"name":name, "devices": devices}).catch(globalErrorHandler);
}
