(function (vc) {
    vc.extends({
        data: {
            forceFinishRepairInfo: {
                repairId: '',
                repairType: '',
                staffId: '',
                staffName: '',
                context: '',
                action: '',
                repairObjType: '',
                maintenanceType: '',
                resId: '',
                rsId: '',
                isCustom: false,
                customGoodsName: '',
                price: '',
                outLowPrice: '',
                outHighPrice: '',
                useNumber: 1,
                rstId: '',
                payType: '',
                mark: 1,
                selectedGoodsInfo: {},
                payTypes: [],
                resourceStores: [],
                sonResourceStoreTypes: [],
                resourceStoreTypes: [],
                maintenanceTypes: [],
                repairTypeUsers: []
            }
        },
        _initMethod: function () {
            //与字典表支付方式关联
            vc.getDict('r_repair_pool', "maintenance_type", function (_data) {
                vc.component.forceFinishRepairInfo.maintenanceTypes = _data;
            });
            //与字典表支付方式关联
            vc.getDict('r_repair_pool', "pay_type", function (_data) {
                vc.component.forceFinishRepairInfo.payTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('forceFinishRepair', 'openDispatchRepairModal', function (_repair) {
                // vc.copyObject(_repair, $that.forceFinishRepairInfo);
                $that.forceFinishRepairInfo.repairId = _repair.repairId;
                $that.forceFinishRepairInfo.repairObjType = _repair.repairObjType;
                vc.component._listResourceStoreType();
                $('#forceFinishRepairModel').modal('show');
            });
        },
        methods: {
            forceFinishRepairValidate() {
                return vc.validate.validate({
                    forceFinishRepairInfo: vc.component.forceFinishRepairInfo
                }, {
                    'forceFinishRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'forceFinishRepairInfo.repairObjType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修对象类型不能为空"
                        }
                    ],
                    'forceFinishRepairInfo.maintenanceType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "维修类型不能为空"
                        }
                    ],
                    'forceFinishRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明不能为空"
                        }
                    ]
                });
            },
            _forceFinishRepairInfo: function () {
                if (!vc.component.forceFinishRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.forceFinishRepairInfo.maintenanceType == '1001' || vc.component.forceFinishRepairInfo.maintenanceType == '1003') { //1001 有偿服务；1002 无偿服务；1003 需要用料；1004 无需用料
                    if (vc.component.forceFinishRepairInfo.rsId == null || vc.component.forceFinishRepairInfo.rsId == '' || vc.component.forceFinishRepairInfo.rsId == undefined) {
                        vc.toast("商品类型不能为空");
                        return;
                    }
                    if (!vc.component.forceFinishRepairInfo.isCustom) {
                        if (vc.component.forceFinishRepairInfo.rstId == null || vc.component.forceFinishRepairInfo.rstId == '' || vc.component.forceFinishRepairInfo.rstId == undefined) {
                            vc.toast("二级分类不能为空");
                            return;
                        }
                        if (vc.component.forceFinishRepairInfo.resId == null || vc.component.forceFinishRepairInfo.resId == '' || vc.component.forceFinishRepairInfo.resId == undefined) {
                            vc.toast("商品不能为空");
                            return;
                        }
                    }
                    if (vc.component.forceFinishRepairInfo.isCustom) {
                        if (vc.component.forceFinishRepairInfo.customGoodsName == null || vc.component.forceFinishRepairInfo.customGoodsName == ''
                            || vc.component.forceFinishRepairInfo.customGoodsName == undefined) {
                            vc.toast("商品名不能为空");
                            return;
                        }
                        if (vc.component.forceFinishRepairInfo.maintenanceType == '1001') {
                            if (vc.component.forceFinishRepairInfo.price == null || vc.component.forceFinishRepairInfo.price == '' || vc.component.forceFinishRepairInfo.price == undefined) {
                                vc.toast("价格不能为空");
                                return;
                            }
                        }
                    }
                    if (vc.component.forceFinishRepairInfo.maintenanceType == '1001') {
                        if (vc.component.forceFinishRepairInfo.payType == null || vc.component.forceFinishRepairInfo.payType == '' || vc.component.forceFinishRepairInfo.payType == undefined) {
                            vc.toast("支付方式不能为空");
                            return;
                        }
                    }
                }
                vc.component.forceFinishRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairForceFinish',
                    JSON.stringify(vc.component.forceFinishRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#forceFinishRepairModel').modal('hide');
                            vc.component.clearDispatchRepairInfo();
                            vc.emit('repairPoolManage', 'listRepairPool', {});
                            vc.emit('repairForceFinishManage', 'listRepairPool', {});
                            vc.toast("操作成功");
                        } else if (_json.code == 404) {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearDispatchRepairInfo: function () {
                vc.component.forceFinishRepairInfo = {
                    repairId: '',
                    repairType: '',
                    staffId: '',
                    staffName: '',
                    context: '',
                    action: '',
                    repairObjType: '',
                    maintenanceType: '',
                    resId: '',
                    rsId: '',
                    isCustom: false,
                    customGoodsName: '',
                    price: '',
                    outLowPrice: '',
                    outHighPrice: '',
                    useNumber: 1,
                    rstId: '',
                    payType: '',
                    mark: 1,
                    selectedGoodsInfo: {},
                    payTypes: [],
                    resourceStores: [],
                    sonResourceStoreTypes: [],
                    resourceStoreTypes: [],
                    maintenanceTypes: [],
                    repairTypeUsers: []
                };
            },
            _listRepairTypeUsers: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairType: $that.forceFinishRepairInfo.repairType,
                        state: '9999'
                    }
                };
                //发送get请求
                vc.http.apiGet('repair.listRepairTypeUsers',
                    param,
                    function (json, res) {
                        var _repairTypeUserManageInfo = JSON.parse(json);
                        vc.component.forceFinishRepairInfo.repairTypeUsers = _repairTypeUserManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询物品类型
            _listResourceStoreType: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1000,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId:'0',
                        giveType: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreType = JSON.parse(json);
                        vc.component.forceFinishRepairInfo.resourceStoreTypes = _resourceStoreType.data;
                        // 前端添加自定义类
                        vc.component._appendCustomResourceStoreType();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 追加自定义类
            _appendCustomResourceStoreType: function () {
                let customeType = {
                    rstId: 'custom',
                    name: '自定义'
                };
                vc.component.forceFinishRepairInfo.resourceStoreTypes.push(customeType);
            },
            //查询二级分类
            _listSonResourceStoreType: function () {
                // 清空二级分类
                vc.component.forceFinishRepairInfo.rstId = '';
                vc.component.forceFinishRepairInfo.sonResourceStoreTypes = [];
                // 处理自定义商品
                vc.component.forceFinishRepairInfo.isCustom = false;
                if (vc.component.forceFinishRepairInfo.rsId == 'custom') {
                    vc.component.forceFinishRepairInfo.isCustom = true;
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        parentId: vc.component.forceFinishRepairInfo.rsId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _sonResourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.forceFinishRepairInfo.sonResourceStoreTypes = _sonResourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //选择商品类型
            _choseGoods: function () {
                vc.component.forceFinishRepairInfo.resId = '';
                if (vc.component.forceFinishRepairInfo.rstId == null || vc.component.forceFinishRepairInfo.rstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        repairId: vc.component.forceFinishRepairInfo.repairId,
                        rstId: vc.component.forceFinishRepairInfo.rstId,
                        resId: vc.component.forceFinishRepairInfo.resId,
                        communityId: vc.getCurrentCommunity().communityId,
                        chooseType: "repair",
                        flag: 1,
                        sign: 1,
                        giveType: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listUserStorehouses',
                    param,
                    function (json, res) {
                        var _goods = JSON.parse(json);
                        if (_goods.total <= 0) {
                            vc.toast('暂无有效商品');
                        }
                        vc.component.forceFinishRepairInfo.resourceStores = _goods.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //选择商品
            _chosePrice: function () {
                var select = document.getElementById("goodsPrice");
                vc.component.forceFinishRepairInfo.resId = select.value;
                // 保存选中的商品信息
                vc.component.forceFinishRepairInfo.resourceStores.forEach((item) => {
                    if (item.resId == select.value) {
                        vc.component.forceFinishRepairInfo.selectedGoodsInfo = item;
                    }
                })
                if (vc.component.forceFinishRepairInfo.selectedGoodsInfo.outLowPrice == vc.component.forceFinishRepairInfo.selectedGoodsInfo.outHighPrice) {
                    vc.component.forceFinishRepairInfo.price = vc.component.forceFinishRepairInfo.selectedGoodsInfo.outLowPrice;
                } else {
                    vc.component.forceFinishRepairInfo.price = '';
                }
                vc.component.forceFinishRepairInfo.outLowPrice = vc.component.forceFinishRepairInfo.selectedGoodsInfo.outLowPrice;
                vc.component.forceFinishRepairInfo.outHighPrice = vc.component.forceFinishRepairInfo.selectedGoodsInfo.outHighPrice;
            },
            // 商品数量减少
            _useNumDec: function () {
                if (vc.component.forceFinishRepairInfo.useNumber <= 1) {
                    vc.toast("不能再减少了");
                    return;
                }
                vc.component.forceFinishRepairInfo.useNumber -= 1;
            },
            // 商品数量增加
            _useNumInc: function () {
                vc.component.forceFinishRepairInfo.useNumber += 1;
            },

            // 选择商品
            /*_openChooseSingleResourceModel: function () {
                vc.emit('forceFinishRepair', 'chooseSingleResource', 'openChooseSingleResourceModel', {maintenanceType: vc.component.forceFinishRepairInfo.maintenanceType});
            },*/

        }
    });
})(window.vc);
