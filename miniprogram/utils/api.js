import { request } from "./request.js";

/**************************  用户 *******************/
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

/**************************  睡觉 *******************/
/**
 * 开始睡眠
 * @param {object} data 
 * @param openId
 * @param startTime
 * @param endTime
 * @param sleepHour
 * @param sleepMinute
 * @param sleepSecond
 */
exports.startSleep = (data) => request('content', 'sleep/startSleep', data);

/**
 * 查询当前的状态是睡眠还是起床
 */
exports.getSleepStatus = (data) => request('content', 'sleep/getSleepStatus', data);

/**
 * 起床
 * @param {object} data
 * 
 */
exports.getUp = (data) => request('content', 'sleep/getUp', data);

/**
 * 取消睡眠
 * @param {object} data 
 */
exports.cancel = (data) => request('content', 'sleep/remove', data);

/**
 * 查询最近7天的统计数据
 * @param {object} data 
 */
exports.getStatisticalData = (data) => request('content', 'sleep/getStatistical', data);

/**
 * 统计睡眠信息存入统计表
 * @param {object} data 
 */
exports.calStatistical = (data) => request('content', 'sleep/calStatistical', data);

/**
 * 获取当天的睡眠时长
 * @param {objec} data 
 */
exports.getDaySleepHour = (data) => request('content', 'sleep/getDaySleepHour', data);

/**
 * 获取当次的睡眠时长
 * @param {object} data
 */
exports.getCurrentSleepHour = (data) => request('content', 'sleep/getCurrentSleepHour', data);

/**
 * 更新起床时间
 * @param {object} data
 */
exports.updateGetUpTime = (data) => request('content', 'sleep/updateGetUp', data);