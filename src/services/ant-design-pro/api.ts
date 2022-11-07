// @ts-ignore
/* eslint-disable */
import request from '../config';

/** get profile */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/auth/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

/** logout */
export async function outLogin(options?: { [key: string]: any }) {}

/** login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
