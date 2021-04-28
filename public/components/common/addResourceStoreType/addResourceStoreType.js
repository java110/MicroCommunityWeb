(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addResourceStoreTypeInfo: {
                goodsType: '',
                name: '',
                description: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addResourceStoreType', 'openAddResourceStoreTypeModal', function () {
                $('#addResourceStoreTypeModel').modal('show');
            });
        },
        methods: {
            addResourceStoreTypeValidate() {
                return vc.validate.validate({
                    addResourceStoreTypeInfo: vc.component.addResourceStoreTypeInfo
                }, {
                    'addResourceStoreTypeInfo.goodsType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型编码不能为空"
                        }
                    ],
                    'addResourceStoreTypeInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型名称不能为空"
                        },
                    ],
                    'addResourceStoreTypeInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能超过200位"
                        },
                    ]
                });
            },
            saveResourceStoreTypeInfo: function () {
                if (!vc.component.addResourceStoreTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addResourceStoreTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addResourceStoreTypeInfo);
                    $('#addResourceStoreTypeModel').modal('hide');
                    return;
                }
                vc.http.post('addResourceStoreType',
                    'save',
                    JSON.stringify(vc.component.addResourceStoreTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addResourceStoreTypeModel').modal('hide');
                            vc.component.clearAddResourceStoreTypeInfo();
                            vc.emit('resourceStoreTypeManage', 'listResourceStoreType', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddResourceStoreTypeInfo: function () {
                vc.component.addResourceStoreTypeInfo = {
                    goodsType: '',
                    name: '',
                    description: ''
                };
            }
        }
    });
})(window.vc);
