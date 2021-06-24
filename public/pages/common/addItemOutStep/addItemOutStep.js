/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addItemOutStepInfo: {
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
        _initMethod: function () {
            vc.component._initStep();
            //10000 采购 20000出库
            vc.component.addItemOutStepInfo.purchaseApply.resOrderType = vc.getParam('resOrderType');
            vc.emit("viewResourceStoreInfo2", "setResourcesOut", vc.component.addItemOutStepInfo.purchaseApply.resOrderType);
            vc.emit("chooseResourceStore2", "setResourcesOut", vc.component.addItemOutStepInfo.purchaseApply.resOrderType);
        },
        _initEvent: function () {
            vc.on("addItemOutStep", "notify", function (viewResourceStoreInfo2) {
                vc.component.addItemOutStepInfo.purchaseApply.resourceStores = viewResourceStoreInfo2.resourceStores;
                vc.component.addItemOutStepInfo.infos[0] = viewResourceStoreInfo2.resourceStores;
            });

            vc.on("addItemOutStep", "notify2", function (info) {
                vc.component.addItemOutStepInfo.infos[1] = info;
                if (info) {
                    vc.component.addItemOutStepInfo.purchaseApply.description = info.description;
                    vc.component.addItemOutStepInfo.purchaseApply.endUserName = info.endUserName;
                    vc.component.addItemOutStepInfo.purchaseApply.endUserTel = info.endUserTel;
                }
            });
            vc.on("addItemOutStep", "notify3", function (info) {
                vc.component.addItemOutStepInfo.purchaseApply.staffId = info.staffId;
                vc.component.addItemOutStepInfo.purchaseApply.staffName = info.staffName;
                vc.component.addItemOutStepInfo.infos[2] = info;
            });

        },
        methods: {
            _initStep: function () {
                vc.component.addItemOutStepInfo.$step = $("#step");
                vc.component.addItemOutStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择物品", "申请信息", "审批人"]
                });
                vc.component.addItemOutStepInfo.index = vc.component.addItemOutStepInfo.$step.getIndex();
            },
            _prevStep: function () {
                vc.component.addItemOutStepInfo.$step.prevStep();
                vc.component.addItemOutStepInfo.index = vc.component.addItemOutStepInfo.$step.getIndex();

                vc.emit('viewResourceStoreInfo2', 'onIndex', vc.component.addItemOutStepInfo.index);
                vc.emit('addItemOutView', 'onIndex', vc.component.addItemOutStepInfo.index);

            },
            _nextStep: function () {
                vc.emit('viewResourceStoreInfo2', 'getSelectResourceStores', null);
                let _resourceStores = vc.component.addItemOutStepInfo.purchaseApply.resourceStores;
                if (_resourceStores.length <= 0) {
                    vc.toast("请选择物品");
                    return;
                }
                var _currentData = vc.component.addItemOutStepInfo.infos[vc.component.addItemOutStepInfo.index];
                console.log('here is cur ', _currentData);
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                for (var i = 0; i < _resourceStores.length; i++) {
                    if (!_resourceStores[i].hasOwnProperty("quantity") || _resourceStores[i].quantity <= 0) {
                        vc.toast("请完善物品信息");
                        return;
                    }
                    if (parseInt(_resourceStores[i].quantity) > parseInt(_resourceStores[i].stock)) {
                        vc.toast(_resourceStores[i].resName + ",库存不足");
                        return;
                    }
                }
                vc.component.addItemOutStepInfo.$step.nextStep();
                vc.component.addItemOutStepInfo.index = vc.component.addItemOutStepInfo.$step.getIndex();

                vc.emit('viewResourceStoreInfo2', 'onIndex', vc.component.addItemOutStepInfo.index);
                vc.emit('addItemOutView', 'onIndex', vc.component.addItemOutStepInfo.index);

            },
            _finishStep: function () {
                vc.emit('addItemOutViewInfo', 'setItemOutInfo', null);
                var _currentData = vc.component.addItemOutStepInfo.infos[vc.component.addItemOutStepInfo.index];
                if (vc.component.addItemOutStepInfo.index != 2) {
                    if (_currentData == null || _currentData == undefined) {
                        vc.toast("请选择或填写必选信息");
                        return;
                    }
                }
                vc.http.apiPost(
                    '/collection/goodsCollection',
                    JSON.stringify(vc.component.addItemOutStepInfo.purchaseApply),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            if (vc.component.addItemOutStepInfo.purchaseApply.resOrderType == "10000") {
                                vc.jumpToPage("/admin.html#/pages/common/purchaseApplyManage");
                            } else {
                                vc.jumpToPage("/admin.html#/pages/common/itemOutManage");
                            }
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);
