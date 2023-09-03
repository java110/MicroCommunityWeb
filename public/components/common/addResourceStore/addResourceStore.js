(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addResourceStoreInfo: {
                unitCode: '',
                miniUnitCode: '1001',
                miniUnitStock: '1',
                unitCodes: [],
                resId: '',
                parentRstId: '',
                rstId: '',
                rssId: '',
                flag: '',
                resName: '',
                resCode: '',
                price: '',
                outLowPrice: '0',
                outHighPrice: '0',
                showMobile: 'N',
                description: '',
                remark: '',
                shId: '',
                isFixed: 'N',
                photos: [],
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSpecifications: [],
                sonResourceStoreTypes: [],
                isFixeds: [],
                warningStock: '10',
                stock:'0'
            }
        },
        _initMethod: function () {
            //与字典表单位关联
            vc.getDict('resource_store', "unit_code", function (_data) {
                $that.addResourceStoreInfo.unitCodes = _data;
            });
            vc.getDict('resource_store', "is_fixed", function (_data) {
                $that.addResourceStoreInfo.isFixeds = _data;
            });
        },
        _initEvent: function () {
            vc.on('addResourceStore', 'openAddResourceStoreModal', function () {
                $that._listAddResourceStoreType();
                $that._listAddStorehouses();
                $('#addResourceStoreModel').modal('show');
            });
            vc.on("addResourceStore", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    $that.addResourceStoreInfo.photos = [];
                    _param.forEach((item) => {
                        $that.addResourceStoreInfo.photos.push(item.fileId);
                    })
                } else {
                    $that.addResourceStoreInfo.photos = [];
                }
            });
        },
        methods: {
            addResourceStoreValidate() {
                return vc.validate.validate({
                    addResourceStoreInfo: $that.addResourceStoreInfo
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
                        }
                    ],
                    'addResourceStoreInfo.parentRstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型不能为空"
                        }
                    ],
                    'addResourceStoreInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "二级分类不能为空"
                        }
                    ],
                    'addResourceStoreInfo.unitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单位不能为空"
                        }
                    ],
                    'addResourceStoreInfo.isFixed': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否是固定物品不能为空"
                        }
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
                    'addResourceStoreInfo.shId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库不能为空"
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
                        }
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
                        }
                    ],
                    'addResourceStoreInfo.miniUnitStock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最小计量单位数量不能为空"
                        }
                    ],
                    'addResourceStoreInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "物品描述不能超过200位"
                        }
                    ],
                    'addResourceStoreInfo.showMobile': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机端显示不能为空"
                        }
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
                        }
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
                        }
                    ]
                });
            },
            decideAdd: function () {
                if (parseFloat($that.addResourceStoreInfo.outLowPrice) > parseFloat($that.addResourceStoreInfo.outHighPrice)) {
                    vc.toast("最高收费标准不能小于最低收费标准！")
                    $that.addResourceStoreInfo.outHighPrice = "";
                }
            },
            saveResourceStoreInfo: function () {
                if (!$that.addResourceStoreValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addResourceStoreInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, $that.addResourceStoreInfo);
                    $('#addResourceStoreModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/resourceStore.saveResourceStore',
                    JSON.stringify($that.addResourceStoreInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addResourceStoreModel').modal('hide');
                            $that.clearAddResourceStoreInfo();
                            vc.emit('resourceStoreManage', 'listResourceStore', {});
                            vc.emit('addResourceStore', 'uploadImageUrl', 'clearImage', {})
                            vc.toast("添加成功")
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(JSON.parse(errInfo).msg);
                    });
            },
            //查询物品类型
            _listAddResourceStoreType: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId:'0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreType = JSON.parse(json);
                        $that.addResourceStoreInfo.resourceStoreTypes = _resourceStoreType.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 分类改变事件
            resourceStoreTypesOnChangeAdd: function () {
                $that.addResourceStoreInfo.rstId = '';
                $that.addResourceStoreInfo.sonResourceStoreTypes = [];
                if ($that.addResourceStoreInfo.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: $that.addResourceStoreInfo.parentRstId,
                        flag: "0"
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeInfo = JSON.parse(json);
                        $that.addResourceStoreInfo.sonResourceStoreTypes = _resourceStoreTypeInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 分类改变事件
            sonResourceStoreTypesOnChangeAdd: function () {
                if ($that.addResourceStoreInfo.parentRstId == '') {
                    $that.resourceStoreSpecification = [];
                    return;
                }
                $that._loadSonResourceStoreSpecificationAdd();
            },
            // 根据分类查询规格(一级分类)
            _loadResourceStoreSpecificationAdd: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: $that.addResourceStoreInfo.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _addResourceStoreInfo = JSON.parse(json);
                        $that.addResourceStoreInfo.resourceStoreSpecifications = _addResourceStoreInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 根据分类查询规格(二级分类)
            _loadSonResourceStoreSpecificationAdd: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: $that.addResourceStoreInfo.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _addResourceStoreInfo = JSON.parse(json);
                        $that.addResourceStoreInfo.resourceStoreSpecifications = _addResourceStoreInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddResourceStoreInfo: function () {
                let _unitCodes = $that.addResourceStoreInfo.unitCodes;
                let _isFixeds = $that.addResourceStoreInfo.isFixeds;
                let _resourceStoreTypes = $that.addResourceStoreInfo.resourceStoreTypes;
                let _sonResourceStoreTypes = $that.addResourceStoreInfo.sonResourceStoreTypes;
                let _resourceStoreSpecifications = $that.addResourceStoreInfo.resourceStoreSpecifications;
                $that.addResourceStoreInfo = {
                    resName: '',
                    resCode: '',
                    resId: '',
                    parentRstId: '',
                    rstId: '',
                    price: '',
                    description: '',
                    outLowPrice: '0',
                    outHighPrice: '0',
                    showMobile: 'N',
                    remark: '',
                    unitCode: '',
                    shId: '',
                    isFixed: 'N',
                    rssId: '',
                    miniUnitCode: '1001',
                    miniUnitStock: '1',
                    unitCodes: _unitCodes,
                    photos: [],
                    storehouses: [],
                    resourceStoreTypes: _resourceStoreTypes,
                    resourceStoreSpecifications: _resourceStoreSpecifications,
                    sonResourceStoreTypes: _sonResourceStoreTypes,
                    isFixeds: _isFixeds,
                    warningStock: '10',
                    stock:'0'
                };
            },
            _listAddStorehouses: function (_page, _rows) {
                //shType: '2806',
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        $that.addResourceStoreInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);