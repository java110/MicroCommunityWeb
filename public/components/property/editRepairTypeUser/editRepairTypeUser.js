(function (vc, vm) {
    vc.extends({
        data: {
            editRepairTypeUserInfo: {
                states: [],
                typeUserId: '',
                state: '',
                remark: '',
                repairType: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editRepairTypeUser', 'openEditRepairTypeUserModal', function (_params) {
                vc.component.refreshEditRepairTypeUserInfo();
                $('#editRepairTypeUserModel').modal('show');
                vc.copyObject(_params, vc.component.editRepairTypeUserInfo);
                vc.component.editRepairTypeUserInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editRepairTypeUserValidate: function () {
                return vc.validate.validate({
                    editRepairTypeUserInfo: vc.component.editRepairTypeUserInfo
                }, {
                    'editRepairTypeUserInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        }
                    ],
                    'editRepairTypeUserInfo.typeUserId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "数据异常"
                        }]
                });
            },
            editRepairTypeUser: function () {
                if (!vc.component.editRepairTypeUserValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'repair.updateRepairTypeUser',
                    JSON.stringify(vc.component.editRepairTypeUserInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editRepairTypeUserModel').modal('hide');
                            vc.emit('repairTypeUserManage', 'listRepairTypeUser', {});
                            return;
                        }
                        vc.message(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditRepairTypeUserInfo: function () {
                vc.component.editRepairTypeUserInfo = {
                    typeUserId: '',
                    state: '',
                    remark: '',
                    repairType: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
