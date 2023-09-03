(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addItemReleaseTypeInfo: {
                typeId: '',
                typeName: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addItemReleaseType', 'openAddItemReleaseTypeModal', function () {
                $('#addItemReleaseTypeModel').modal('show');
            });
        },
        methods: {
            addItemReleaseTypeValidate() {
                return vc.validate.validate({
                    addItemReleaseTypeInfo: vc.component.addItemReleaseTypeInfo
                }, {
                    'addItemReleaseTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "类型名称不能超过30"
                        }
                    ],
                    'addItemReleaseTypeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ]
                });
            },
            saveItemReleaseTypeInfo: function () {
                if (!vc.component.addItemReleaseTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addItemReleaseTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/itemRelease.saveItemReleaseType',
                    JSON.stringify(vc.component.addItemReleaseTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addItemReleaseTypeModel').modal('hide');
                            vc.component.clearAddItemReleaseTypeInfo();
                            vc.emit('itemReleaseTypeManage', 'listItemReleaseType', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddItemReleaseTypeInfo: function () {
                vc.component.addItemReleaseTypeInfo = {
                    typeName: '',
                    flowName: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
