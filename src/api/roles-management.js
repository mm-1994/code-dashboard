import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';

const baseURL = 'api-v2/';

export async function getAllSuperRoles () {
    setAuthToken(getToken());
    return axios.get(baseURL + 'super_roles/').catch(globalErrorHandler);
}

export async function getSuperRole (id) {
    setAuthToken(getToken());
    return axios.get(baseURL + `super_roles/?id=${id}`).catch(globalErrorHandler);
}

export async function editSuperRole (id, roles) {
    setAuthToken(getToken());
    return axios.put(baseURL + `super_roles/`, {"id":id, "roles": roles}).catch(globalErrorHandler);
}

export async function deleteSuperRole (id) {
    setAuthToken(getToken());
    return axios.delete(baseURL + `super_roles/` , { data: { id: id }}).catch(globalErrorHandler);
}

export async function createSuperRole (name, roles) {
    setAuthToken(getToken());
    return axios.post(baseURL + `super_roles/`, {"name":name, "roles": roles}).catch(globalErrorHandler);
}
