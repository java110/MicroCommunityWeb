/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketBlacklistManageInfo: {
                marketBlacklists: [],
                total: 0,
                records: 1,
                moreCondition: false,
                blId: '',
                conditions: {
                    blId: '',
                    personName: '',
                    filter: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listMarketBlacklists(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('marketBlacklistManage', 'listMarketBlacklist', function (_param) {
                vc.component._listMarketBlacklists(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMarketBlacklists(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketBlacklists: function (_page, _rows) {

                vc.component.marketBlacklistManageInfo.conditions.page = _page;
                vc.component.marketBlacklistManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.marketBlacklistManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/marketBlacklist.listMarketBlacklist',
                    param,
                    function (json, res) {
                        let _marketBlacklistManageInfo = JSON.parse(json);
                        vc.component.marketBlacklistManageInfo.total = _marketBlacklistManageInfo.total;
                        vc.component.marketBlacklistManageInfo.records = _marketBlacklistManageInfo.records;
                        vc.component.marketBlacklistManageInfo.marketBlacklists = _marketBlacklistManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.marketBlacklistManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketBlacklistModal: function () {
                vc.emit('addMarketBlacklist', 'openAddMarketBlacklistModal', {});
            },
            _openEditMarketBlacklistModel: function (_marketBlacklist) {
                vc.emit('editMarketBlacklist', 'openEditMarketBlacklistModal', _marketBlacklist);
            },
            _openDeleteMarketBlacklistModel: function (_marketBlacklist) {
                vc.emit('deleteMarketBlacklist', 'openDeleteMarketBlacklistModal', _marketBlacklist);
            },
            _queryMarketBlacklistMethod: function () {
                vc.component._listMarketBlacklists(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.marketBlacklistManageInfo.moreCondition) {
                    vc.component.marketBlacklistManageInfo.moreCondition = false;
                } else {
                    vc.component.marketBlacklistManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
