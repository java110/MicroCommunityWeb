(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addResourceStoreSpecificationInfo: {
                rssid: '',
                specName: '',
                parentRstId: '',
                rstId: '',
                description: '',
                resourceStoreTypes: [],
                sonResourceStoreTypes: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addResourceStoreSpecification', 'openAddResourceStoreSpecificationModal', function () {
                $('#addResourceStoreSpecificationModel').modal('show');
                vc.component._listResourceStoreTypesAdd();
            });
        },
        methods: {
            addResourceStoreSpecificationValidate() {
                return vc.validate.validate({
                    addResourceStoreSpecificationInfo: vc.component.addResourceStoreSpecificationInfo
                }, {
                    'addResourceStoreSpecificationInfo.specName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "255",
                            errInfo: "规格名称太长"
                        },
                    ],
                    'addResourceStoreSpecificationInfo.parentRstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "商品类型格式错误"
                        },
                    ],
                    'addResourceStoreSpecificationInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择二级分类"
                        }
                    ],
                    'addResourceStoreSpecificationInfo.description': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],


                });
            },
            saveResourceStoreSpecificationInfo: function () {
                if (!vc.component.addResourceStoreSpecificationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addResourceStoreSpecificationInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addResourceStoreSpecificationInfo);
                    $('#addResourceStoreSpecificationModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'resourceStore.saveResourceStoreSpecification',
                    JSON.stringify(vc.component.addResourceStoreSpecificationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addResourceStoreSpecificationModel').modal('hide');
                            vc.component.clearAddResourceStoreSpecificationInfo();
                            vc.emit('resourceStoreSpecificationManage', 'listResourceStoreSpecification', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            // 分类改变事件
            resourceStoreSpecificationTypesOnChangeAdd: function () {
                vc.component.addResourceStoreSpecificationInfo.rstId = '';
                vc.component.addResourceStoreSpecificationInfo.sonResourceStoreTypes = [];
                if (vc.component.addResourceStoreSpecificationInfo.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: vc.component.addResourceStoreSpecificationInfo.parentRstId,
                        flag: "0"
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeInfo = JSON.parse(json);
                        vc.component.addResourceStoreSpecificationInfo.sonResourceStoreTypes = _resourceStoreTypeInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypesAdd: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.addResourceStoreSpecificationInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddResourceStoreSpecificationInfo: function () {
                vc.component.addResourceStoreSpecificationInfo = {
                    rssid: '',
                    specName: '',
                    parentRstId: '',
                    rstId: '',
                    description: '',
                    resourceStoreTypes: [],
                    sonResourceStoreTypes: []
                };
            }
        }
    });

})(window.vc);
