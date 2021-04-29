/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseManageInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                storehouses: [],
                remark: ''
            }
        },
        _initMethod: function () {
            $that._listAllocationStorehouse();
        },
        _initEvent: function () {
            vc.on('allocationStorehouseApply', 'chooseResourceStore', function (_param) {
                let _addFlag = true;
                $that.allocationStorehouseManageInfo.resourceStores.forEach(item => {
                    if (item.resId == _param.resId) {
                        vc.toast('物品已经选择，请确认');
                        _addFlag = false;
                        return;
                    }
                });
                if (!_addFlag) {
                    return;
                }
                _param.shaName = _param.shName;
                _param.shzId = '';
                _param.curStock = '0'
                $that.allocationStorehouseManageInfo.resourceStores.push(_param);
            })

        },
        methods: {
            //取消调拨
            _openDeleteResourceStoreModel: function (_resourceStore) {

                let _tmpResourceStore = [];

                $that.allocationStorehouseManageInfo.resourceStores.forEach(item => {
                    if (item.resId != _resourceStore.resId) {
                        _tmpResourceStore.push(item);
                    }
                })

                $that.allocationStorehouseManageInfo.resourceStores = _tmpResourceStore;
            },

            _openAllocationStorehouseModel: function () {
                vc.emit('chooseResourceStore', 'openChooseResourceStoreModel', {
                    resOrderType: '20000'
                });
            },
            _listAllocationStorehouse: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        vc.component.allocationStorehouseManageInfo.storehouses = _storehouseManageInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _submitApply: function () {
                //校验数据
                if ($that.allocationStorehouseManageInfo.remark == '') {
                    vc.toast('申请说明不能为空');
                    return;
                }

                let _saveFlag = true;

                if ($that.allocationStorehouseManageInfo.resourceStores.length < 1) {
                    vc.toast('请选择物品');
                    return;
                }

                $that.allocationStorehouseManageInfo.resourceStores.forEach(item => {
                    if (parseInt(item.curStock) > parseInt(item.stock)) {
                        vc.toast(item.name + "库存不足");
                        _saveFlag = false;
                        return;
                    }
                });

                if (!_saveFlag) {
                    return;
                }
                vc.http.apiPost(
                    'resourceStore.saveAllocationStorehouse',
                    JSON.stringify($that.allocationStorehouseManageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });

            }
        }
    });
})(window.vc);
