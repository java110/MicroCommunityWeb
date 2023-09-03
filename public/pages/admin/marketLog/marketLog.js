/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            marketLogInfo: {
                logs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                venueId: '',
                conditions: {
                    communityName: '',
                    sendWay: '',
                    businessType: '',
                    personNameLike:'',
                    startTime:'',
                    endTime:''
                }
            }
        },
        _initMethod: function () {
            vc.component._listMarketLogs(DEFAULT_PAGE, DEFAULT_ROWS);

            vc.initDate('logStartTime', function(_value) {
                $that.marketLogInfo.conditions.startTime = _value;
            });

            vc.initDate('logEndTime', function(_value) {
                $that.marketLogInfo.conditions.endTime = _value;
            });

        },
        _initEvent: function () {

            vc.on('marketLog', 'listMarketLog', function (_param) {
                vc.component._listMarketLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMarketLogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMarketLogs: function (_page, _rows) {

                vc.component.marketLogInfo.conditions.page = _page;
                vc.component.marketLogInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.marketLogInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/marketRule.listMarketLog',
                    param,
                    function (json, res) {
                        var _marketLogInfo = JSON.parse(json);
                        vc.component.marketLogInfo.total = _marketLogInfo.total;
                        vc.component.marketLogInfo.records = _marketLogInfo.records;
                        vc.component.marketLogInfo.logs = _marketLogInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.marketLogInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openViewLogModel: function (_log) {
                vc.emit('viewMarketSendContent', 'openModal',_log);
            },
            _queryMarketLogMethod: function () {
                vc.component._listMarketLogs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.marketLogInfo.moreCondition) {
                    vc.component.marketLogInfo.moreCondition = false;
                } else {
                    vc.component.marketLogInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
