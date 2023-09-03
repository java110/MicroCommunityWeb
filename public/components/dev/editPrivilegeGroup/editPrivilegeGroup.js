(function (vc) {
    vc.extends({
        data: {
            editPrivilegeGroupInfo: {
                pgId: '',
                name: '',
                description: '',
                errorInfo: '',
                seq: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editPrivilegeGroup', 'openPrivilegeGroupModel', function (_params) {
                vc.copyObject(_params, vc.component.editPrivilegeGroupInfo)
                $('#editPrivilegeGroupModel').modal('show');
            });
        },
        methods: {
            editPrivilegeGroupValidate() {
                return vc.validate.validate({
                    editPrivilegeGroupInfo: vc.component.editPrivilegeGroupInfo
                }, {
                    'editPrivilegeGroupInfo.pgId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "角色ID不能为空"
                        }
                    ],
                    'editPrivilegeGroupInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "角色名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "角色名称长度必须在2位至10位"
                        }
                    ],
                    'editPrivilegeGroupInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "角色描述长度不能超过200位"
                        }
                    ]
                });
            },
            saveEditPrivilegeGroup: function () {
                if (!vc.component.editPrivilegeGroupValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editPrivilegeGroupInfo.errorInfo = "";
                vc.http.apiPost(
                    '/edit.privilegeGroup.info',
                    JSON.stringify(vc.component.editPrivilegeGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPrivilegeGroupModel').modal('hide');
                            vc.component.clearEditPrivilegeGroupInfo();
                            vc.component.$emit('privilegeGroup_loadPrivilegeGroup', {});
                            vc.emit('roleDiv', '_loadRole', {})
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                        vc.component.editPrivilegeGroupInfo.errorInfo = json;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.editPrivilegeGroupInfo.errorInfo = errInfo;
                    });
            },
            clearEditPrivilegeGroupInfo: function () {
                vc.component.editPrivilegeGroupInfo = {
                    pgId: '',
                    name: '',
                    description: '',
                    errorInfo: '',
                    seq: ''
                };
            }
        }
    });
})(window.vc);