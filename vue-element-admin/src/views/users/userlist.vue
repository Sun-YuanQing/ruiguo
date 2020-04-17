<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userlist.user_name" placeholder="用户名称" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="userlist.user_account" placeholder="用户账号" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="onAddUser">
        添加
      </el-button>

    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.admin_user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('sort')">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            {{ $t('table.publish') }}
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            {{ $t('table.draft') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="图片">
          <el-input v-model="temp.images" />
        </el-form-item>
        <el-form-item label="排序" prop="title">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="用户名称" prop="title" style="width: 25rem;">
          <el-input v-model="temp.user_name" />
        </el-form-item>
        <el-form-item label="用户账号" prop="title">
          <el-input v-model="temp.user_account" />
        </el-form-item>
        <el-form-item label="密码" prop="title">
          <el-input ref="password" v-model="temp.user_password" type="password" placeholder="请输入密码" name="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>


    <pagination v-show="total>0" :total="total" :page.sync="temp.page" :limit.sync="temp.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="components-container">

        <pan-thumb :image="image" />

        <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
          Change Avatar
        </el-button>

        <image-cropper v-show="imagecropperShow" :key="imagecropperKey" :width="300" :height="300" url="https://httpbin.org/post"
          lang-type="en" @close="close" @crop-upload-success="cropSuccess" />
          <el-upload
            class="avatar-uploader"
            action="upload"
            :headers="{'Content-Type':'multipart/form-data'}"
            :show-file-list="false"
            :auto-upload = "true"
            :http-request="uploadFile"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
      </div>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="图片">
          <el-input v-model="temp.images" />
        </el-form-item>
        <el-form-item label="排序" prop="title">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="用户名称" prop="title" style="width: 25rem;">
          <el-input v-model="temp.user_name" />
        </el-form-item>
        <el-form-item label="用户账号" prop="title">
          <el-input v-model="temp.user_account" />
        </el-form-item>
        <el-form-item label="密码" prop="title">
          <el-input ref="password" v-model="temp.user_password" type="password" placeholder="请输入密码" name="password" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import users from "@/api/users.js"
  import {
    fetchList,
    fetchPv,
    createArticle,
    updateArticle
  } from '@/api/article'
  import waves from '@/directive/waves' // waves directive
  import {
    parseTime
  } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination


import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'


import axios from 'axios'
  const calendarTypeOptions = [{
      key: 'CN',
      display_name: 'China'
    },
    {
      key: 'US',
      display_name: 'USA'
    },
    {
      key: 'JP',
      display_name: 'Japan'
    },
    {
      key: 'EU',
      display_name: 'Eurozone'
    }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: {
      Pagination,
      ImageCropper,
      PanThumb
    },
    directives: {
      waves
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
        image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',


       isImage:null,

        tableKey: 0,
        list: null,
        total: 1,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        userlist: {
          page: 1,
          limit: 20,
          user_name: "",
          user_account: "",
          sort: "+id",
          importance: undefined,
          title: undefined,
          type: undefined
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{
          label: 'ID Ascending',
          key: '+id'
        }, {
          label: 'ID Descending',
          key: '-id'
        }],
        // statusOptions: ['生效', '草稿'], //生效状态
        showReviewer: false,
        temp: {
          user_name: "",
          status: 1,
          sort: "",
          user_account: "",
          user_password: "",
          images: "",
          page: 1,
          limit: 20,
          user_name: "",
          user_account: "",
          sort: "+id",
          importance: undefined,
          title: undefined,
          type: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {


          user_name: [{
            required: true,
            message: 'title is required',
            trigger: 'change'
          }],
          user_account: [{
            required: true,
            message: 'title is required',
            trigger: 'change'
          }],
          user_password: [{
            required: true,
            message: 'title is required',
            trigger: 'change'
          }],
          images: [{
            required: true,
            message: 'title is required',
            trigger: 'change'
          }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        var that = this;

        that.listLoading = true;

        users.lists(that.userlist)
          .then(function(response) { //成功400或401 执行。
            //$this.dd = response.data;//获取后台数据
            //console.log(response.data.access_token);
            console.log(response)
            that.list = response.data.items;
            that.total = response.data.total

            that.listQuery = that.temp;
            that.listLoading = false;
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const {
          prop,
          order
        } = data
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
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          user_name: "",
          status: 1,
          sort: "",
          user_account: "",
          user_password: "",
          images: "",
          page: 1,
          limit: 20,
          user_name: "",
          user_account: "",
          sort: "+id",
          importance: undefined,
          title: undefined,
          type: undefined
        }
      },
      onAddUser() {
        // this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true,
          this.temp = {

          }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        var data = this.temp;
        console.log(data);
        users.createUser(data)
          .then(function(response) { //成功400或401 执行。
            //$this.dd = response.data;//获取后台数据
            //console.log(response.data.access_token);
            console.log(response)
            that.list = response.data.items;
            that.listLoading = false;
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        console.log(row);
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row, index) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.image = resData.files.avatar
      },
      close() {
        this.imagecropperShow = false
      },
      //自定义上传图片
      uploadFile(params){
      	let file = params.file
      	let imageType = file.type
        let isImage=null;
      	if(imageType != 'image/jpeg' && imageType != 'image/jpg' && imageType != 'image/png'){
      		 isImage = false
      	}else{
      		 isImage = true
      	}
      	let isLt2M = file.size / 1024 / 1024 < 2
      	if (!isImage) {
      		this.open('上传头像图片只能是 JPG/PNG/JPEG 格式!')
      		return
      	}
      	if (!isLt2M) {
      		this.open('图片最大不能超过2M!')
      		return
      	}
      //	let formData = new FormData()
      	//formData.append('file',file)
        var formData={
          type:"image",
          filename:file,
          mode:"adminuser"

        }
      	axios({
      		url:"http://ruiguo.ruiguohealth.com/api/public/index.php/api/v1/upload/mono_file",
      		method:'post',
      		data:formData,
      	    headers: {
      	      'Content-Type':'multipart/form-data'
      	    }
      	}).then(response=>{
      		if(response.data.code == 0){
      			this.open(response.data.msg)
      		}else{
      			this.imageUrl = response.data.data.img
      		}
      	})

      }//原文链接：https://blog.csdn.net/weixin_43864139/java/article/details/102711808
    }
  }
</script>
