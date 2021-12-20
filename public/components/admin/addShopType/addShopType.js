(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addShopTypeInfo: {
                shopTypeId: '',
                shopTypeId: '',
                typeName: '',
                isShow: '',
                isDefault: '',
                seq: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addShopType', 'openAddShopTypeModal', function() {
                $('#addShopTypeModel').modal('show');
            });
        },
        methods: {
            addShopTypeValidate() {
                return vc.validate.validate({
                    addShopTypeInfo: vc.component.addShopTypeInfo
                }, {

                    'addShopTypeInfo.typeName': [{
                            limit: "required",
                            param: "",
                            errInfo: "店铺类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "店铺类型太长"
                        },
                    ],
                    'addShopTypeInfo.isShow': [{
                        limit: "required",
                        param: "",
                        errInfo: "是否展示不能为空"
                    }, ],
                    'addShopTypeInfo.isDefault': [{
                        limit: "required",
                        param: "",
                        errInfo: "是否默认不能为空"
                    }, ],
                    'addShopTypeInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "显示序号不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "显示序号不是有效数字"
                        },
                    ],
                    'addShopTypeInfo.remark': [{
                        limit: "maxLength",
                        param: "120",
                        errInfo: "描述太长"
                    }, ],




                });
            },
            saveShopTypeInfo: function() {
                if (!vc.component.addShopTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addShopTypeInfo);
                    $('#addShopTypeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/shopType/saveShopType',
                    JSON.stringify(vc.component.addShopTypeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addShopTypeModel').modal('hide');
                            vc.component.clearAddShopTypeInfo();
                            vc.emit('shopTypeManage', 'listShopType', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddShopTypeInfo: function() {
                vc.component.addShopTypeInfo = {
                    shopTypeId: '',
                    typeName: '',
                    isShow: '',
                    isDefault: '',
                    seq: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);