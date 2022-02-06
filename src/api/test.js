import request, {test} from '@/utils/request'

// 查看测试用例列表
export function fetchList(params) {
  return test({
    url: '/api/v1/cases/t_lists',
    method: 'get',
    params
  })
}

// 查看测试用例分组
export function getgroups(params) {
  return test({
    url: '/api/v1/cases/g_lists',
    method: 'get',
    params
  })
}

// 退出登录
export function logout() {
  return test({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}

// 创建测试用例接口
export function createadd(data) {
  return test({
    url: '/api/v1/cases/t_addcase',
    method: 'post',
    data
  })
}


// 获取单个测试用例信息
export function get_list_one(data) {
  return test({
    url: '/api/v1/cases/t_lists_one',
    method: 'post',
    data
  })
}

// 更新测试用例
export function updatecase(data) {
  return test({
    url: '/api/v1/cases/t_update',
    method: 'post',
    data
  })
}

// 删除测试用例
export function deletecase(data) {
  return test({
    url: '/api/v1/cases/t_delete',
    method: 'post',
    data
  })
}

// 执行测试用例
export function runcase(data) {
  return test({
    url: '/api/v1/task/task_add',
    method: 'post',
    data
  })
}

// 执行当前分组所有测试用例
export function runallStatus(data) {
  return test({
    url: '/api/v1/task/task_add',
    method: 'post',
    data
  })
}

// 执行当前分组所有测试用例
export function caseResult(data) {
  return test({
    url: '/api/v1/cases/t_result',
    method: 'post',
    data
  })
}
