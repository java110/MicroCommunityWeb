/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            myResourceStoreManageInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                resName: '',
                isFixeds: [],
                conditions: {
                    resId: '',
                    resName: '',
                    resCode: '',
                    shId: '',
                    parentRstId: '',
                    rstId: '',
                    rssId: '',
                    searchUserName: '',
                    searchUserId: '',
                    isFixed: ''
                },
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function() {
            vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
            vc.getDict('resource_store', "is_fixed", function(_data) {
                vc.component.myResourceStoreManageInfo.isFixeds = _data;
            });
        },
        _initEvent: function() {
            vc.on('myResourceStoreManage', 'listResourceStore', function(_param) {
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listResourceStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listResourceStores: function(_page, _rows) {
                vc.component.myResourceStoreManageInfo.conditions.page = _page;
                vc.component.myResourceStoreManageInfo.conditions.row = _rows;
                vc.component.myResourceStoreManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.myResourceStoreManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.resCode = param.params.resCode.trim();
                param.params.searchUserId = param.params.searchUserId.trim();
                param.params.searchUserName = param.params.searchUserName.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listUserStorehouses',
                    param,
                    function(json, res) {
                        var _myResourceStoreManageInfo = JSON.parse(json);
                        vc.component.myResourceStoreManageInfo.total = _myResourceStoreManageInfo.total;
                        vc.component.myResourceStoreManageInfo.records = _myResourceStoreManageInfo.records;
                        vc.component.myResourceStoreManageInfo.resourceStores = _myResourceStoreManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.myResourceStoreManageInfo.records,
                            dataCount: vc.component.myResourceStoreManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryResourceStoreMethod: function() {
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreMethod: function() {
                vc.component.myResourceStoreManageInfo.conditions.resId = "";
                vc.component.myResourceStoreManageInfo.conditions.resName = "";
                vc.component.myResourceStoreManageInfo.conditions.resCode = "";
                vc.component.myResourceStoreManageInfo.conditions.rstId = "";
                vc.component.myResourceStoreManageInfo.conditions.parentRstId = "";
                vc.component.myResourceStoreManageInfo.conditions.rssId = "";
                vc.component.myResourceStoreManageInfo.conditions.searchUserId = "";
                vc.component.myResourceStoreManageInfo.conditions.searchUserName = "";
                vc.component.myResourceStoreManageInfo.conditions.isFixed = "";
                vc.component.myResourceStoreManageInfo.resourceStoreSonTypes = [];
                vc.component.myResourceStoreManageInfo.resourceStoreSpecifications = [];
                vc.component._listResourceStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.myResourceStoreManageInfo.moreCondition) {
                    vc.component.myResourceStoreManageInfo.moreCondition = false;
                } else {
                    vc.component.myResourceStoreManageInfo.moreCondition = true;
                }
            },
            _listResourceStoreTypes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.myResourceStoreManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                vc.component.myResourceStoreManageInfo.conditions.rstId = '';
                vc.component.myResourceStoreManageInfo.resourceStoreSonTypes = [];
                if (vc.component.myResourceStoreManageInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: vc.component.myResourceStoreManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.myResourceStoreManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function() {
                vc.component.myResourceStoreManageInfo.resourceStoreSpecifications = [];
                vc.component.myResourceStoreManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.myResourceStoreManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function(json, res) {
                        var _myResourceStoreManageInfo = JSON.parse(json);
                        vc.component.myResourceStoreManageInfo.resourceStoreSpecifications = _myResourceStoreManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 跳转转赠商品页面
            _jump2TransferGoodsPage: function() {
                vc.jumpToPage("/#/pages/common/transferGoodsStep");
            },
            //损耗
            _jump2ScrapGoodsPage: function() {
                vc.jumpToPage("/#/pages/common/scrapGoodsStep");
            },
            // 退还商品
            _jump2ReturnGoodsPage: function() {
                vc.jumpToPage("/#/pages/common/returnStorehouseApplyManage");
            }
        }
    });
})(window.vc);