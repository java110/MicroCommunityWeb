(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addResourceStoreInfo: {
                unitCode: '',
                miniUnitCode: '',
                miniUnitStock: '',
                unitCodes: [],
                resId: '',
                rstId: '',
                rssId: '',
                resName: '',
                resCode: '',
                price: '',
                outLowPrice: '',
                outHighPrice: '',
                showMobile: 'N',
                description: '',
                remark: '',
                shId: '',
                photos: [],
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSpecifications: [],
                warningStock: ''
            }
        },
        _initMethod: function () {
            //与字典表单位关联
            vc.getDict('resource_store', "unit_code", function (_data) {
                vc.component.addResourceStoreInfo.unitCodes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addResourceStore', 'openAddResourceStoreModal', function () {
                $that._listAddResourceStoreType();
                $that._listAddStorehouses();
                $('#addResourceStoreModel').modal('show');
            });
            vc.on("addResourceStore", "notifyUploadImage", function (_param) {
                vc.component.addResourceStoreInfo.photos = _param;
            });
        },
        methods: {
            addResourceStoreValidate() {
                return vc.validate.validate({
                    addResourceStoreInfo: vc.component.addResourceStoreInfo
                }, {
                    'addResourceStoreInfo.resName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,100",
                            errInfo: "物品名称长度为2至100"
                        },
                    ],
                    'addResourceStoreInfo.resCode': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "物品编码不能超过50位"
                        },
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品编码不能为空"
                        }
                    ],
                    'addResourceStoreInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "物品价格格式错误"
                        },
                    ],
                    'addResourceStoreInfo.warningStock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "警告库存不能为空"
                        },
                        {
                            limit: "min",
                            param: "0",
                            errInfo: "警告库存最小为零"
                        }
                    ],
                    'addResourceStoreInfo.miniUnitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最小计量单位不能为空"
                        },
                    ],
                    'addResourceStoreInfo.miniUnitStock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最小计量单位数量不能为空"
                        },
                    ],
                    'addResourceStoreInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能为空"
                        },
                    ],
                    'addResourceStoreInfo.showMobile': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机端显示不能为空"
                        },
                    ],
                    'addResourceStoreInfo.outLowPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最低收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'addResourceStoreInfo.outHighPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最高收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'addResourceStoreInfo.unitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单位不能为空"
                        },
                    ],
                    'addResourceStoreInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型不能为空"
                        },
                    ],
                    'addResourceStoreInfo.shId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库不能为空"
                        },
                    ]
                });
            },
            saveResourceStoreInfo: function () {
                if (!vc.component.addResourceStoreValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addResourceStoreInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addResourceStoreInfo);
                    $('#addResourceStoreModel').modal('hide');
                    return;
                }
                vc.http.post(
                    'addResourceStore',
                    'save',
                    JSON.stringify(vc.component.addResourceStoreInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addResourceStoreModel').modal('hide');
                            vc.component.clearAddResourceStoreInfo();
                            vc.emit('resourceStoreManage', 'pageReload', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询物品类型
            _listAddResourceStoreType: function () {
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
                        var _resourceStoreType = JSON.parse(json);
                        vc.component.addResourceStoreInfo.resourceStoreTypes = _resourceStoreType.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 分类改变事件
            resourceStoreTypesOnChangeAdd: function () {
                console.log('111');
                if (vc.component.addResourceStoreInfo.rstId == '') {
                    vc.component.resourceStoreSpecification = [];
                    return;
                }
                vc.component._loadResourceStoreSpecificationAdd();
            },
            // 根据分类查询规格
            _loadResourceStoreSpecificationAdd: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: vc.component.addResourceStoreInfo.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _addResourceStoreInfo = JSON.parse(json);
                        vc.component.addResourceStoreInfo.resourceStoreSpecifications = _addResourceStoreInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddResourceStoreInfo: function () {
                vc.component.addResourceStoreInfo = {
                    resName: '',
                    resCode: '',
                    rstId: '',
                    price: '',
                    description: '',
                    outLowPrice: '',
                    outHighPrice: '',
                    showMobile: '',
                    remark: '',
                    unitCode: '',
                    shId: '',
                    unitCodes: [],
                    photos: [],
                    storehouses: [],
                    warningStock: ''
                };
            },
            _listAddStorehouses: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        shType: '2806',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        vc.component.addResourceStoreInfo.storehouses = _storehouseManageInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
