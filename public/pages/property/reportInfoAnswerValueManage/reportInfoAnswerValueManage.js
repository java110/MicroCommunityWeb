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
                reportInfoSettings: [],
                records: 1,
                moreCondition: false,
                titleId: '',
                reportTypes: [],
                conditions: {
                    userName: '',
                    repName: '',
                    repTitle: '',
                    valueContent: '',
                    reportType: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.getDict('report_info_setting', "report_type", function (_data) {
                vc.component.reportInfoAnswerValueManageInfo.reportTypes = _data;
            });
            vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listReportInfoSettings(DEFAULT_PAGE, DEFAULT_ROWS);
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
                param.params.repTitle = param.params.repTitle.trim();
                param.params.valueContent = param.params.valueContent.trim();
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
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listReportInfoSettings: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                vc.http.apiGet('/reportInfoSetting/queryReportInfoSetting',
                    param,
                    function (json, res) {
                        var _reportInfoSettingManageInfo = JSON.parse(json);
                        vc.component.reportInfoAnswerValueManageInfo.total = _reportInfoSettingManageInfo.total;
                        vc.component.reportInfoAnswerValueManageInfo.records = _reportInfoSettingManageInfo.records;
                        vc.component.reportInfoAnswerValueManageInfo.reportInfoSettings = _reportInfoSettingManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toQuestionAnswerTitle: function (_questionAnswer) {
                /**let now = new Date().getTime();
                 let start = new Date(_questionAnswer.startTime.replace(/-/g,'/')).getTime();
                 let end = new Date(_questionAnswer.endTime.replace(/-/g,'/')).getTime();
                 if(now < start || now > end){
                    vc.toast('不在开放时段内！');
                    return;
                }**/
                vc.jumpToPage('/#/pages/property/reportInfoAnswerManage')
            },
            //查询
            _queryReportInfoAnswerValueMethod: function () {
                vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetReportInfoAnswerValueMethod: function () {
                vc.component.reportInfoAnswerValueManageInfo.conditions.repName = "";
                vc.component.reportInfoAnswerValueManageInfo.conditions.repTitle = "";
                vc.component.reportInfoAnswerValueManageInfo.conditions.valueContent = "";
                vc.component.reportInfoAnswerValueManageInfo.conditions.reportType = "";
                vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.reportInfoAnswerValueManageInfo.moreCondition) {
                    vc.component.reportInfoAnswerValueManageInfo.moreCondition = false;
                } else {
                    vc.component.reportInfoAnswerValueManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);