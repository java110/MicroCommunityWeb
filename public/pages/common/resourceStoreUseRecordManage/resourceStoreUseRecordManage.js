/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceStoreUseRecordManageInfo: {
                resourceStoreUseRecords: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rsurId: '',
                conditions: {
                    rsurId: '',
                    repairId: '',
                    resId: '',
                    rstId: '',
                    rssId: '',
                    createUserId: '',
                    createUserName: ''
                },
                resourceStoreTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('resourceStoreUseRecordManage', 'listResourceStoreUseRecord', function (_param) {
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listResourceStoreUseRecords(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listResourceStoreUseRecords: function (_page, _rows) {
                vc.component.resourceStoreUseRecordManageInfo.conditions.page = _page;
                vc.component.resourceStoreUseRecordManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.resourceStoreUseRecordManageInfo.conditions
                };
                param.params.rsurId = param.params.rsurId.trim();
                param.params.repairId = param.params.repairId.trim();
                param.params.resId = param.params.resId.trim();
                param.params.createUserId = param.params.createUserId.trim();
                param.params.createUserName = param.params.createUserName.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        vc.component.resourceStoreUseRecordManageInfo.total = _resourceStoreUseRecordManageInfo.total;
                        vc.component.resourceStoreUseRecordManageInfo.records = _resourceStoreUseRecordManageInfo.records;
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreUseRecords = _resourceStoreUseRecordManageInfo.data;
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreUseRecords.forEach((item) => {
                            if (item.resId == '666666'){
                                item.rstName = item.specName = '自定义';
                            }
                        })
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceStoreUseRecordManageInfo.records,
                            dataCount: vc.component.resourceStoreUseRecordManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddResourceStoreUseRecordModal: function () {
                vc.emit('addResourceStoreUseRecord', 'openAddResourceStoreUseRecordModal', {});
            },
            //查询
            _queryResourceStoreUseRecordMethod: function () {
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreUseRecordMethod: function () {
                vc.component.resourceStoreUseRecordManageInfo.conditions.rsurId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.repairId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.resId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.createUserId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.createUserName = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.rstId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.rssId = "";
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
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
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                vc.component.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = [];
                vc.component.resourceStoreUseRecordManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.resourceStoreUseRecordManageInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = _resourceStoreUseRecordManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.resourceStoreUseRecordManageInfo.moreCondition) {
                    vc.component.resourceStoreUseRecordManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceStoreUseRecordManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
