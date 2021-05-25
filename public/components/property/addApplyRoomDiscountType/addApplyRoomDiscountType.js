(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addApplyRoomDiscountTypeInfo: {
                applyType: '',
                typeName: '',
                typeDesc: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addApplyRoomDiscountType', 'openAddApplyRoomDiscountTypeModal', function () {
                $('#addApplyRoomDiscountTypeModel').modal('show');
            });
        },
        methods: {
            addApplyRoomDiscountTypeValidate() {
                return vc.validate.validate({
                    addApplyRoomDiscountTypeInfo: vc.component.addApplyRoomDiscountTypeInfo
                }, {
                    'addApplyRoomDiscountTypeInfo.typeName': [
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
                    'addApplyRoomDiscountTypeInfo.typeDesc': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "类型描述错误"
                        },
                    ],




                });
            },
            saveApplyRoomDiscountTypeInfo: function () {
                if (!vc.component.addApplyRoomDiscountTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addApplyRoomDiscountTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addApplyRoomDiscountTypeInfo);
                    $('#addApplyRoomDiscountTypeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/applyRoomDiscount/saveApplyRoomDiscountType',
                    JSON.stringify(vc.component.addApplyRoomDiscountTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addApplyRoomDiscountTypeModel').modal('hide');
                            vc.component.clearAddApplyRoomDiscountTypeInfo();
                            vc.emit('applyRoomDiscountTypeManage', 'listApplyRoomDiscountType', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddApplyRoomDiscountTypeInfo: function () {
                vc.component.addApplyRoomDiscountTypeInfo = {
                    typeName: '',
                    typeDesc: '',

                };
            }
        }
    });

})(window.vc);
