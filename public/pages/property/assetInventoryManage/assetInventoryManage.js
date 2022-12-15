/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryManageInfo: {
                assetInventorys: [],
                storehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                aiId: '',
                states: [],
                conditions: {
                    shId: '',
                    staffName: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                curStaffId: ''
            }
        },
        _initMethod: function() {
            $that.assetInventoryManageInfo.curStaffId = vc.getData('/nav/getUserInfo').userId;
            $that._listShopHouses();
            vc.component._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('asset_inventory', "state", function(_data) {
                vc.component.assetInventoryManageInfo.states = _data;
            });
        },
        _initEvent: function() {
            vc.on('assetInventoryManage', 'listAssetInventory', function(_param) {
                vc.component._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAssetInventorys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAssetInventorys: function(_page, _rows) {
                vc.component.assetInventoryManageInfo.conditions.page = _page;
                vc.component.assetInventoryManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.assetInventoryManageInfo.conditions
                };
                param.params.staffName = param.params.staffName.trim();
                //发送get请求
                vc.http.apiGet('assetInventory.listAssetInventory',
                    param,
                    function(json, res) {
                        var _assetInventoryManageInfo = JSON.parse(json);
                        vc.component.assetInventoryManageInfo.total = _assetInventoryManageInfo.total;
                        vc.component.assetInventoryManageInfo.records = _assetInventoryManageInfo.records;
                        vc.component.assetInventoryManageInfo.assetInventorys = _assetInventoryManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.assetInventoryManageInfo.records,
                            dataCount: vc.component.assetInventoryManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAssetInventoryModal: function() {
                vc.jumpToPage("/#/pages/property/assetInventoryIn");
            },
            _openEditAssetInventoryModel: function(_assetInventory) {
                vc.jumpToPage('/#/pages/property/assetInventoryEdit?aiId=' + _assetInventory.aiId);
            },
            _openAuditAssetInventoryModel: function(_assetInventory) {
                vc.jumpToPage('/#/pages/property/assetInventoryAudit?aiId=' + _assetInventory.aiId);
            },
            _openInStockAssetInventoryModel: function(_assetInventory) {
                vc.jumpToPage('/#/pages/property/assetInventoryInStock?aiId=' + _assetInventory.aiId);
            },
            _openDeleteAssetInventoryModel: function(_assetInventory) {
                vc.emit('deleteAssetInventory', 'openDeleteAssetInventoryModal', _assetInventory);
            },
            _openCancelAssetInventoryModel: function(_assetInventory) {
                vc.emit('cancelAssetInventory', 'openCancelAssetInventoryModal', _assetInventory);
            },
            //查询
            _queryAssetInventoryMethod: function() {
                vc.component._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAssetInventoryMethod: function() {
                vc.component.assetInventoryManageInfo.conditions.shId = "";
                vc.component.assetInventoryManageInfo.conditions.staffName = "";
                vc.component.assetInventoryManageInfo.conditions.state = "";
                vc.component._listAssetInventorys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getInvLoss: function(_assetInventory) {
                let _invLoss = parseInt(_assetInventory.quantity) - parseInt(_assetInventory.invQuantity);
                if (_invLoss > 0) {
                    return _invLoss;
                }
                return 0;
            },
            _getInvProfit: function(_assetInventory) {
                let _invProfit = parseInt(_assetInventory.invQuantity) - parseInt(_assetInventory.quantity);
                if (_invProfit > 0) {
                    return _invProfit;
                }
                return 0;
            },
            _getInvLossMoney: function(_assetInventory) {
                let _invLoss = parseInt(_assetInventory.quantityMoney) - parseInt(_assetInventory.invQuantityMoney);
                if (_invLoss > 0) {
                    return _invLoss;
                }
                return 0;
            },
            _getInvProfitMoney: function(_assetInventory) {
                let _invProfit = parseInt(_assetInventory.invQuantityMoney) - parseInt(_assetInventory.quantityMoney);
                if (_invProfit > 0) {
                    return _invProfit;
                }
                return 0;
            },
            _moreCondition: function() {
                if (vc.component.assetInventoryManageInfo.moreCondition) {
                    vc.component.assetInventoryManageInfo.moreCondition = false;
                } else {
                    vc.component.assetInventoryManageInfo.moreCondition = true;
                }
            },
            _listShopHouses: function(_page, _rows) {
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
                    function(json, res) {
                        var _shopHouseManageInfo = JSON.parse(json);
                        vc.component.assetInventoryManageInfo.storehouses = _shopHouseManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);