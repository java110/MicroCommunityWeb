/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            urgentPurchaseApplyStepInfo: {
                resourceStores: [],
                description: '',
                endUserName: '',
                endUserTel: '',
                file: '',
                resOrderType: '',
                staffId: '',
                shId: '',
                staffName: '',
                communityId: vc.getCurrentCommunity().communityId,
                storehouses: []
            }
        },
        _initMethod: function () {
            //10000 采购 20000出库
            $that.urgentPurchaseApplyStepInfo.resOrderType = vc.getParam('resOrderType');
            let userInfo = vc.getData('/nav/getUserInfo');
            $that.urgentPurchaseApplyStepInfo.endUserName = userInfo.name;
            $that.urgentPurchaseApplyStepInfo.endUserTel = userInfo.tel;
            $that._listAllocationStorehouse();
        },
        _initEvent: function () {
            vc.on('urgentPurchaseApplyStep', 'chooseResourceStore', function (_app) {
                vc.copyObject(_app, $that.urgentPurchaseApplyStepInfo);
            });
            vc.on('urgentPurchaseApplyStep', 'setSelectResourceStores', function (resourceStores) {
                let oldList = $that.urgentPurchaseApplyStepInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    newItem.shzId = '';
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId) {
                            delete resourceStores[newIndex];
                        }
                    })
                })
                // 合并已有商品和新添加商品
                resourceStores.push.apply(resourceStores, oldList);
                // 过滤空元素
                resourceStores = resourceStores.filter((s) => {
                    return s.hasOwnProperty('resId');
                });
                $that.urgentPurchaseApplyStepInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _finishStep: function () {
                let _resourceStores = $that.urgentPurchaseApplyStepInfo.resourceStores;
                if (!_resourceStores || _resourceStores.length < 1) {
                    vc.toast('请选择采购物品');
                    return;
                }
                vc.http.apiPost(
                    '/purchase/urgentPurchaseApply',
                    JSON.stringify($that.urgentPurchaseApplyStepInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.goBack();
                            vc.toast(_json.msg);
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openSelectResourceStoreInfoModel() {
                vc.emit('chooseResourceStore4', 'openChooseResourceStoreModel4', {
                    shId: $that.urgentPurchaseApplyStepInfo.shId
                });
            },
            _listAllocationStorehouse: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        allowPurchase: 'ON'
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        $that.urgentPurchaseApplyStepInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            storeHousesChange: function (e, i) {
                let shId = e.target.value;
                $that.urgentPurchaseApplyStepInfo.storehouses.forEach((item) => {
                    if (item.shId == shId) {
                        $that.urgentPurchaseApplyStepInfo.resourceStores[i].shzName = item.shName;
                    }
                })
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                $that.urgentPurchaseApplyStepInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        $that.urgentPurchaseApplyStepInfo.resourceStores.splice(index, 1);
                    }
                })
            },

        }
    });
})(window.vc);