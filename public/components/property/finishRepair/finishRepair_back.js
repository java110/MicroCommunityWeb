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
                resourceStoreTypes: [],
                price: '',
                outLowPrice: '',
                outHighPrice: '',
                publicArea: '',
                repairChannel: '',
                conditions: {
                    goodsType: '',
                    resId: ''
                },
                selectedGoodsInfo: {},
                useNumber: 1,
                totalPrice: 0,
                resId: '',
                isCustom: false,
                customGoodsName: '',
                choosedGoodsList: []
            }
        },
        _initMethod: function () {
            vc.component.clearFinishRepairInfo();
        },
        _initEvent: function () {
            vc.on('finishRepair', 'openFinishRepairModal', function (_repair) {
                vc.component.clearFinishRepairInfo();
                $that._loadMaintenanceType();
                $that._listResourceStoreType();
                $that.finishRepairInfo.repairType = _repair.repairType;
                $that.finishRepairInfo.repairId = _repair.repairId;
                $that.finishRepairInfo.repairObjType = _repair.repairObjType;
                $that.finishRepairInfo.publicArea = _repair.publicArea;
                $that.finishRepairInfo.repairChannel = _repair.repairChannel;
                $('#finishRepairModel').modal('show');
            });
        },
        methods: {
            _loadMaintenanceType() {
                vc.getDict('r_repair_pool', "maintenance_type", function (_data) {
                    vc.component.finishRepairInfo.maintenanceTypes = _data;
                });
            },
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
                    'finishRepairInfo.useNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品数量不能为零"
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
            yongLiaoValidate() {
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
                    'finishRepairInfo.useNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品数量不能为零"
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
                // 有偿
                if (vc.component.finishRepairInfo.maintenanceType == '1001' && !vc.component.finishRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 用料
                if (vc.component.finishRepairInfo.maintenanceType == '1003' && !vc.component.yongLiaoValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 无偿 或 不用料
                if (vc.component.finishRepairInfo.maintenanceType != '1001' && vc.component.finishRepairInfo.maintenanceType != '1003' && !vc.component.repairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 自定义商品验证
                if (vc.component.finishRepairInfo.isCustom && vc.component.finishRepairInfo.customGoodsName == ''){
                    vc.toast('商品名不能为空');
                }
                if (vc.component.finishRepairInfo.maintenanceType == '1002' || vc.component.finishRepairInfo.maintenanceType == '1004') {
                    // 无偿服务 修改商品数量为零
                    vc.component.finishRepairInfo.useNumber = 0;
                }
                vc.component.finishRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairFinish',
                    JSON.stringify(vc.component.finishRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
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
                    }
                );
            },
            //选择商品类型
            _choseGoods: function () {
                vc.component.finishRepairInfo.conditions.resId = '';
                vc.component.finishRepairInfo.resId = '';
                var select = document.getElementById("goods");
                vc.component.finishRepairInfo.conditions.goodsType = select.value;
                if (vc.component.finishRepairInfo.conditions.goodsType == null || vc.component.finishRepairInfo.conditions.goodsType == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        goodsType: vc.component.finishRepairInfo.conditions.goodsType,
                        resId: vc.component.finishRepairInfo.conditions.resId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listUserStorehouses',
                    param,
                    function (json, res) {
                        var _goods = JSON.parse(json);
                        if (vc.component.finishRepairInfo.conditions.goodsType == '1003') {
                            _goods.data.push({'resName': '自定义', 'resId': 'custom'});
                        }
                        vc.component.finishRepairInfo.resourceStores = _goods.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //选择商品
            _chosePrice: function () {
                var _that = this;
                var select = document.getElementById("goodsPrice");
                // 如果选择自定义商品
                if (select.value == 'custom') {
                    vc.component.finishRepairInfo.isCustom = true;
                    return;
                } else {
                    vc.component.finishRepairInfo.isCustom = false;
                }
                vc.component.finishRepairInfo.conditions.resId = select.value;
                vc.component.finishRepairInfo.resId = select.value;
                // 保存选中的商品信息
                vc.component.finishRepairInfo.resourceStores.forEach((item) => {
                    if (item.resId == select.value) {
                        vc.component.finishRepairInfo.selectedGoodsInfo = item;
                    }
                })

                if (vc.component.finishRepairInfo.selectedGoodsInfo.outLowPrice == vc.component.finishRepairInfo.selectedGoodsInfo.outHighPrice) {
                    vc.component.finishRepairInfo.price = vc.component.finishRepairInfo.selectedGoodsInfo.outLowPrice;
                } else {
                    vc.component.finishRepairInfo.price = '';
                }
                _that._updateTotalPrice();
                vc.component.finishRepairInfo.outLowPrice = vc.component.finishRepairInfo.selectedGoodsInfo.outLowPrice;
                vc.component.finishRepairInfo.outHighPrice = vc.component.finishRepairInfo.selectedGoodsInfo.outHighPrice;
            },
            // 监听价格变化 更新总金额
            singlePriceChanged: function () {
                this._updateTotalPrice();
            },
            // 商品数量减少
            _useNumDec: function () {
                if (vc.component.finishRepairInfo.useNumber <= 1) {
                    vc.toast("不能再减少了");
                    return;
                }
                vc.component.finishRepairInfo.useNumber -= 1;
                this._updateTotalPrice();
            },
            // 商品数量增加
            _useNumInc: function () {
                var goodsInfo = vc.component.finishRepairInfo.selectedGoodsInfo;
                // if (vc.component.finishRepairInfo.useNumber >= goodsInfo.stock) {
                //     vc.toast("库存不足");
                //     return;
                // }
                vc.component.finishRepairInfo.useNumber += 1;
                this._updateTotalPrice();
            },
            // 更新总金额
            _updateTotalPrice: function () {
                let totalPrice = vc.component.finishRepairInfo.useNumber * vc.component.finishRepairInfo.price
                vc.component.finishRepairInfo.totalPrice = totalPrice.toFixed(2);
            },
            //查询物品类型
            _listResourceStoreType: function () {
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
                        vc.component.finishRepairInfo.resourceStoreTypes = _resourceStoreType.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 选择商品
            _openChooseSingleResourceModel: function () {
                vc.emit('chooseSingleResource', 'openChooseSingleResourceModel', {});
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
                    },
                    selectedGoodsInfo: {},
                    useNumber: 1,
                    totalPrice: 0,
                    resId: '',
                    isCustom: false,
                    customGoodsName: '',
                    choosedGoodsList: []
                };
            }
        }
    });
})(window.vc);
