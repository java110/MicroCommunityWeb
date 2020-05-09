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
                    endUserName:'',
                    endUserTel:'',
                    file:'',
                    resOrderType:'',
                    staffId:'',
                    staffName:''
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
                vc.component.addPurchaseApplyStepInfo.infos[0] = viewResourceStoreInfo2.resourceStores;
            });

            vc.on("addPurchaseApplyStep", "notify2", function (info) {
                vc.component.addPurchaseApplyStepInfo.purchaseApply.description = info.description;
                vc.component.addPurchaseApplyStepInfo.purchaseApply.endUserName = info.endUserName;
                vc.component.addPurchaseApplyStepInfo.purchaseApply.endUserTel = info.endUserTel;
                vc.component.addPurchaseApplyStepInfo.infos[1] = info;
            });
            vc.on("addPurchaseApplyStep", "notify3", function (info) {
                vc.component.addPurchaseApplyStepInfo.purchaseApply.staffId = info.staffId;
                vc.component.addPurchaseApplyStepInfo.purchaseApply.staffName = info.staffName;
                vc.component.addPurchaseApplyStepInfo.infos[2] = info;
            });

        },
        methods: {
            _initStep: function () {
                vc.component.addPurchaseApplyStepInfo.$step = $("#step");
                vc.component.addPurchaseApplyStepInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择物品", "申请信息","审批人"]
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
                let _resourceStores = vc.component.addPurchaseApplyStepInfo.purchaseApply.resourceStores;
                var _currentData = vc.component.addPurchaseApplyStepInfo.infos[vc.component.addPurchaseApplyStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
               for( var i = 0; i < _resourceStores.length; i++){
                   if(_resourceStores[i].quantity <= 0){
                       vc.toast("请完善物品信息");
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
                var _currentData = vc.component.addPurchaseApplyStepInfo.infos[vc.component.addPurchaseApplyStepInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
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
                                vc.jumpToPage("/admin.html#/pages/common/purchaseApplyManage");
                            }else{
                                vc.jumpToPage("/admin.html#/pages/common/itemOutManage");
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
