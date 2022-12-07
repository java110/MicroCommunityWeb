/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            addPurchaseApplyStepInfo: {
                $step: {},
                index: 0,
                infos: [],
                purchaseApply: {
                    resourceStores: [],
                    description: '',
                    endUserName: '',
                    endUserTel: '',
                    file: '',
                    resOrderType: '',
                    staffId: '',
                    staffName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._initStep();
            //10000 采购 20000出库
            vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType = vc.getParam('resOrderType');
            vc.emit("viewResourceStoreInfo4", "setResourcesOut", vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType);
            vc.emit("chooseResourceStore4", "setResourcesOut", vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType);
        },
        _initEvent: function() {
            vc.on("addPurchaseApplyStep", "notify", function(viewResourceStoreInfo4) {
                vc.component.addPurchaseApplyStepInfo.purchaseApply.resourceStores = viewResourceStoreInfo4.resourceStores;
                vc.component.addPurchaseApplyStepInfo.infos[0] = viewResourceStoreInfo4.resourceStores;
            });
            vc.on("addPurchaseApplyStep", "notify2", function(info) {
                if (info) {
                    vc.component.addPurchaseApplyStepInfo.purchaseApply.description = info.description;
                    vc.component.addPurchaseApplyStepInfo.purchaseApply.endUserName = info.endUserName;
                    vc.component.addPurchaseApplyStepInfo.purchaseApply.endUserTel = info.endUserTel;
                }
                vc.component.addPurchaseApplyStepInfo.infos[1] = info;
            });
        },
        methods: {
            _initStep: function() {
                vc.component.addPurchaseApplyStepInfo.$step = $("#step");
                vc.component.addPurchaseApplyStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择物品", "申请信息"]
                });
                vc.component.addPurchaseApplyStepInfo.index = vc.component.addPurchaseApplyStepInfo.$step.getIndex();
            },
            _prevStep: function() {
                vc.component.addPurchaseApplyStepInfo.$step.prevStep();
                vc.component.addPurchaseApplyStepInfo.index = vc.component.addPurchaseApplyStepInfo.$step.getIndex();
                vc.emit('viewResourceStoreInfo4', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);
                vc.emit('addPurchaseApplyView', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);
            },
            _nextStep: function() {
                vc.emit('viewResourceStoreInfo4', 'getSelectResourceStores', null);
                let _resourceStores = vc.component.addPurchaseApplyStepInfo.purchaseApply.resourceStores;
                if (_resourceStores.length <= 0) {
                    vc.toast("请选择物品");
                    return;
                }
                var _currentData = vc.component.addPurchaseApplyStepInfo.infos[vc.component.addPurchaseApplyStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                for (var i = 0; i < _resourceStores.length; i++) {
                    if (!_resourceStores[i].hasOwnProperty("quantity") || parseInt(_resourceStores[i].quantity) <= 0) {
                        vc.toast("请填写采购数量");
                        return;
                    }
                    _resourceStores[i].quantity = parseInt(_resourceStores[i].quantity);
                    if (!_resourceStores[i].hasOwnProperty("urgentPrice") || parseFloat(_resourceStores[i].urgentPrice) <= 0) {
                        vc.toast("请填写物品采购价格");
                        return;
                    }
                    _resourceStores[i].urgentPrice = parseFloat(_resourceStores[i].urgentPrice);
                    if (vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType == "20000") {
                        if (_resourceStores[i].quantity > _resourceStores[i].stock) {
                            vc.toast(_resourceStores[i].resName + ",库存不足");
                            return;
                        }
                    }
                }
                vc.component.addPurchaseApplyStepInfo.$step.nextStep();
                vc.component.addPurchaseApplyStepInfo.index = vc.component.addPurchaseApplyStepInfo.$step.getIndex();
                vc.emit('viewResourceStoreInfo4', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);
                vc.emit('addPurchaseApplyView', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);
            },
            _finishStep: function() {
                vc.emit('addPurchaseApplyViewInfo', 'setPurchaseApplyInfo', null);
                var _currentData = vc.component.addPurchaseApplyStepInfo.infos[vc.component.addPurchaseApplyStepInfo.index];
                if (vc.component.addPurchaseApplyStepInfo.index != 2) {
                    if (_currentData == null || _currentData == undefined) {
                        vc.toast("请选择或填写必选信息");
                        return;
                    }
                }
                vc.http.apiPost(
                    '/purchase/urgentPurchaseApply',
                    JSON.stringify(vc.component.addPurchaseApplyStepInfo.purchaseApply), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            // if (vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType == "10000") {
                            //     vc.jumpToPage("/#/pages/common/purchaseApplyManage");
                            // } else {
                            //     vc.jumpToPage("/#/pages/common/itemOutManage");
                            // }
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);