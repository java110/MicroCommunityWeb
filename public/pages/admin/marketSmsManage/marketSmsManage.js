/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketSmsManageInfo: {
                marketSmss: [],
                smsTypes:[],
                total: 0,
                records: 1,
                moreCondition: false,
                venueId: '',
                conditions: {
                    smsName: '',
                    smsType: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listMarketSmss(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('market_sms_key','sms_type',function(_data){
                $that.marketSmsManageInfo.smsTypes = _data;
            })
        },
        _initEvent: function () {

            vc.on('marketSmsManage', 'listMarketSms', function (_param) {
                vc.component._listMarketSmss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMarketSmss(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketSmss: function (_page, _rows) {

                vc.component.marketSmsManageInfo.conditions.page = _page;
                vc.component.marketSmsManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.marketSmsManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/marketSms.listMarketSms',
                    param,
                    function (json, res) {
                        var _marketSmsManageInfo = JSON.parse(json);
                        vc.component.marketSmsManageInfo.total = _marketSmsManageInfo.total;
                        vc.component.marketSmsManageInfo.records = _marketSmsManageInfo.records;
                        vc.component.marketSmsManageInfo.marketSmss = _marketSmsManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.marketSmsManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMarketSmsModal: function () {
                vc.emit('addMarketSms', 'openAddMarketSmsModal', {});
            },
            _openEditMarketSmsModel: function (_marketSms) {
                vc.emit('editMarketSms', 'openEditMarketSmsModal', _marketSms);
            },
            _openDeleteMarketSmsModel: function (_marketSms) {
                vc.emit('deleteMarketSms', 'openDeleteMarketSmsModal', _marketSms);
            },
            _queryMarketSmsMethod: function () {
                vc.component._listMarketSmss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.marketSmsManageInfo.moreCondition) {
                    vc.component.marketSmsManageInfo.moreCondition = false;
                } else {
                    vc.component.marketSmsManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
