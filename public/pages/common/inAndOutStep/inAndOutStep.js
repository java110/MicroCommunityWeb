/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            inAndOutStepInfo: {
                $step: {},
                index: 0,
                infos: [],
                purchaseApply: {
                    resourceStores: [],
                    description: '',
                    endUserName: '',
                    endUserTel: '',
                    file: '',
                    resOrderType: '10000',
                    receiverUserId: '',
                    receiverUserName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._initStep();
        },
        _initEvent: function() {
            vc.on("inAndOutStep", "notify", function(chooseInAndOutType) {
                vc.component.inAndOutStepInfo.purchaseApply.resOrderType = chooseInAndOutType.resOrderType;
                vc.component.inAndOutStepInfo.infos[0] = chooseInAndOutType.resOrderType;
                // 为选择商品组件 设置orderType 10000采购20000出库
                vc.emit("chooseResourceStore3", "setResourcesOut", vc.component.inAndOutStepInfo.purchaseApply.resOrderType);
                vc.emit("viewResourceStoreInfo3", "setResourcesOut", vc.component.inAndOutStepInfo.purchaseApply.resOrderType);
                vc.emit("addPurchaseApplyViewInfo2", "setResourcesOut", vc.component.inAndOutStepInfo.purchaseApply.resOrderType);
            });
            vc.on("inAndOutStep", "notify2", function(viewResourceStoreInfo3) {
                vc.component.inAndOutStepInfo.purchaseApply.resourceStores = viewResourceStoreInfo3.resourceStores;
                vc.component.inAndOutStepInfo.infos[1] = viewResourceStoreInfo3.resourceStores;
            });
            vc.on("inAndOutStep", "notify3", function(info) {
                vc.component.inAndOutStepInfo.infos[2] = info;
                if (info) {
                    vc.component.inAndOutStepInfo.purchaseApply.description = info.description;
                    vc.component.inAndOutStepInfo.purchaseApply.endUserName = info.endUserName;
                    vc.component.inAndOutStepInfo.purchaseApply.endUserTel = info.endUserTel;
                    vc.component.inAndOutStepInfo.purchaseApply.receiverUserId = info.staffId;
                    vc.component.inAndOutStepInfo.purchaseApply.receiverUserName = info.staffName;
                }
            });
        },
        methods: {
            _initStep: function() {
                vc.component.inAndOutStepInfo.$step = $("#step");
                vc.component.inAndOutStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择类型", "选择物品", "申请信息"]
                });
                vc.component.inAndOutStepInfo.index = vc.component.inAndOutStepInfo.$step.getIndex();
            },
            _prevStep: function() {
                vc.component.inAndOutStepInfo.$step.prevStep();
                vc.component.inAndOutStepInfo.index = vc.component.inAndOutStepInfo.$step.getIndex();
                vc.emit('chooseInAndOutType', 'onIndex', vc.component.inAndOutStepInfo.index);
                vc.emit('viewResourceStoreInfo3', 'onIndex', vc.component.inAndOutStepInfo.index);
            },
            _nextStep: function() {
                vc.emit('chooseInAndOutType', 'getSelectOrderType', null);
                vc.emit('viewResourceStoreInfo3', 'getSelectResourceStores', null);
                let _resourceStores = vc.component.inAndOutStepInfo.purchaseApply.resourceStores;
                // 第一步到第二步时，清空第二步的数据
                if (vc.component.inAndOutStepInfo.index == 0) {
                    vc.emit('viewResourceStoreInfo3', 'clearSelectResourceStores', null);
                }
                if (vc.component.inAndOutStepInfo.index > 0 && _resourceStores.length <= 0) {
                    vc.toast("请选择物品");
                    return;
                }
                var _currentData = vc.component.inAndOutStepInfo.infos[vc.component.inAndOutStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                if (vc.component.inAndOutStepInfo.index > 0) {
                    for (var i = 0; i < _resourceStores.length; i++) {
                        if (!_resourceStores[i].hasOwnProperty("purchaseQuantity") || parseInt(_resourceStores[i].purchaseQuantity) <= 0) {
                            vc.toast("请填写数量");
                            return;
                        }
                        _resourceStores[i].purchaseQuantity = parseInt(_resourceStores[i].purchaseQuantity);
                        if (vc.component.inAndOutStepInfo.purchaseApply.resOrderType == "20000") {
                            if (_resourceStores[i].purchaseQuantity > parseInt(_resourceStores[i].stock)) {
                                vc.toast(_resourceStores[i].resName + ",库存不足");
                                return;
                            }
                        }
                        if (vc.component.inAndOutStepInfo.purchaseApply.resOrderType == "10000") {
                            if (!_resourceStores[i].hasOwnProperty("price") || parseFloat(_resourceStores[i].price) <= 0) {
                                vc.toast("请填写物品采购价格");
                                return;
                            }
                        }
                        _resourceStores[i].price = parseFloat(_resourceStores[i].price);
                    }
                }
                vc.component.inAndOutStepInfo.$step.nextStep();
                vc.component.inAndOutStepInfo.index = vc.component.inAndOutStepInfo.$step.getIndex();
                vc.emit('viewResourceStoreInfo3', 'onIndex', vc.component.inAndOutStepInfo.index);
                vc.emit('addPurchaseApplyViewInfo2', 'onIndex', vc.component.inAndOutStepInfo.index);
            },
            _finishStep: function() {
                // vc.emit('addPurchaseApplyViewInfo2', 'setPurchaseApplyInfo', null);
                var _currentData = vc.component.inAndOutStepInfo.infos[vc.component.inAndOutStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                var postUrl = vc.component.inAndOutStepInfo.purchaseApply.resOrderType == 10000 ? '/purchase/purchaseStorage' : '/collection/goodsDelivery';
                vc.http.apiPost(
                    postUrl,
                    JSON.stringify(vc.component.inAndOutStepInfo.purchaseApply), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.jumpToPage("/#/pages/common/resourceStoreManage");
                            // if (vc.component.inAndOutStepInfo.purchaseApply.resOrderType == "10000") {
                            //     vc.jumpToPage("/#/pages/common/purchaseApplyManage");
                            // } else {
                            //     vc.jumpToPage("/#/pages/common/itemOutManage");
                            // }
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