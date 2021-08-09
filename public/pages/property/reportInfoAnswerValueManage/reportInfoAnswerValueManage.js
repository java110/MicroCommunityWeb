/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportInfoAnswerValueManageInfo: {
                values: [],
                total: 0,
                records: 1,
                moreCondition: false,
                titleId: '',
                conditions:{
                    userName:'',
                    repName:'',
                    repTitle:'',
                    valueContent:'',
                    communityId:vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
            vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listQuestionAnswerTitles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswerTitles: function (_page, _rows) {

                vc.component.reportInfoAnswerValueManageInfo.conditions.page = _page;
                vc.component.reportInfoAnswerValueManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportInfoAnswerValueManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportInfoAnswerValue/queryReportInfoAnswerValue',
                    param,
                    function (json, res) {
                        var _reportInfoAnswerValueManageInfo = JSON.parse(json);
                        vc.component.reportInfoAnswerValueManageInfo.total = _reportInfoAnswerValueManageInfo.total;
                        vc.component.reportInfoAnswerValueManageInfo.records = _reportInfoAnswerValueManageInfo.records;
                        vc.component.reportInfoAnswerValueManageInfo.values = _reportInfoAnswerValueManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportInfoAnswerValueManageInfo.records,
                            dataCount: vc.component.reportInfoAnswerValueManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryReportInfoAnswerValueMethod: function(){
                vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            }

        }
    });
})(window.vc);
