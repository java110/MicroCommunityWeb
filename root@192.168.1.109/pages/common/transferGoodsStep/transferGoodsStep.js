/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            transferGoodsStepInfo: {
                $step: {},
                index: 0,
                infos: [],
                purchaseApply: {
                    resourceStores: [],
                    description: '',
                    file: '',
                    acceptUserId: '',
                    acceptUserName: ''
                }
            }
        },
        _initMethod: function() {
            vc.component._initStep();
        },
        _initEvent: function() {
            vc.on("transferGoodsStep", "notify", function(goodsInfo) {
                vc.component.transferGoodsStepInfo.purchaseApply.resourceStores = goodsInfo.resourceStores;
                vc.component.transferGoodsStepInfo.infos[0] = goodsInfo.resourceStores;
            });
            vc.on("transferGoodsStep", "notify2", function(info) {
                console.log('noti2', info);
                if (info.hasOwnProperty("staffId") && info.staffId != '-1') {
                    vc.component.transferGoodsStepInfo.purchaseApply.description = info.description;
                    vc.component.transferGoodsStepInfo.purchaseApply.acceptUserId = info.staffId;
                    vc.component.transferGoodsStepInfo.purchaseApply.acceptUserName = info.staffName;
                    vc.component.transferGoodsStepInfo.infos[1] = info;
                } else {
                    delete vc.component.transferGoodsStepInfo.infos[1];
                }
            });
        },
        methods: {
            _initStep: function() {
                vc.component.transferGoodsStepInfo.$step = $("#step");
                vc.component.transferGoodsStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择物品", "选择员工"]
                });
                vc.component.transferGoodsStepInfo.index = vc.component.transferGoodsStepInfo.$step.getIndex();
            },
            _prevStep: function() {
                vc.component.transferGoodsStepInfo.$step.prevStep();
                vc.component.transferGoodsStepInfo.index = vc.component.transferGoodsStepInfo.$step.getIndex();
                vc.emit('viewResourceStaffInfo', 'onIndex', vc.component.transferGoodsStepInfo.index);
            },
            _nextStep: function() {
                vc.emit('viewResourceStaffInfo', 'getSelectResourceStores', null);
                let _resourceStores = vc.component.transferGoodsStepInfo.purchaseApply.resourceStores;
                if (_resourceStores.length <= 0) {
                    vc.toast("请选择物品");
                    return;
                }
                var _currentData = vc.component.transferGoodsStepInfo.infos[vc.component.transferGoodsStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                // 校验商品信息
                for (var i = 0; i < _resourceStores.length; i++) {
                    if (!_resourceStores[i].hasOwnProperty("giveQuantity") || parseInt(_resourceStores[i].giveQuantity) <= 0) {
                        vc.toast("请填写数量");
                        return;
                    }
                    _resourceStores[i].giveQuantity = parseInt(_resourceStores[i].giveQuantity);
                    if (_resourceStores[i].giveQuantity > parseInt(_resourceStores[i].miniStock)) {
                        vc.toast(_resourceStores[i].resName + ",库存不足");
                        return;
                    }
                }
                vc.component.transferGoodsStepInfo.$step.nextStep();
                vc.component.transferGoodsStepInfo.index = vc.component.transferGoodsStepInfo.$step.getIndex();
                vc.emit('addTransferStoreInfo', 'onIndex', vc.component.transferGoodsStepInfo.index);
            },
            _finishStep: function() {
                let currentUserId = vc.getData("/nav/getUserInfo").userId;
                if (currentUserId == vc.component.transferGoodsStepInfo.purchaseApply.acceptUserId) {
                    vc.toast("不能转赠给自己");
                    return;
                }

                var _currentData = vc.component.transferGoodsStepInfo.infos[vc.component.transferGoodsStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                vc.http.post('addAllocationUserStorehouse',
                    'save',
                    JSON.stringify(vc.component.transferGoodsStepInfo.purchaseApply), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.jumpToPage("/#/pages/common/myResourceStoreManage");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);