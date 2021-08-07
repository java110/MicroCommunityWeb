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
            }
        },
        _initMethod: function () {
            let _titleId = vc.getParam('titleId');
            $that.reportInfoAnswerValueManageInfo.titleId = _titleId;
            vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listQuestionAnswerTitles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswerTitles: function (_page, _rows) {
                let param = {
                    params: {
                        page:_page,
                        row:_rows,
                        titleId:$that.reportInfoAnswerValueManageInfo.titleId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
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
           
            _goBack: function () {
                vc.goBack();
            }

        }
    });
})(window.vc);
