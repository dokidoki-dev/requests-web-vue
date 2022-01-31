import request, {test} from '@/utils/request'

export function fetchList(params) {
  return test({
    url: '/api/v1/cases/t_lists',
    method: 'get',
    params
  })
}

export function getgroups(params) {
  return test({
    url: '/api/v1/cases/g_lists',
    method: 'get',
    params
  })
}

export function logout() {
  return test({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}


export function createadd(data) {
  return test({
    url: '/api/v1/cases/t_addcase',
    method: 'post',
    data
  })
}


export function get_list_one(data) {
  return test({
    url: '/api/v1/cases/t_lists_one',
    method: 'post',
    data
  })
}
