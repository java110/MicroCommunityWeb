(function (vc) {
    vc.extends({
        data: {
            finishRepairInfo: {
                repairId: '',
                repairType: '',
                context: '',
                feeFlag: '200',
                amount: 0.0,
                repairObjType: '',
                maintenanceTypes: [],
                maintenanceType: '',
                goodsTypes: [],
                resourceStores: [],
                price: '',
                outLowPrice: '',
                outHighPrice: '',
                publicArea: '',
                repairChannel: '',
                conditions: {
                    goodsType: '',
                    resId: ''
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('r_repair_pool', "maintenance_type", function (_data) {
                vc.component.finishRepairInfo.maintenanceTypes = _data;
            });
            //与字典表关联
            vc.getDict('resource_store', "goods_type", function (_data) {
                vc.component.finishRepairInfo.goodsTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('finishRepair', 'openFinishRepairModal', function (_repair) {
                $that.finishRepairInfo.repairType = _repair.repairType;
                $that.finishRepairInfo.repairId = _repair.repairId;
                $that.finishRepairInfo.repairObjType = _repair.repairObjType;
                $that.finishRepairInfo.publicArea = _repair.publicArea;
                $that.finishRepairInfo.repairChannel = _repair.repairChannel;
                $('#finishRepairModel').modal('show');
            });
        },
        methods: {
            finishRepairValidate() {
                return vc.validate.validate({
                    finishRepairInfo: vc.component.finishRepairInfo
                }, {
                    'finishRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'finishRepairInfo.maintenanceType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "维修类型不能为空"
                        }
                    ],
                    'finishRepairInfo.conditions.goodsType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品类型不能为空"
                        }
                    ],
                    'finishRepairInfo.conditions.resId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品不能为空"
                        }
                    ],
                    'finishRepairInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "商品价格格式错误"
                        },
                    ],
                    'finishRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "处理意见不能为空"
                        }
                    ]
                });
            },
            repairValidate() {
                return vc.validate.validate({
                    finishRepairInfo: vc.component.finishRepairInfo
                }, {
                    'finishRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修单不能为空"
                        }
                    ],
                    'finishRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "处理意见不能为空"
                        }
                    ]
                });
            },
            _finishRepairInfo: function () {
                if (!vc.component.finishRepairValidate() && vc.component.finishRepairInfo.maintenanceType != '1002' && vc.component.finishRepairInfo.publicArea == 'F') {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (!vc.component.repairValidate() && vc.component.finishRepairInfo.maintenanceType == '1002' && vc.component.finishRepairInfo.publicArea == 'T') {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.finishRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairFinish',
                    JSON.stringify(vc.component.finishRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#finishRepairModel').modal('hide');
                            vc.component.clearFinishRepairInfo();
                            vc.emit('repairDispatchManage', 'listOwnerRepair', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //选择商品
            _choseGoods: function () {
                vc.component.finishRepairInfo.conditions.resId = '';
                var select = document.getElementById("goods");
                vc.component.finishRepairInfo.conditions.goodsType = select.value;
                if (vc.component.finishRepairInfo.conditions.goodsType == null || vc.component.finishRepairInfo.conditions.goodsType == '') {
                    return;
                }
                var param = {
                    params: vc.component.finishRepairInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/resourceStore/queryResourceStoreResName',
                    param,
                    function (json, res) {
                        var _goods = JSON.parse(json);
                        console.log("123")
                        console.log(_goods)
                        vc.component.finishRepairInfo.resourceStores = _goods.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //选择价格
            _chosePrice: function () {
                var select = document.getElementById("goodsPrice");
                vc.component.finishRepairInfo.conditions.resId = select.value;
                if (vc.component.finishRepairInfo.conditions.resId == null || vc.component.finishRepairInfo.conditions.resId == '') {
                    return;
                }
                var param = {
                    params: vc.component.finishRepairInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/resourceStore/queryResourceStorePrice',
                    param,
                    function (json, res) {
                        var _prices = JSON.parse(json);
                        if (_prices.data[0].outLowPrice == _prices.data[0].outHighPrice) {
                            vc.component.finishRepairInfo.price = _prices.data[0].outLowPrice;
                        } else {
                            vc.component.finishRepairInfo.price = '';
                        }
                        vc.component.finishRepairInfo.outLowPrice = _prices.data[0].outLowPrice;
                        vc.component.finishRepairInfo.outHighPrice = _prices.data[0].outHighPrice;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearFinishRepairInfo: function () {
                vc.component.finishRepairInfo = {
                    repairId: '',
                    repairType: '',
                    context: '',
                    feeFlag: '200',
                    amount: 0.0,
                    repairObjType: '',
                    maintenanceTypes: [],
                    maintenanceType: '',
                    goodsTypes: [],
                    resourceStores: [],
                    price: '',
                    outLowPrice: '',
                    outHighPrice: '',
                    conditions: {
                        goodsType: '',
                        resId: ''
                    }
                };
            }
        }
    });
})(window.vc);
