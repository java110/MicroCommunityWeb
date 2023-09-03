(function (vc, vm) {
    vc.extends({
        data: {
            editDataPrivilegeInfo: {
                dpId: '',
                name: '',
                code: '',
                communityId: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editDataPrivilege', 'openEditDataPrivilegeModal', function (_params) {
                vc.component.refreshEditDataPrivilegeInfo();
                $('#editDataPrivilegeModel').modal('show');
                vc.copyObject(_params, vc.component.editDataPrivilegeInfo);
                vc.component.editDataPrivilegeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editDataPrivilegeValidate: function () {
                return vc.validate.validate({
                    editDataPrivilegeInfo: vc.component.editDataPrivilegeInfo
                }, {
                    'editDataPrivilegeInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        }
                    ],
                    'editDataPrivilegeInfo.code': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "编号不能超过30"
                        }
                    ],
                    'editDataPrivilegeInfo.communityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "communityId不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "communityId不能超过30"
                        }
                    ],
                    'editDataPrivilegeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "备注不能超过256"
                        }
                    ],
                    'editDataPrivilegeInfo.dpId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editDataPrivilege: function () {
                if (!vc.component.editDataPrivilegeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/dataPrivilege.updateDataPrivilege',
                    JSON.stringify(vc.component.editDataPrivilegeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editDataPrivilegeModel').modal('hide');
                            vc.emit('dataPrivilegeDiv', '_loadDataPrivilege', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditDataPrivilegeInfo: function () {
                vc.component.editDataPrivilegeInfo = {
                    dpId: '',
                    name: '',
                    code: '',
                    communityId: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);