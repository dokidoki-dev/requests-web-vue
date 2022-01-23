import {test} from '@/utils/request'

export function fetchList(params) {
  return test({
    url: '/api/v1/cases/t_lists',
    method: 'get',
    params
  })
}
