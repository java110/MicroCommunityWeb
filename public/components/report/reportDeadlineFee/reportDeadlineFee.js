/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportDeadlineFeeInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                conditions: {}
            }
        },
        _initMethod: function() {
            $(".popover-show").mouseover(() => {
                $('.popover-show').popover('show');
            })
            $(".popover-show").mouseleave(() => {
                $('.popover-show').popover('hide');
            })
        },
        _initEvent: function() {
            vc.on('reportDeadlineFee', 'switch', function(_data) {
                $that.reportDeadlineFeeInfo.conditions = _data;
                $that._listDeadlineFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportDeadlineFee', 'paginationPlus', 'page_event', function(_currentPage) {
                $that._listDeadlineFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listDeadlineFees: function(_page, _rows) {
                $that.reportDeadlineFeeInfo.conditions.page = _page;
                $that.reportDeadlineFeeInfo.conditions.row = _rows;
                $that.reportDeadlineFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.reportDeadlineFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryDeadlineFee',
                    param,
                    function(json, res) {
                        var _reportDeadlineFeeInfo = JSON.parse(json);
                        $that.reportDeadlineFeeInfo.total = _reportDeadlineFeeInfo.total;
                        $that.reportDeadlineFeeInfo.records = _reportDeadlineFeeInfo.records;
                        $that.reportDeadlineFeeInfo.fees = _reportDeadlineFeeInfo.data;
                        vc.emit('reportDeadlineFee', 'paginationPlus', 'init', {
                            total: $that.reportDeadlineFeeInfo.records,
                            dataCount: $that.reportDeadlineFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportDeadlineFee&' + vc.objToGetParam($that.reportDeadlineFeeInfo.conditions));
            }
        }
    });
})(window.vc);