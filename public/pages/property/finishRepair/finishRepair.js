(function (vc) {
    vc.extends({
        data: {
            finishRepairInfo: {
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
                beforeRepairPhotos: [],
                afterRepairPhotos: [],
            }
        },
        _initMethod: function () {
            $that.finishRepairInfo.repairType = vc.getParam('repairType');
            $that.finishRepairInfo.repairId = vc.getParam('repairId');
            $that.finishRepairInfo.repairObjType = vc.getParam('repairObjType');
            $that.finishRepairInfo.publicArea = vc.getParam('publicArea');
            $that.finishRepairInfo.repairChannel = vc.getParam('repairChannel');
            $that._loadMaintenanceType();
        },
        _initEvent: function () {
            vc.on("finishRepairInfo", "notifyUploadBeforeReapirImage", function (_param) {
                vc.component.finishRepairInfo.beforeRepairPhotos = [];
                _param.forEach((item) => {
                    vc.component.finishRepairInfo.beforeRepairPhotos.push({
                        'photo': item
                    })
                })
            });
            vc.on("finishRepairInfo", "notifyUploadAfterReapirImage", function (_param) {
                vc.component.finishRepairInfo.afterRepairPhotos = [];
                _param.forEach((item) => {
                    vc.component.finishRepairInfo.afterRepairPhotos.push({
                        'photo': item
                    })
                })
            });
            vc.on('finishRepairInfo', 'chooseSingleResource', function (_data) {
                console.log('here is data ', _data);
                $that.finishRepairInfo.choosedGoodsList.push(_data);
                // if ($that.finishRepairInfo.choosedGoodsList.length < 1) {
                //     $that.finishRepairInfo.choosedGoodsList.push(_data);
                // } else {
                //     $that.finishRepairInfo.choosedGoodsList.forEach((oldItem, index) => {
                //         if (_data.resId == oldItem.resId && _data.price == oldItem.price) {
                //             console.log('1111');
                //             console.log(_data.price,oldItem.price);
                //             console.log(parseInt(oldItem.useNumber) + parseInt(_data.useNumber));
                //             $that.finishRepairInfo.choosedGoodsList[index].useNumber = parseInt(oldItem.useNumber) + parseInt(_data.useNumber);
                //         } else {
                //             console.log('2222');
                //             $that.finishRepairInfo.choosedGoodsList.push(_data);
                //         }
                //     })
                // }
                $that._updateTotalPrice();
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
                if (!vc.component.finishRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.finishRepairInfo.maintenanceType == '1001' || vc.component.finishRepairInfo.maintenanceType == '1003') {
                    if (vc.component.finishRepairInfo.choosedGoodsList.length < 1) {
                        vc.toast('请选择商品');
                        return;
                    }
                }
                vc.component.finishRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                console.log('post data : ', vc.component.finishRepairInfo);
                vc.http.apiPost(
                    'ownerRepair.repairFinish',
                    JSON.stringify(vc.component.finishRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.component.clearFinishRepairInfo();
                            $that._back();
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
            // 选择商品
            _openChooseSingleResourceModel: function () {
                vc.emit('chooseSingleResource', 'openChooseSingleResourceModel', {maintenanceType: vc.component.finishRepairInfo.maintenanceType});
            },
            // 移除商品
            _removeChoosedGoodsItem: function (index) {
                vc.component.finishRepairInfo.choosedGoodsList.splice(index, 1);
                $that._updateTotalPrice();
            },
            // 商品数量减少
            _useNumberDec: function (index) {
                if (vc.component.finishRepairInfo.choosedGoodsList[index].useNumber <= 1) {
                    vc.toast("不能再减少了");
                    return;
                }
                vc.component.finishRepairInfo.choosedGoodsList[index].useNumber -= 1;
                this.$forceUpdate();
                $that._updateTotalPrice();
            },
            // 商品数量增加
            _useNumberInc: function (index) {
                vc.component.finishRepairInfo.choosedGoodsList[index].useNumber += 1;
                this.$forceUpdate();
                $that._updateTotalPrice();
            },
            // 更新总金额
            _updateTotalPrice: function () {
                let totalPrice = 0;
                vc.component.finishRepairInfo.choosedGoodsList.forEach((item) => {
                    totalPrice += item.price * item.useNumber;
                });
                vc.component.finishRepairInfo.totalPrice = totalPrice.toFixed(2);
            },
            // 返回
            _back: function () {
                vc.jumpToPage('/admin.html#/pages/property/repairDispatchManage');
            },
            clearFinishRepairInfo: function () {
                vc.component.finishRepairInfo = {
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
                    choosedGoodsList: []
                };
            }
        }
    });
})(window.vc);
