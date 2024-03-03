import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';

const baseURL = 'api-v2/';

export async function getAllUsers () {
    setAuthToken(getToken());
    return axios.get(baseURL + 'users/').catch(globalErrorHandler);
}

export async function createUser (username, password, name, email, roles, userDeviceGroup) {
    setAuthToken(getToken());
    const body = {
        user_name: username,
        password: password,
        name: name,
        email: email,
        super_role: roles,
    }
    if(userDeviceGroup){
        body.device_group = userDeviceGroup
    }
    return axios.post(baseURL + 'users/', body ).catch(globalErrorHandler);
}

export async function getMyUser () {
    setAuthToken(getToken());
    return axios.get(baseURL + 'users/me').catch(globalErrorHandler);
}

export async function assignRoles (userId, roles, device_group) {
    setAuthToken(getToken());
    const body = {
        user_id: userId,
        super_role: roles,
    }
    if(device_group){
        body.device_group = device_group
    }
    return axios.put(baseURL + 'users/roles', body).catch(globalErrorHandler);
}

export async function editUserDeviceRoles (user, device, roles) {
    setAuthToken(getToken());
    return axios.put(baseURL + 'devices/roles', {
        user_id: user, device_id: device, role_id_list: roles
    }).catch(globalErrorHandler);
}

export async function sendVerificationEmail () {
    setAuthToken(getToken());
    return axios.post(baseURL + 'users/email_verification').catch(globalErrorHandler);
}

export async function verifyUserEmail (otp) {
    setAuthToken(getToken());
    return axios.put(baseURL + 'users/email_verification', {
        otp: otp
    }).catch(globalErrorHandler);
}
