(function (vc, vm) {

    vc.extends({
        data: {
            editMachineTranslateInfo: {
                machineTranslateId: '',
                machineCode: '',
                machineId: '',
                typeCd: '',
                objName: '',
                objId: '',
                state: '',
                communityId:''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editMachineTranslate', 'openEditMachineTranslateModal', function (_params) {
                vc.component.refreshEditMachineTranslateInfo();
                $('#editMachineTranslateModel').modal('show');
                vc.copyObject(_params, vc.component.editMachineTranslateInfo);
                vc.component.editMachineTranslateInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMachineTranslateValidate: function () {
                return vc.validate.validate({
                    editMachineTranslateInfo: vc.component.editMachineTranslateInfo
                }, {
                    'editMachineTranslateInfo.machineTranslateId':
                        [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "同步ID不能为空"
                            }
                        ]

                })
                    ;
            },
            editMachineTranslate: function () {
                if (!vc.component.editMachineTranslateValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/machine/resendIot',
                    JSON.stringify(vc.component.editMachineTranslateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editMachineTranslateModel').modal('hide');
                            vc.emit('machineTranslateManage', 'listMachineTranslate', {});
                            vc.emit('simplifyOwnerAccessContol', 'listMachineTranslate', {});
                            vc.emit('simplifyOwnerTransactionCar', 'listMachineTranslate', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditMachineTranslateInfo: function () {
                vc.component.editMachineTranslateInfo = {
                    machineTranslateId: '',
                    machineCode: '',
                    machineId: '',
                    typeCd: '',
                    objName: '',
                    objId: '',
                    state: '',
                    communityId:''
                }
            }
        }
    });

})(window.vc, window.vc.component);
