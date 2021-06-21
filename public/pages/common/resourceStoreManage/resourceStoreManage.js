/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceStoreManageInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                subTotalPrice: 0.0,
                highTotalPrice: 0.0,
                conditions: {
                    resId: '',
                    resName: '',
                    resCode: '',
                    shId: '',
                    rstId: '',
                    rssId: ''
                },
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            let _shId = vc.getParam('shId');
            if (_shId) {
                vc.component.resourceStoreManageInfo.conditions.shId = _shId;
            }
            vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('resourceStoreManage', 'listResourceStore', function (_param) {
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceStoreManage', 'pageReload', function (_param) {
                location.reload();
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listResourceStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listResourceStores: function (_page, _rows) {
                vc.component.resourceStoreManageInfo.conditions.page = _page;
                vc.component.resourceStoreManageInfo.conditions.row = _rows;
                vc.component.resourceStoreManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.resourceStoreManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.resCode = param.params.resCode.trim();
                //发送get请求
                vc.http.get('resourceStoreManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreManageInfo = JSON.parse(json);
                        vc.component.resourceStoreManageInfo.total = _resourceStoreManageInfo.total;
                        vc.component.resourceStoreManageInfo.records = _resourceStoreManageInfo.records;
                        // 总价列计算
                        _resourceStoreManageInfo.resourceStores.forEach((item) => {
                            if (!item.hasOwnProperty('averagePrice')) {
                                let averagePrice = 0;
                                item.averagePrice = averagePrice.toFixed(2);
                            } else {
                                item.averagePrice = parseFloat(item.averagePrice).toFixed(2);
                            }
                            item.totalPrice = (item.averagePrice * item.stock).toFixed(2);
                        });
                        vc.component.resourceStoreManageInfo.resourceStores = _resourceStoreManageInfo.resourceStores;
                        if (_resourceStoreManageInfo.resourceStores.length > 0) {
                            vc.component.resourceStoreManageInfo.subTotalPrice = _resourceStoreManageInfo.resourceStores[0].subTotalPrice;
                            vc.component.resourceStoreManageInfo.highTotalPrice = _resourceStoreManageInfo.resourceStores[0].highTotalPrice;
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceStoreManageInfo.records,
                            dataCount: vc.component.resourceStoreManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddResourceStoreModal: function () {
                vc.emit('addResourceStore', 'openAddResourceStoreModal', {});
            },
            _openEditResourceStoreModel: function (_resourceStore) {
                vc.emit('editResourceStore', 'openEditResourceStoreModal', _resourceStore);
            },

            _openDeleteResourceStoreModel: function (_resourceStore) {
                vc.emit('deleteResourceStore', 'openDeleteResourceStoreModal', _resourceStore);
            },
            //查询
            _queryResourceStoreMethod: function () {
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreMethod: function () {
                vc.component.resourceStoreManageInfo.conditions.resId = '';
                vc.component.resourceStoreManageInfo.conditions.resName = '';
                vc.component.resourceStoreManageInfo.conditions.resCode = '';
                vc.component.resourceStoreManageInfo.conditions.shId = '';
                vc.component.resourceStoreManageInfo.conditions.rstId = '';
                vc.component.resourceStoreManageInfo.conditions.rssId = '';
                $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.resourceStoreManageInfo.moreCondition) {
                    vc.component.resourceStoreManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceStoreManageInfo.moreCondition = true;
                }
            },
            _listStorehouses: function (_page, _rows) {
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
                        var _storehouseManageInfo = JSON.parse(json);
                        vc.component.resourceStoreManageInfo.storehouses = _storehouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.resourceStoreManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                vc.component.resourceStoreManageInfo.resourceStoreSpecifications = [];
                vc.component.resourceStoreManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.resourceStoreManageInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _resourceStoreManageInfo = JSON.parse(json);
                        vc.component.resourceStoreManageInfo.resourceStoreSpecifications = _resourceStoreManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 跳转出入库页面
            _jump2InAndOutPage: function () {
                vc.jumpToPage("/admin.html#/pages/common/inAndOutStep");
            }
        }
    });
})(window.vc);
