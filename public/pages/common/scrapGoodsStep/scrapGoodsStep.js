/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            scrapGoodsStepInfo: {
                $step: {},
                index: 0,
                infos: [],
                conditions: {
                    resourceStores: [],
                    description: '',
                    file: '',
                    acceptUserId: '',
                    acceptUserName: '',
                    flag: '1',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._initStep();
        },
        _initEvent: function () {
            vc.on("scrapGoodsStep", "notify", function (goodsInfo) {
                vc.component.scrapGoodsStepInfo.conditions.resourceStores = goodsInfo;
                vc.component.scrapGoodsStepInfo.infos[0] = goodsInfo;
            });
        },
        methods: {
            _initStep: function () {
                vc.component.scrapGoodsStepInfo.$step = $("#step");
                vc.component.scrapGoodsStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择物品"]
                });
                vc.component.scrapGoodsStepInfo.index = vc.component.scrapGoodsStepInfo.$step.getIndex();
            },
            _prevStep: function () {
                vc.component.scrapGoodsStepInfo.$step.prevStep();
                vc.component.scrapGoodsStepInfo.index = vc.component.scrapGoodsStepInfo.$step.getIndex();
                vc.emit('viewResourceMyGoodsInfo', 'onIndex', vc.component.scrapGoodsStepInfo.index);
            },
            _finishStep: function () {
                vc.emit('viewResourceMyGoodsInfo', 'getResourceStore', null);
                let _resourceStores = vc.component.scrapGoodsStepInfo.conditions.resourceStores;
                if (_resourceStores.length <= 0) {
                    vc.toast("请选择物品");
                    return;
                }
                var _currentData = vc.component.scrapGoodsStepInfo.infos[vc.component.scrapGoodsStepInfo.index];
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
                    if (_resourceStores[i].state == '' || _resourceStores[i].state == null || _resourceStores[i].state == 'undefined') {
                        vc.toast("请选择物品使用类型");
                        return;
                    }
                    if (_resourceStores[i].purchaseRemark == '' || _resourceStores[i].purchaseRemark == null || _resourceStores[i].purchaseRemark == 'undefined') {
                        vc.toast("请填写备注");
                        return;
                    }
                }
                var _currentData = vc.component.scrapGoodsStepInfo.infos[vc.component.scrapGoodsStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                vc.http.post('addAllocationUserStorehouse',
                    'save',
                    JSON.stringify(vc.component.scrapGoodsStepInfo.conditions),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.jumpToPage("/admin.html#/pages/common/myResourceStoreManage");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);
