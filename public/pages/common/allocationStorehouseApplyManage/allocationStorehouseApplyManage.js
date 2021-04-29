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
                storehouses: []
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
                if(!_addFlag){
                    return ;
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
        }
    });
})(window.vc);
