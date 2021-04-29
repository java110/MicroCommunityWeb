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
                    createUserId: '',
                    createUserName: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
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
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        console.log("123")
                        console.log(_resourceStoreUseRecordManageInfo)
                        vc.component.resourceStoreUseRecordManageInfo.total = _resourceStoreUseRecordManageInfo.total;
                        vc.component.resourceStoreUseRecordManageInfo.records = _resourceStoreUseRecordManageInfo.records;
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreUseRecords = _resourceStoreUseRecordManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceStoreUseRecordManageInfo.records,
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
            _queryResourceStoreUseRecordMethod: function () {
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
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
