/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addPurchaseApplyStepInfo: {
                $step: {},
                index: 0,
                infos: [],
                purchaseApply:{
                    resourceStores:[],
                    description:'',
                    file:'',
                    resOrderType:''
                }
            }
        },
        _initMethod: function () {
            vc.component._initStep();
            //10000 采购 20000出库
            vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType = vc.getParam('resOrderType');
            vc.emit("chooseResourceStore2", "setResourcesOut", vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType);
        },
        _initEvent: function () {
            vc.on("addPurchaseApplyStep", "notify", function (viewResourceStoreInfo2) {
                vc.component.addPurchaseApplyStepInfo.purchaseApply.resourceStores = viewResourceStoreInfo2.resourceStores;
            });

            vc.on("addPurchaseApplyStep", "notify2", function (info) {
                vc.component.addPurchaseApplyStepInfo.purchaseApply.description = info.description;
            });

        },
        methods: {
            _initStep: function () {
                vc.component.addPurchaseApplyStepInfo.$step = $("#step");
                vc.component.addPurchaseApplyStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择物品", "申请说明"]
                });
                vc.component.addPurchaseApplyStepInfo.index = vc.component.addPurchaseApplyStepInfo.$step.getIndex();
            },
            _prevStep: function () {
                vc.component.addPurchaseApplyStepInfo.$step.prevStep();
                vc.component.addPurchaseApplyStepInfo.index = vc.component.addPurchaseApplyStepInfo.$step.getIndex();

                vc.emit('viewResourceStoreInfo2', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);
                vc.emit('addPurchaseApplyView', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);

            },
            _nextStep: function () {
                vc.emit('viewResourceStoreInfo2', 'getSelectResourceStores', null);
                var _resourceStores = vc.component.addPurchaseApplyStepInfo.purchaseApply.resourceStores;
                if (_resourceStores.length == 0) {
                    vc.toast("请完善需要采购的物品信息");
                    return;
                }
               for( var i = 0; i < _resourceStores.length; i++){
                   if(_resourceStores[i].quantity <= 0){
                       vc.toast("请完善需要采购的物品信息");
                        return;
                   }
                   if(vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType == "20000"){
                       if(_resourceStores[i].quantity > _resourceStores[i].stock){
                           vc.toast(_resourceStores[i].resName+",库存不足");
                           return;
                       }
                   }

               }
                vc.component.addPurchaseApplyStepInfo.$step.nextStep();
                vc.component.addPurchaseApplyStepInfo.index = vc.component.addPurchaseApplyStepInfo.$step.getIndex();

                vc.emit('viewResourceStoreInfo2', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);
                vc.emit('addPurchaseApplyView', 'onIndex', vc.component.addPurchaseApplyStepInfo.index);

            },
            _finishStep: function () {
                vc.emit('addPurchaseApplyViewInfo', 'setPurchaseApplyInfo', null);
                var _description = vc.component.addPurchaseApplyStepInfo.purchaseApply.description;
                if (_description == null || _description == '') {
                    vc.toast("请填写申请说明");
                    return;
                }
                vc.http.post(
                    'addPurchaseApply',
                    'save',
                    JSON.stringify(vc.component.addPurchaseApplyStepInfo.purchaseApply),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {

                            //关闭model
                            if(vc.component.addPurchaseApplyStepInfo.purchaseApply.resOrderType == "10000"){
                                vc.jumpToPage("/admin.html#/purchaseApplyManage");
                            }else{
                                vc.jumpToPage("/admin.html#/itemOutManage");
                            }

                            return;
                        }
                        vc.message(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);
