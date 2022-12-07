(function (vc, vm) {
    vc.extends({
        data: {
            editMeterTypeInfo: {
                typeId: '',
                typeName: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editMeterType', 'openEditMeterTypeModal', function (_params) {
                vc.component.refreshEditMeterTypeInfo();
                $('#editMeterTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editMeterTypeInfo);
                vc.component.editMeterTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMeterTypeValidate: function () {
                return vc.validate.validate({
                    editMeterTypeInfo: vc.component.editMeterTypeInfo
                }, {
                    'editMeterTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "名称不能超过12"
                        }
                    ],
                    'editMeterTypeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明不能超过200"
                        }
                    ],
                    'editMeterTypeInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "抄表类型不能为空"
                        }
                    ]
                });
            },
            editMeterType: function () {
                if (!vc.component.editMeterTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'meterType.updateMeterType',
                    JSON.stringify(vc.component.editMeterTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMeterTypeModel').modal('hide');
                            vc.emit('meterTypeManage', 'listMeterType', {});
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
            refreshEditMeterTypeInfo: function () {
                vc.component.editMeterTypeInfo = {
                    typeId: '',
                    typeName: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
