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
exports.calSleepStatistical = (data) => request('content', 'sleep/calStatistical', data);

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

/**
 * 开始工作
 * @param {Object} data 
 */
exports.startWorking = (data) => request('content', 'work/startWorking', data);

/**
 * 检查当前的状态是否在工作中
 * @param {Object} data 
 */
exports.isWorking = (data) => request('content', 'work/isWorking', data);

/**
 * 下班啦打卡回家
 * @param {Object} data 
 */
exports.offDuty = (data) => request('content', 'work/offDuty', data);

/**
 * 取消本次工作的任务
 * @param {Object} data 
 */
exports.cancelWorkData = (data) => request('content', 'work/cancel', data);

/**
 * 暂停进行中的工作任务
 * @param {Object} data 
 */
exports.pauseWorkData = (data) => request('content', 'work/pause', data);

/**
 * 继续暂停的工作任务
 * @param {Object} data 
 */
exports.continueWorkData = (data) => request('content', 'work/continue', data);

/**
 * 当前工作中是暂停还是继续的工作任务
 * @param {Object} data 
 */
exports.getWorkingStatus = (data) => request('content', 'work/findWorkingStatus', data);

/**
 * 获取本次的工作时长
 * @param {Object} data 
 */
exports.getCurrentWorkHour = (data) => request('content', 'work/findCurrentWorkHour', data);

/**
 * 更新结束时间
 * @param {Object} data 
 */
exports.updateOffDuty = (data) => request('content', 'work/updateOffDuty', data);

/**
 * 统计工作内容的计数
 * @param {Object} data 
 */
exports.calWorkCountStatistical = (data) => request('content', 'work/calWorkCountStatistical', data);

/**
 * 统计工作时间的计数
 * @param {Object} data 
 */
exports.calWorkTimeStatistical = (data) => request('content', 'work/calWorkTimeStatistical', data);

/**
 * 获取今天的工作总时间
 * @param {Object} data 
 */
exports.findTodayWorkHour = (data) => request('content', 'work/findTodayWorkHour', data);

/**
 * 获取历史的工作内容，并统计相关内容的工作次数
 * @param {Object} data 
 */
exports.findCommonWorkContent = (data) => request('content', 'work/findCommonWorkContent', data);

