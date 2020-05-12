import { request } from "./request.js";

/**
 * 用户登录获取openid
 */
exports.login = () => request('user', 'login');

/**
 * 获取已经登录过用户的信息
 * @param {object} data 
 * @param _openid 用户的唯一标识符
 */
exports.getUser = (data) => request('user', 'get', data);

/**
 * 未登录的过的用户，记录用户信息
 * @param {object} data 
 */
exports.addUser = (data) => request('user', 'add', data);

/**
 * 更新用户信息
 * @param {object} data 
 */
exports.updateUser = (data) => request('user', 'update', data);