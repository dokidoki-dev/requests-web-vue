<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.case_id" placeholder="用例ID" style="width: 150px;" class="filter-item" />
      <el-input v-model="listQuery.case_name" placeholder="用例名称" style="width: 150px;" class="filter-item" />
      <el-select v-model="listQuery.group_name" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.group_name" :label="item.group_name" :value="item.group_name" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleRunAllStatus">
        运行此分组
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="用例id" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.case_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.case_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例分组" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" min-width="40px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求路径" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求参数" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.params==null?'空':scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求头" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.header }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求数据" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.request_data }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="断言" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_assert?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="依赖" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_rely_on?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status?'success':'0'">
            {{ row.status?'运行中':'未运行' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleModifyStatus(row,1)">
            运行
          </el-button>
          <el-button size="mini" type="warning" @click="handleResult(row)">
            结果
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;"  v-loading="dialogloading">
        <el-form-item label="用例名字" prop="case_name">
          <el-input v-model="temp.case_name" placeholder="用例名字" />
        </el-form-item>
        <el-form-item label="用例分组" prop="group_name" >
          <el-select v-model="temp.group_name" style="width: 140px" class="filter-item">
            <el-option v-for="item in sortOptions" :key="item.group_name" :label="item.group_name" :value="item.group_name"  />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort" >
          <el-input v-model="temp.sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="使用环境变量url">
          <el-select v-model="show_env_url" style="width: 140px" class="filter-item">
            <el-option v-for="item in show_Options" :key="item" :label="item ? '是' : '否'" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="请求url" prop="url" v-if="!show_env_url">
          <el-input v-model="temp.url" placeholder="请求url" />
        </el-form-item>
        <el-form-item label="环境变量url" prop="env_url" v-if="show_env_url">
          <el-input v-model="temp.env_url" placeholder="环境变量url" />
        </el-form-item>
        <el-form-item label="请求路径" prop="path">
          <el-input v-model="temp.path" placeholder="请求路径path" />
        </el-form-item>
        <el-form-item label="使用环境变量header">
          <el-select v-model="show_env_header" style="width: 140px" class="filter-item">
            <el-option v-for="item in show_Options" :key="item" :label="item ? '是' : '否'" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="环境变量header" prop="env_header" v-if="show_env_header" >
          <el-input v-model="temp.env_header" placeholder="环境变量header" />
        </el-form-item>
        <el-form-item label="请求header" prop="header" v-if="!show_env_header" >
          <el-input v-model="temp.header" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请求header" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method" >
          <el-input v-model="temp.method" placeholder="请求方式method" />
        </el-form-item>
        <el-form-item label="请求参数" prop="params">
          <el-input v-model="temp.params" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请求参数params" />
        </el-form-item>
        <el-form-item label="请求数据" prop="request_data">
          <el-input v-model="temp.request_data" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请求数据data" />
        </el-form-item>
        <el-form-item label="是否断言" prop="is_assert">
          <el-select v-model="temp.is_assert" style="width: 140px" class="filter-item">
            <el-option v-for="item in show_Options" :key="item" :label="item ? '是' : '否'" :value="item === true ? 1 : 0 " />
          </el-select>
        </el-form-item>
        <el-form-item label="断言类型" prop="assert_mode" v-if="temp.is_assert === 1">
          <el-input v-model="temp.assert_mode" placeholder="断言类型" />
        </el-form-item>
        <el-form-item label="断言数据" prop="assert_data" v-if="temp.is_assert === 1">
          <el-input v-model="temp.assert_data" placeholder="断言数据" />
        </el-form-item>
        <el-form-item label="数据类型" prop="assert_type" v-if="temp.is_assert === 1">
          <el-input v-model="temp.assert_type" placeholder="数据类型" />
        </el-form-item>
        <el-form-item label="断言预期结果" prop="a_result_data" v-if="temp.is_assert === 1">
          <el-input v-model="temp.a_result_data" placeholder="断言预期结果数据" />
        </el-form-item>
        <el-form-item label="是否依赖" prop="is_rely_on">
          <el-select v-model="temp.is_rely_on" style="width: 140px" class="filter-item">
            <el-option v-for="item in show_Options" :key="item" :label="item ? '是' : '否'" :value="item === true ? 1 : 0 " />
          </el-select>
        </el-form-item>
        <el-form-item label="依赖id" prop="rely_id" v-if="temp.is_rely_on === 1">
          <el-input v-model="temp.rely_id" placeholder="依赖用例id" />
        </el-form-item>
        <el-form-item label="依赖返回数据" prop="rely_data" v-if="temp.is_rely_on === 1">
          <el-input v-model="temp.rely_data" placeholder="依赖接口的返回数据对象" />
        </el-form-item>
        <el-form-item label="使用依赖的方式" prop="rely_mode" v-if="temp.is_rely_on === 1">
          <el-input v-model="temp.rely_mode" placeholder="依赖使用方式" />
        </el-form-item>
        <el-form-item label="使用依赖的key" prop="rely_key" v-if="temp.is_rely_on === 1">
          <el-input v-model="temp.rely_key" placeholder="使用依赖的key" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看运行结果" :visible.sync="dialogResultVisible">
      <div>
        <label>用例id: </label>
        <p>{{ result[0].case_id }}</p>
      </div>
      <div>
        <label>排序: </label>
        <p>{{ result[0].sort }}</p>
      </div>
      <div>
        <label>用例名字: </label>
        <p>{{ result[0].case_name }}</p>
      </div>
      <div>
        <label>所属分组: </label>
        <p>{{ result[0].group_name }}</p>
      </div>
      <div>
        <label>状态: </label>
        <p>{{ result[0].status }}</p>
      </div>
      <div>
        <label>子状态: </label>
        <p>{{ result[0].sub_status }}</p>
      </div>
      <div>
        <label>是否断言: </label>
        <p>{{ result[0].is_assert }}</p>
      </div>
      <div>
        <label>断言状态: </label>
        <p>{{ result[0].a_status || '无' }}</p>
      </div>
      <div>
        <label>请求数据: </label>
        <p>{{ result[0].request_data || '无' }}</p>
      </div>
      <div>
        <label>请求状态码: </label>
        <p>{{ result[0].result_code || '无' }}</p>
      </div>
      <div>
        <label>接口返回数据: </label>
        <p>{{ result[0].result_data || '无' }}</p>
      </div>
      <div>
        <label>断言数据: </label>
        <p>{{ result[0].a_data || '无' }}</p>
      </div>
      <div>
        <label>断言类型: </label>
        <p>{{ result[0].a_mode || '无' }}</p>
      </div>
      <div>
        <label>断言预期结果数据: </label>
        <p>{{ result[0].a_result_data || '无' }}</p>
      </div>
      <div>
        <label>数据类型: </label>
        <p>{{ result[0].a_type || '无' }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogResultVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import {
  caseResult,
  createadd,
  deleteecase,
  fetchList,
  get_list_one,
  getgroups,
  runallStatus,
  runcase,
  updatecase
} from '@/api/test' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 用例列表查询参数
      listQuery: {
        page: 1,
        limit: 10,
        case_name: null,
        case_id: null,
        group_name: null
      },
      // 用例分组查询参数
      groupQuery: {
        page: 1,
        limit: 20
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      // 选择用例分组  存放字典形式
      sortOptions: [],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      // 控制展示环境变量还是非环境变量输入框问题
      show_Options: [false, true],
      show_env_url: false,
      show_env_header: false,
      // 存储用例信息
      temp: {
        case_name: '',
        group_name: '',
        url: '',
        env_url: '',
        path: '',
        header: null,
        env_header: '',
        method: '',
        params: '',
        request_data: null,
        sort: '',
        is_assert: 0,
        assert_mode: '',
        assert_data: '',
        assert_type: '',
        a_result_data: '',
        is_rely_on: 0,
        rely_id: '',
        rely_data: '',
        rely_mode: '',
        rely_key: ''
      },
      // 存储用例执行结果
      result: [{
        case_id: "",
        sort: '',
        case_name: '',
        group_name: '',
        status: "",
        sub_status: "",
        a_status: "",
        request_data: "",
        result_code: "",
        result_data: "",
        a_data: "",
        a_mode: "",
        a_result_data: "",
        a_type: "",
        is_assert: ""
      }],
      dialogFormVisible: false,
      dialogResultVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        case_name: [{ required: true, message: '必填', trigger: 'blur' }],
        group_name: [{ required: true, message: '必填', trigger: 'blur' }],
        url: [{ required: true, message: '必填', trigger: 'blur' }],
        env_url: [{ required: true, message: '必填', trigger: 'blur' }],
        header: [{ required: true, message: '必填', trigger: 'blur' }],
        env_header: [{ required: true, message: '必填', trigger: 'blur' }],
        method: [{ required: true, message: '必填', trigger: 'blur' }],
        sort: [{ required: true, message: '必填', trigger: 'blur' }],
        is_assert: [{ required: true, message: '必填', trigger: 'change' }],
        assert_mode: [{ required: true, message: '必填', trigger: 'blur' }],
        assert_data: [{ required: true, message: '必填', trigger: 'blur' }],
        assert_type: [{ required: true, message: '必填', trigger: 'blur' }],
        a_result_data: [{ required: true, message: '必填', trigger: 'blur' }],
        is_rely_on: [{ required: true, message: '必填', trigger: 'change' }],
        rely_id: [{ required: true, message: '必填', trigger: 'blur' }],
        rely_data: [{ required: true, message: '必填', trigger: 'blur' }],
        rely_mode: [{ required: true, message: '必填', trigger: 'blur' }],
        rely_key: [{ required: true, message: '必填', trigger: 'blur' }],
        path: [{ required: false, message: '非必填', trigger: 'blur' }],
        request_data: [{ required: false, message: '非必填', trigger: 'blur' }],
        params: [{ required: false, message: '非必填', trigger: 'blur' }]
      },
      downloadLoading: false,
      dialogloading: false,
    }
  },
  created() {
    // // 获取用例分组
    // this.getgroup();
    // // 获取用例列表信息
    // this.getList()
    this.getall()
  },
  methods: {
    // 页面初始加载方法
    getall() {
      getgroups(this.groupQuery).then(response => {
        // 获取分组信息
        this.sortOptions = response.object;
        if (response.object.length === 0) {
          this.listQuery.group_name = null
          return
        }
        this.listQuery.group_name = response.object[0].group_name ? response.object[0].group_name : null
        const res = response.result
        if (res === true) {
          this.getList()
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: error || 'error',
          type: "error",// success,warning,error
          duration: 4000,
        });
        this.listLoading = false
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.result === true) {
          // 用例列表
          this.list = response.object
          // 总数量
          this.total = response.object.length
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
        else {
          this.$message.error(response.msg)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      }).catch(error => {
        console.log(error)
        this.listLoading = false
        this.$message.error(error || 'error')
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.getList()
    },
    handleModifyStatus(row, status) {
      const id = {
        case_id: row.case_id,
        case_type: 1
      }
      runcase(id).then(response => {
        if (response.result === false) {
          this.$message.error(response.msg)
        }
        else {
          this.$message.success(response.msg)
          row.status = status
        }
      }).catch(error => {
        this.$message.error(error || 'error')
      })
    },
    handleRunAllStatus() {
      const id = {
        case_group: this.listQuery.group_name,
        case_type: 0
      }
      console.log(this.temp.group_name)
      this.$confirm('你确定要运行当前分组的所有测试用例吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        runallStatus(id).then(response => {
          if (response.result === false) {
            this.$message.error(response.msg)
          }
          else {
            this.$message.success(response.msg)
          }
        }).catch(error => {
          this.$message.error(error || 'error')
        })
      }).catch(error => {
        console.log(error)
      })
    },
    handleDeleteStatus(row) {
      const id = {
        case_id: row.case_id
      }
      this.$confirm('你确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deletecase(id).then(response => {
          if (response.result === false) {
            this.$message.error(response.msg)
          }
          else {
            this.$message.success(response.msg)
            this.getList()
          }
        }).catch(error => {
          console.log(error)
          this.$message.error(error || 'error')
        })
      }).catch(error => {
        console.log(error)
      });
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      // this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['dataForm'].resetFields();
        this.show_env_header = false
        this.show_env_url = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogloading = true
          createadd(this.temp).then((response) => {
            if (response.result === false) {
              this.dialogloading = false
              this.$message.error(response.msg)
              return
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '成功',
              type: 'success',
              duration: 2000
            })
            this.dialogloading = false
            this.getList()
          }).catch((error) => {
            console.log(error)
            this.dialogloading = false
            this.$message.error(error || 'error')
          })
        }
      })
    },
    handleResult(row) {
      const id = {
        case_id: row.case_id
      }
      this.dialogloading = true
      caseResult(id).then(response => {
        if (response.result === false) {
          this.dialogloading = false
          this.$message.error(response.msg)
        }
        else {
          this.result[0].case_id = response.object.case_id
          this.result[0].result_data = response.object.result_data
          this.result[0].result_code = response.object.result_code
          this.result[0].a_data = response.object.a_data
          this.result[0].a_mode = response.object.a_mode
          this.result[0].a_result_data = response.object.a_result_data
          this.result[0].a_type = response.object.a_type
          this.result[0].a_status = response.object.a_status
          this.result[0].sort = response.object.sort
          this.result[0].status = response.object.status
          this.result[0].sub_status = response.object.sub_status
          this.result[0].is_assert = response.object.is_assert
          this.result[0].case_name = response.object.case_name
          this.result[0].group_name = response.object.group_name
          this.result[0].request_data = response.object.request_data
          this.dialogloading = false
          this.dialogResultVisible = true
        }
      }).catch(error => {
        console.log(error)
        this.$message.error(error || 'error')
        this.dialogloading = false
      })
      if (this.$refs['Result']) {
        this.$nextTick(() => {
          this.$refs['Result'].clearValidate()
          this.$refs['Result'].resetFields();
        })
      }
    },
    handleUpdate(row) {
      const id = {
        case_id: row.case_id
      }
      this.dialogloading = true
      get_list_one(id).then(response => {
        if (response.result === false) {
          this.dialogloading = false
          this.dialogFormVisible = false
          this.$message.error(response.msg)
        }
        else {
          this.temp = Object.assign({}, response.object.data) // copy obj
          this.show_env_url = response.object.is_env.url_env
          this.show_env_header = response.object.is_env.header_env
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.dialogloading = false
        }
      }).catch(error => {
        console.log(error)
        this.$message.error(error || 'error')
        this.dialogloading = false
      })
      if (this.$refs['dataForm']) {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs['dataForm'].resetFields();
        })
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogloading = true
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updatecase(tempData).then((response) => {
            if (response.result === false) {
              console.log(response.msg)
              this.dialogloading = false
              this.$message.error(response.msg)
            }
            else {
              this.dialogloading = false
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '成功',
                type: 'success',
                duration: 2000
              })
              this.$message.success(response.msg)
              this.getList()
            }
          }).catch(error => {
            this.dialogloading = false
            console.log(error)
            this.$message.error(error || 'error')
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
