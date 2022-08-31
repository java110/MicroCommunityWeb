(function (vc) {
    vc.extends({
        data: {
            addPrivilegeGroupInfo: {
                name: '',
                description: '',
                errorInfo: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.component.$on('addPrivilegeGroup_openPrivilegeGroupModel', function (_params) {
                $('#addPrivilegeGroupModel').modal('show');
            });
        },
        methods: {
            addPrivilegeGroupValidate() {
                return vc.validate.validate({
                    addPrivilegeGroupInfo: vc.component.addPrivilegeGroupInfo
                }, {
                    'addPrivilegeGroupInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "角色名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "角色名称长度必须在2位至10位"
                        },
                    ],
                    'addPrivilegeGroupInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "角色描述长度不能超过200位"
                        },
                    ]
                });
            },
            saveAddPrivilegeGroup: function () {
                if (!vc.component.addPrivilegeGroupValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addPrivilegeGroupInfo.errorInfo = "";
                vc.http.apiPost(
                    '/save.privilegeGroup.info',
                    JSON.stringify(vc.component.addPrivilegeGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPrivilegeGroupModel').modal('hide');
                            vc.component.clearAddPrivilegeGroupInfo();
                            vc.component.$emit('privilegeGroup_loadPrivilegeGroup', {});
                            vc.emit('roleDiv', '_loadRole', {})
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                        vc.component.addPrivilegeGroupInfo.errorInfo = json;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.addPrivilegeGroupInfo.errorInfo = errInfo;
                    });
            },
            clearAddPrivilegeGroupInfo: function () {
                vc.component.addPrivilegeGroupInfo = {
                    name: '',
                    description: '',
                    errorInfo: ''
                };
            }
        }
    });
})(window.vc);