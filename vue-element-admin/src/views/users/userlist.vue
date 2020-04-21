<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.user_name" placeholder="用户名称" style="width: 20%;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.user_account" placeholder="用户账号" style="width: 20%;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="onAddUser">添加</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;margin-top:30px;"
      @sort-change="sortChange">

      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="{ row }">
          <img class="userImg" :src="imageUrl + row.images"></img>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" align="center" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.user_account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{ row }">
          <el-tooltip :content="row.status == 1 ? '启用' : '禁用'" placement="top">
            <el-switch @change="onUserStatus(row)" v-model="row.status" active-color="#7B68EE" inactive-color="#cccccc"
              :active-value="1" :inactive-value="2"></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="排序" sortable="custom" align="center" width="80" :class-name="getSortClass('sort')">
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="onUpdateBtn(row)">修改</el-button>
          <el-button size="mini" type="success" @click="onEditPermission(row)">权限</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



    <div class="app">
      <!-- :page-size="listQuery.limit"  改为 :limit.sync="listQuery.limit" 才不报错-->
      <el-pagination v-show="total > 0" style="margin-top: 1rem;" @size-change="onPageSizeChange" @current-change="onPageNumderChange"
        :page-sizes="[3,10, 20, 30, 50]" :limit.sync="listQuery.limit" :current-page="2" background layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total">
      </el-pagination>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-upload class="avatar-uploader" action="upload" :headers="{ 'Content-Type': 'multipart/form-data' }"
          :show-file-list="false" :auto-upload="true" :http-request="uploadFile" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <div class="components-container">
            上传图片
            <pan-thumb :image="imageUrl + temp.images" />
          </div>
        </el-upload>
        <el-form ref="formData" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">
          <el-form-item label="排序" style="width:60%">
            <el-input v-model="temp.sort" />
          </el-form-item>
          <el-form-item label="用户名称" style="width:60%">
            <el-input v-model="temp.user_name" />
          </el-form-item>
          <el-form-item label="用户账号" style="width:60%">
            <el-input v-model="temp.user_account" />
          </el-form-item>
          <el-form-item label="密码" style="width:60%">
            <el-input ref="password" v-model="temp.user_password" type="password" placeholder="请输入密码" name="password" />
          </el-form-item>
          <el-form-item label="状态">
            <el-tooltip :content="temp.status == 1 ? '启用' : '禁用'" placement="top">
              <el-switch @change="onUserStatus('temp')" v-model="temp.status" active-color="#7B68EE" inactive-color="#cccccc"
                :active-value="1" :inactive-value="2"></el-switch>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : onUserUpdata()">{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
      <!-- 权限 -->
      <el-dialog :visible.sync="showTree" :title="dialogType==='edit'?'Edit Role':'New Role'">
        <el-form :model="role" label-width="80px" label-position="left">

          <el-form-item label="Menus">
            <el-button type="text" size="mini" @click="() => append({id:-1})">
              添加
            </el-button>
            <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
              :props="defaultProps">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" size="mini" v-if="(data.meta && data.path && !data.children) || !data.addroles  "
                    @click="() => append(data,addroles=false)">
                    添加菜单
                  </el-button>
                  <el-button type="text" size="mini" v-if="(!data.meta &&  !data.children) || data.addroles" @click="() => append(data,addroles=true)">
                    添加权限
                  </el-button>
                  <el-button type="text" size="mini" @click="() => remove(node, data)">
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="showTree=false">
            取消
          </el-button>
          <el-button type="primary" @click="confirmRole">
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 创建菜单 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

        <el-form ref="formMenu" :visible.sync="showMenu" :rules="rules" :model="menuItmen" label-position="left"
          label-width="70px" style="width: 100%; margin-left:50px;">

          <el-form-item label="用户名称" style="width:60%">
            <el-input v-model="temp.user_name" />
          </el-form-item>
          <el-form-item label="状态">
            <el-tooltip :content="temp.status == 1 ? '启用' : '禁用'" placement="top">
              <el-switch @change="onUserStatus('temp')" v-model="temp.status" active-color="#7B68EE" inactive-color="#cccccc"
                :active-value="1" :inactive-value="2"></el-switch>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <el-form ref="formMenu" :visible.sync="showMenuRole" :rules="rules" :model="menuItmen" label-position="left"
          label-width="70px" style="width: 100%; margin-left:50px;">

          <el-form-item label="用户名称" style="width:60%">
            <el-input v-model="temp.user_name" />
          </el-form-item>
          <el-form-item label="状态">
            <el-tooltip :content="temp.status == 1 ? '启用' : '禁用'" placement="top">
              <el-switch @change="onUserStatus('temp')" v-model="temp.status" active-color="#7B68EE" inactive-color="#cccccc"
                :active-value="1" :inactive-value="2"></el-switch>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showMenu = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : onshowMenu()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>




<script>
  import users from '@/api/users.js';
  import routes from '@/api/routes.js';
  import {
    fetchList,
    fetchPv,
    createArticle,
    updateArticle
  } from '@/api/article';
  import waves from '@/directive/waves'; // waves directive
  import {
    parseTime
  } from '@/utils';
  import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

  import ImageCropper from '@/components/ImageCropper';
  import PanThumb from '@/components/PanThumb';

  import axios from 'axios';
  var id = 100;
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

    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData: [{
          id: 1,
          path: '/components',
          component: "Layout",
          redirect: '/',
          alwaysShow: true,
          hidden: false, //true
          name: 'ComponentDemo',
          addroles: true,
          meta: {
            title: 'ComponentDemo', //i18n
            icon: 'international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
            roles: ["admin"]
          },
          children: [{
              id: 2,
              path: 'tinymce',
              component: '@/views/components-demo/tinymce',
              name: 'TinymceDemo',
              meta: {
                title: 'tinymce'
              }
            },
            {
              id: 3,
              path: 'markdown',
              component: '@/views/components-demo/markdown',
              name: 'MarkdownDemo',
              meta: {
                title: 'markdown'
              }
            },
            {
              id: 4,
              path: 'json-editor',
              component: '@/views/components-demo/json-editor',
              name: 'JsonEditorDemo',
              meta: {
                title: 'jsonEditor'
              }
            }

          ]
        }, ],
        imagecropperShow: false,
        imagecropperKey: 0,
        image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
        isImage: null,
        imageUrl: "http://ruiguo.ruiguohealth.com/api/Upload/TemPoraryFile/",


        showTree: false,
        dialogType: null,

        showMenu: true,
        menuItmen: {
          path: '', ///i18n
          component: '', //Layout
          alwaysShow: true,
          hidden: false, //true
          name: '', //i18n
          redirect: '', //默认重定向/permission/page
          meta: {
            title: '', //i18n
            icon: 'international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
            roles: [] //["admin"]
          },
          children: []
        },
        showMenuRole: false,
        menuRoleItmen: {
          path: '', ///i18n
          component: '', //Layout
          alwaysShow: true,
          hidden: false, //true
          name: '', //i18n
          redirect: '', //默认重定向/permission/page
          meta: {
            title: '', //i18n
            icon: 'international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
            roles: [] //["admin"]
          },
          children: []
        },


        tableKey: 0,
        list: null,
        total: 1,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          user_name: '',
          user_account: '',
          sort: '',
          importance: undefined,
          title: undefined,
          type: undefined
        },
        userlist: {
          page: 1,
          limit: 20,
          user_name: '',
          user_account: '',
          sort: '',
          importance: undefined,
          title: undefined,
          type: undefined
        },



        showReviewer: false,
        temp: {
          user_name: '',
          status: 1,
          sort: '',
          user_account: '',
          user_password: '',
          images: '',
          page: 1,
          limit: 20,
          user_name: '',
          user_account: '',
          sort: '',
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
      this.getList();
    },
    methods: {
      getList() {
        var that = this;
        that.userlist = { ...that.userlist,
          ...that.listQuery
        }
        that.listLoading = true;

        users
          .lists(that.userlist)
          .then(function(response) {
            //成功400或401 执行。
            //$this.dd = response.data;//获取后台数据
            //console.log(response.data.access_token);
            console.log(response);

            let list = response.data.items;
            for (var i in list) {
              var str = list[i].images;
              console.log(str)
              if (list[i].images) {
                list[i].images = list[i].images.replace(/\\/g, "/")
              }

            }
            that.list = list;


            that.listQuery = response.data;
            that.listLoading = false;
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        row.status = status;
      },
      sortChange(data) {
        const {
          prop,
          order
        } = data;
        if (prop === 'id') {
          this.sortByID(order);
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '';
        } else {
          this.listQuery.sort = '';
        }
        this.handleFilter();
      },
      resetTemp() {
        this.temp = {
          user_name: '',
          status: 1,
          sort: '',
          user_account: '',
          user_password: '',
          images: ''
        };
      },
      onAddUser() {
        this.resetTemp();
        this.dialogStatus = 'create';
        (this.dialogFormVisible = true),
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });
      },
      createData() {
        var that = this;
        var data = this.temp;
        console.log(data);
        users
          .createUser(data)
          .then(function(response) {
            //成功400或401 执行。
            //$this.dd = response.data;//获取后台数据
            //console.log(response.data.access_token);
            console.log(response);
            that.list = response.data.items;
            that.listLoading = false;
            that.dialogFormVisible = false;
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      onUpdateBtn(row) {
        this.temp = Object.assign({}, row); // copy obj
        console.log(row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });
      },
      onUserUpdata() {
        var that = this;
        var arg = arguments;

        const tempData = Object.assign({}, that.temp);
        users
          .userEdit(tempData)
          .then(function(response) {
            // console.log(response);
            that.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
            if (arg.length > 0) {
              return false
            }
            that.getList();
            that.dialogFormVisible = false;
          })
          .catch(function(error) {
            console.log(error);
          });

      },
      handleDelete(row, index) {
        // console.log(row,index);
        var that = this;
        var data = {
          admin_user_id: row.admin_user_id
        };

        users
          .userDelete(data)
          .then(function(response) {
            console.log(response);
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            that.list.splice(index, 1);
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData;
          this.dialogPvVisible = true;
        });
      },
      handleDownload() {
        this.downloadLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status'];
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status'];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          });
          this.downloadLoading = false;
        });
      },
      formatJson(filterVal) {
        return this.list.map(v =>
          filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j]);
            } else {
              return v[j];
            }
          })
        );
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort;
        return sort === `+${key}` ? 'ascending' : 'descending';
      },
      cropSuccess(resData) {
        console.log(resData);
        this.imagecropperShow = false;
        this.imagecropperKey = this.imagecropperKey + 1;
        this.image = resData.files.avatar;
      },
      close() {
        this.imagecropperShow = false;
      },
      //自定义上传图片
      uploadFile(params) {
        var that = this;
        let file = params.file;
        let imageType = file.type;
        let isImage = null;
        if (imageType != 'image/jpeg' && imageType != 'image/jpg' && imageType != 'image/png') {
          isImage = false;
        } else {
          isImage = true;
        }
        let isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
          this.open('上传头像图片只能是 JPG/PNG/JPEG 格式!');
          return;
        }
        if (!isLt2M) {
          this.open('图片最大不能超过2M!');
          return;
        }
        let formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'images');
        formData.append('filename', 'file');
        formData.append('mode', 'adminuser');
        formData.type = 'images';
        formData.filename = 'file';
        formData.mode = 'adminuser';

        axios({
          url: 'http://ruiguo.ruiguohealth.com/api/public/index.php/api/v1/upload/mono_file',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          if (response.data.code == 0) {
            that.open(response.data.msg);
          } else {
            that.image = response.data.data.img_whole;
            that.temp.images = response.data.data.img_paths;
          }
        });
      },
      handleAvatarSuccess() {
        console.log('成功handleAvatarSuccess');
      },
      beforeAvatarUpload() {
        console.log('beforeAvatarUpload');
      },

      onUserStatus(row) {
        if (row != "temp") {
          this.temp = row;
          this.onUserUpdata({
            status: true
          });
        }

        //开关

      },
      onPageSizeChange(Size) {
        this.listQuery.limit = Size;
        //  console.log(pageSize,this.listQuery);
        this.getList();
      },
      onPageNumderChange(PageNumder) {
        this.listQuery.page = PageNumder
        console.log(PageNumder, this.listQuery);
        this.getList();
        //页数变化
      },
      // tree列表
      // tree权限
      onEditPermission(row) {
        console.log(row);
        //tree
        this.showTree = true;
      },
      append(data, addroles) {
        var newChild = {
          path: '/components',
          component: "Layout",
          redirect: '/',
          alwaysShow: true,
          hidden: false, //true
          name: 'ComponentDemo',
          addroles: false,
          children: [],
        };
        data.addroles = addroles == true ? true : false;
        newChild = addroles == true ? true : false;
        //id>0并且meta不存在

        if (!addroles) {
          newChild.meta = {
            title: 'ComponentDemo', //i18n
            icon: 'international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
            roles: ["admin"]
          }
        }

        if (addroles == true) {
          //newChild.meta=false;
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild);
          console.log("添加权限==>" + !newChild.meta, !newChild.children, newChild.addroles, data)

          var treeData = this.treeData;
          this.treeData = treeData;
          // routes.addRoutes(data)
          //   .then(function(response) {
          //     console.log(response);
          //     that.$notify({
          //       title: '成功',
          //       message: '添加成功',
          //       type: 'success',
          //       duration: 2000
          //     });
          //    // that.list.splice(index, 1);
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
        } else if (addroles == false) {
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild);

          console.log("添加菜单==>" + newChild.meta, newChild.path, newChild.children, newChild.addroles, data)
          var treeData = this.treeData;
          this.treeData = treeData;
          // routes.addRoutes(data)
          //   .then(function(response) {
          //     console.log(response);
          //     that.$notify({
          //       title: '成功',
          //       message: '添加成功',
          //       type: 'success',
          //       duration: 2000
          //     });
          //    // that.list.splice(index, 1);
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
        } else {
          console.log("添加一级菜单")
          if (!data.children) {
            this.$set(data, 'children', []);
          }

          this.treeData.push(newChild);
          var treeData = this.treeData;
          this.treeData = treeData;
          // routes.addRoutes(data)
          //   .then(function(response) {
          //     console.log(response);
          //     that.$notify({
          //       title: '成功',
          //       message: '添加成功',
          //       type: 'success',
          //       duration: 2000
          //     });
          //    // that.list.splice(index, 1);
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
        }
        // console.log("静态添加", data, newChild);
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      confirmRole() {
        console.log("确定");
        this.showTree = false;
      }
    }
  };
</script>
<style>
  .pan-item {
    width: 50%;
    height: 15rem;
    border-radius: 50%;
  }

  .userImg {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;

  }

  .app {
    width: 100%;
    display: flex;
    justify-content: center;
    /* flex-direction:row; */
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
