/**
 编辑员工
 **/
(function (vc) {
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        data: {
            editStaffInfo: {
                userId: '',
                username: '',
                email: '',
                tel: '',
                sex: '',
                address: '',
                errorInfo: '',
                videoPlaying: false,
                photo: '',
                photoUrl:'',
                relCd: '',
                relCds: [],
                branchOrgs: [],
                departmentOrgs: [],
                parentOrgId: '',
                orgId: ''
            }
        },
        _initMethod: function () {
            vc.getDict('u_org_staff_rel', "rel_cd", function (_data) {
                vc.component.editStaffInfo.relCds = _data;
            });
           
        },
        _initEvent: function () {
            vc.component.$on('edit_staff_event', function (_staffInfo) {
                vc.component.refreshEditStaffInfo(_staffInfo);
                $('#editStaffModel').modal('show');
            });
        },
        methods: {
            refreshEditStaffInfo(_staffInfo) {
                vc.copyObject(_staffInfo, vc.component.editStaffInfo);
                vc.component.editStaffInfo.username = _staffInfo.name;
                vc.component.editStaffInfo.photoUrl = _fileUrl + "?objId=" +
                    vc.component.editStaffInfo.userId + "&communityId=" + vc.getCurrentCommunity().communityId + "&fileTypeCd=12000&time=" + new Date();
            },
            editStaffValidate() {
                return vc.validate.validate({
                    editStaffInfo: vc.component.editStaffInfo
                }, {
                    'editStaffInfo.username': [{
                        limit: "required",
                        param: "",
                        errInfo: "用户名不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "用户名长度必须在2位至10位"
                        },
                    ],
                    'editStaffInfo.tel': [{
                        limit: "required",
                        param: "",
                        errInfo: "手机号不能为空"
                    }],
                    'editStaffInfo.sex': [{
                        limit: "required",
                        param: "",
                        errInfo: "性别不能为空"
                    }],
                    'editStaffInfo.address': [{
                        limit: "required",
                        param: "",
                        errInfo: "地址不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地址长度不能超过200位"
                        },
                    ]
                });
            },
            editStaffSubmit: function () {
                if (!vc.component.editStaffValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editStaffInfo.name = $that.editStaffInfo.username;
                $that.editStaffInfo.staffId = $that.editStaffInfo.userId;
                $that.editStaffInfo.photoUrl = "";
                vc.http.apiPost(
                    '/user.staff.modify',
                    JSON.stringify(vc.component.editStaffInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let  _json = JSON.parse(json);
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if ( _json.code == 0) {
                            //关闭model
                            $('#editStaffModel').modal('hide');
                            vc.emit('staff', 'notify',{})
                            return;
                        }
                        $that.editStaffInfo.photoUrl =  $that.editStaffInfo.photo;
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        // vc.component.editStaffInfo.errorInfo = errInfo;
                        $that.editStaffInfo.photoUrl =  $that.editStaffInfo.photo;

                        vc.toast(errInfo)
                    });
            },
            _uploadEditPhoto: function (event) {
                $("#uploadEditStaffPhoto").trigger("click")
            },
            _chooseEditPhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    let file = photoFiles[0]; // 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 2) {
                        vc.toast("图片大小不能超过 2MB!")
                        return false;
                    }
                    let reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    reader.onloadend = function (e) {
                        vc.component.editStaffInfo.photo = reader.result;
                        vc.component.editStaffInfo.photoUrl = reader.result;

                    }
                }
            },
        },
    });
})(window.vc);