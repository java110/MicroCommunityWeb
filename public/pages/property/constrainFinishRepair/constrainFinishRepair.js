(function (vc) {
    vc.extends({
        data: {
            constrainFinishRepairInfo: {
                repairId: '',
                repairType: '',
                context: '',
                feeFlag: '200',
                repairObjType: '',
                publicArea: '',
                repairChannel: '',
                maintenanceTypes: [],
                maintenanceType: '',
                totalPrice: 0,
                choosedGoodsList: [],
                payTypes: [],
                mark: 1,
                sign: 1,
                payType: ''
            }
        },
        _initMethod: function () {
            //与字典表支付方式关联
            vc.getDict('r_repair_pool', "pay_type", function (_data) {
                vc.component.constrainFinishRepairInfo.payTypes = _data;
            });
            $that.constrainFinishRepairInfo.repairType = vc.getParam('repairType');
            $that.constrainFinishRepairInfo.repairId = vc.getParam('repairId');
            $that.constrainFinishRepairInfo.repairObjType = vc.getParam('repairObjType');
            $that.constrainFinishRepairInfo.publicArea = vc.getParam('publicArea');
            $that.constrainFinishRepairInfo.repairChannel = vc.getParam('repairChannel');
            $that._loadMaintenanceType();
        },
        _initEvent: function () {
            vc.on('constrainFinishRepairInfo', 'chooseSingleResource', function (_data) {
                $that.constrainFinishRepairInfo.choosedGoodsList.push(_data);
                $that._updateTotalPrice();
            });
        },
        methods: {
            _loadMaintenanceType() {
                vc.getDict('r_repair_pool', "maintenance_type", function (_data) {
                    vc.component.constrainFinishRepairInfo.maintenanceTypes = _data;
                });
            },
            finishRepairValidate() {
                return vc.validate.validate({
                    constrainFinishRepairInfo: vc.component.constrainFinishRepairInfo
                }, {
                    'constrainFinishRepairInfo.repairId': [{
                        limit: "required",
                        param: "",
                        errInfo: "报修单不能为空"
                    }],
                    'constrainFinishRepairInfo.maintenanceType': [{
                        limit: "required",
                        param: "",
                        errInfo: "维修类型不能为空"
                    }],
                    'constrainFinishRepairInfo.context': [{
                        limit: "required",
                        param: "",
                        errInfo: "处理意见不能为空"
                    }]
                });
            },
            _constrainFinishRepairInfo: function () {
                if (!vc.component.finishRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.constrainFinishRepairInfo.maintenanceType == '1001' || vc.component.constrainFinishRepairInfo.maintenanceType == '1003') {
                    if (vc.component.constrainFinishRepairInfo.choosedGoodsList.length < 1) {
                        vc.toast('请选择商品');
                        return;
                    }
                }
                if (vc.component.constrainFinishRepairInfo.maintenanceType == '1001' && vc.component.constrainFinishRepairInfo.payType == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                vc.component.constrainFinishRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerRepair.repairForceFinish',
                    JSON.stringify(vc.component.constrainFinishRepairInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.component.clearConstrainFinishRepairInfo();
                            $that._back();
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            // 选择商品
            _openChooseSingleResourceModel: function () {
                vc.emit('chooseSingleResource', 'openChooseSingleResourceModel', {
                    maintenanceType: vc.component.constrainFinishRepairInfo.maintenanceType,
                    repairId: vc.component.constrainFinishRepairInfo.repairId,
                    sign: 1
                });
            },
            // 移除商品
            _removeChoosedGoodsItem: function (index) {
                vc.component.constrainFinishRepairInfo.choosedGoodsList.splice(index, 1);
                $that._updateTotalPrice();
            },
            // 商品数量减少
            _useNumberDec: function (index) {
                if (vc.component.constrainFinishRepairInfo.choosedGoodsList[index].useNumber <= 1) {
                    vc.toast("不能再减少了");
                    return;
                }
                vc.component.constrainFinishRepairInfo.choosedGoodsList[index].useNumber -= 1;
                this.$forceUpdate();
                $that._updateTotalPrice();
            },
            // 商品数量增加
            _useNumberInc: function (index) {
                vc.component.constrainFinishRepairInfo.choosedGoodsList[index].useNumber += 1;
                this.$forceUpdate();
                $that._updateTotalPrice();
            },
            // 更新总金额
            _updateTotalPrice: function () {
                let totalPrice = 0;
                vc.component.constrainFinishRepairInfo.choosedGoodsList.forEach((item) => {
                    totalPrice += item.price * item.useNumber;
                });
                vc.component.constrainFinishRepairInfo.totalPrice = totalPrice.toFixed(2);
            },
            // 返回
            _back: function () {
                vc.jumpToPage('/#/pages/property/repairForceFinishManage');
            },
            clearConstrainFinishRepairInfo: function () {
                vc.component.constrainFinishRepairInfo = {
                    repairId: '',
                    repairType: '',
                    context: '',
                    feeFlag: '200',
                    repairObjType: '',
                    publicArea: '',
                    repairChannel: '',
                    maintenanceTypes: [],
                    maintenanceType: '',
                    totalPrice: 0,
                    mark: 1,
                    sign: 1,
                    choosedGoodsList: []
                };
            }
        }
    });
})(window.vc);