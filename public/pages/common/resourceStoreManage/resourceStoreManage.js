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
                isFixeds: [],
                conditions: {
                    resId: '',
                    resName: '',
                    resCode: '',
                    shId: '',
                    parentRstId: '',
                    rstId: '',
                    rssId: '',
                    isFixed: '',
                    flag: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                curType: {},
                storehouses: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            let _shId = vc.getParam('shId');
            if (_shId) {
                $that.resourceStoreManageInfo.conditions.shId = _shId;
            }
            $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
            $that._listResourceStoreSpecifications();
            vc.getDict('resource_store', "is_fixed", function (_data) {
                $that.resourceStoreManageInfo.isFixeds = _data;
            });
            let flag = vc.getParam('flag');
            if (flag) {
                $that.resourceStoreManageInfo.conditions.flag = flag;
            }
        },
        _initEvent: function () {
            vc.on('resourceStoreManage', 'listResourceStore', function (_param) {
                $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceStoreManage', 'switchParent', function (_param) {
                $that.resourceStoreManageInfo.conditions.parentRstId = _param.parentRstId;
                $that._listResourceStoreTypes(_param.parentRstId);
                $that.resourceStoreManageInfo.conditions.rstId = '';
                $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('resourceStoreManage', 'switchRst', function (_param) {
                $that.resourceStoreManageInfo.conditions.parentRstId = '';
                $that.resourceStoreManageInfo.conditions.rstId = _param.rstId;
                $that._listResourceStoreTypes(_param.rstId);

                $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });

            vc.on('resourceStoreManage', 'pageReload', function (_param) {
                location.reload();
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listResourceStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listResourceStores: function (_page, _rows) {
                $that.resourceStoreManageInfo.conditions.page = _page;
                $that.resourceStoreManageInfo.conditions.row = _rows;
                $that.resourceStoreManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.resourceStoreManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.resCode = param.params.resCode.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStores',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.resourceStoreManageInfo.total = _json.total;
                        $that.resourceStoreManageInfo.records = _json.records;
                        // 总价列计算
                        _json.resourceStores.forEach((item) => {
                            if (!item.hasOwnProperty('averagePrice')) {
                                let averagePrice = 0;
                                item.averagePrice = averagePrice.toFixed(2);
                            } else {
                                item.averagePrice = parseFloat(item.averagePrice).toFixed(2);
                            }
                            item.totalPrice = (item.averagePrice * item.stock).toFixed(2);
                        });
                        $that.resourceStoreManageInfo.resourceStores = _json.resourceStores;
                        $that.resourceStoreManageInfo.subTotalPrice = _json.subTotal;
                        $that.resourceStoreManageInfo.highTotalPrice = _json.totalPrice;
                        vc.emit('pagination', 'init', {
                            total: $that.resourceStoreManageInfo.records,
                            dataCount: $that.resourceStoreManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
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
            _openAddResourceStoreTypeModal: function (_level) {
                let _curType = $that.resourceStoreManageInfo.curType;
                if (_level == 1) {
                    vc.emit('addResourceStoreType', 'openAddResourceStoreTypeModal', {});
                } else {
                    if (!_curType.rstId || _curType.parentId != 0) {
                        vc.toast('请选择一级分类');
                        return;
                    }
                    vc.emit('addResourceStoreType', 'openAddResourceStoreTypeModal', _curType.rstId);
                }

            },
            _openDeleteResourceStoreTypeModel: function () {
                let _curType = $that.resourceStoreManageInfo.curType;
                if (!_curType.rstId) {
                    vc.toast('请选择分类');
                    return;
                }
                vc.emit('deleteResourceStoreType', 'openDeleteResourceStoreTypeModal', _curType);
            },
            _openEditResourceStoreTypeModel: function () {
                let _curType = $that.resourceStoreManageInfo.curType;
                if (!_curType.rstId) {
                    vc.toast('请选择分类');
                    return;
                }
                vc.emit("editResourceStoreType", "openEditResourceStoreTypeModal", _curType);
            },
            //查询
            _queryResourceStoreMethod: function () {
                $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreMethod: function () {
                $that.resourceStoreManageInfo.conditions.resId = '';
                $that.resourceStoreManageInfo.conditions.resName = '';
                $that.resourceStoreManageInfo.conditions.resCode = '';
                $that.resourceStoreManageInfo.conditions.shId = '';
                $that.resourceStoreManageInfo.conditions.rstId = '';
                $that.resourceStoreManageInfo.conditions.parentRstId = '';
                $that.resourceStoreManageInfo.conditions.rssId = '';
                $that.resourceStoreManageInfo.conditions.isFixed = '';
                $that.resourceStoreManageInfo.resourceStoreSonTypes = [];
                $that.resourceStoreManageInfo.resourceStoreSpecifications = [];
                $that._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.resourceStoreManageInfo.moreCondition) {
                    $that.resourceStoreManageInfo.moreCondition = false;
                } else {
                    $that.resourceStoreManageInfo.moreCondition = true;
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
                        $that.resourceStoreManageInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                $that.resourceStoreManageInfo.resourceStoreSpecifications = [];
                $that.resourceStoreManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.resourceStoreManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.resourceStoreManageInfo.resourceStoreSpecifications = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypes: function (_rstId) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        rstId: _rstId,
                        communityId: vc.getCurrentCommunity().communityId,

                    }
                };
                //发送post请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.resourceStoreManageInfo.curType = _json.data[0];
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _jump2InPage: function () {
                vc.jumpToPage("/#/pages/common/addPurchaseApply?resOrderType=10000");
            },
            // 跳转出入库页面
            _jump2OutPage: function () {
                vc.jumpToPage("/#/pages/common/addItemOut?resOrderType=20000");
            },
            _toResourceStoreDetail: function (_resource) {
                window.open("/#/pages/resource/resourceDetail?resId=" + _resource.resId);
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=resourceStoreManage&' + vc.objToGetParam($that.resourceStoreManageInfo.conditions));
            },
            _importResourceStoreModal: function () {
                vc.emit('importResourceStore', 'openimportResourceStoreModal', {});
            },
            _queryTotalPrice: function (_resourceStore) {
                vc.emit('resourceStoreTimes', 'openChooseResourceStoreModel', _resourceStore);
            }
        }
    });
})(window.vc);