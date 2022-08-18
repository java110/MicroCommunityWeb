(function (vc, vm) {
    vc.extends({
        data: {
            editApplyRoomDiscountTypeInfo: {
                applyType: '',
                typeName: '',
                typeDesc: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editApplyRoomDiscountType', 'openEditApplyRoomDiscountTypeModal', function (_params) {
                vc.component.refreshEditApplyRoomDiscountTypeInfo();
                $('#editApplyRoomDiscountTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editApplyRoomDiscountTypeInfo);
                vc.component.editApplyRoomDiscountTypeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editApplyRoomDiscountTypeValidate: function () {
                return vc.validate.validate({
                    editApplyRoomDiscountTypeInfo: vc.component.editApplyRoomDiscountTypeInfo
                }, {
                    'editApplyRoomDiscountTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "类型名称格式错误"
                        },
                    ],
                    'editApplyRoomDiscountTypeInfo.typeDesc': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "类型描述错误"
                        },
                    ],
                    'editApplyRoomDiscountTypeInfo.applyType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        }
                    ]
                });
            },
            editApplyRoomDiscountType: function () {
                if (!vc.component.editApplyRoomDiscountTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscount/updateApplyRoomDiscountType',
                    JSON.stringify(vc.component.editApplyRoomDiscountTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editApplyRoomDiscountTypeModel').modal('hide');
                            vc.emit('applyRoomDiscountTypeManage', 'listApplyRoomDiscountType', {});
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
            refreshEditApplyRoomDiscountTypeInfo: function () {
                vc.component.editApplyRoomDiscountTypeInfo = {
                    applyType: '',
                    typeName: '',
                    typeDesc: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
