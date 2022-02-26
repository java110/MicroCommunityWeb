/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportInfoSettingTitleManageInfo: {
                reportInfoSettingTitles: [],
                total: 0,
                records: 1,
                moreCondition: false,
                titleId: '',
                conditions: {
                    titleType: '',
                    title: '',
                    titleId: '',
                    settingid: '',
                    communityId: vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function() {
            let _settingId = vc.getParam('settingId');
            $that.reportInfoSettingTitleManageInfo.conditions.settingId = _settingId;
            vc.component._listReportInfoSettingTitles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('reportInfoSettingTitleManage', 'listReportInfoSettingTitle', function(_param) {
                vc.component._listReportInfoSettingTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listReportInfoSettingTitles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportInfoSettingTitles: function(_page, _rows) {

                vc.component.reportInfoSettingTitleManageInfo.conditions.page = _page;
                vc.component.reportInfoSettingTitleManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportInfoSettingTitleManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportInfoSettingTitle/querySettingTitle',
                    param,
                    function(json, res) {
                        var _reportInfoSettingTitleManageInfo = JSON.parse(json);
                        vc.component.reportInfoSettingTitleManageInfo.total = _reportInfoSettingTitleManageInfo.total;
                        vc.component.reportInfoSettingTitleManageInfo.records = _reportInfoSettingTitleManageInfo.records;
                        vc.component.reportInfoSettingTitleManageInfo.reportInfoSettingTitles = _reportInfoSettingTitleManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportInfoSettingTitleManageInfo.records,
                            dataCount: vc.component.reportInfoSettingTitleManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportInfoSettingTitleModal: function() {
                vc.emit('addReportInfoSettingTitle', 'openAddReportInfoSettingTitleModal', {
                    settingId: $that.reportInfoSettingTitleManageInfo.conditions.settingId,
                });
            },
            _openEditReportInfoSettingTitleModel: function(_reportInfoSettingTitle) {
                vc.emit('editReportInfoSettingTitle', 'openEditReportInfoSettingTitleModal', _reportInfoSettingTitle);
            },
            _openDeleteReportInfoSettingTitleModel: function(_reportInfoSettingTitle) {
                vc.emit('deleteReportInfoSettingTitle', 'openDeleteReportInfoSettingTitleModal', _reportInfoSettingTitle);
            },
            _queryReportInfoSettingTitleMethod: function() {
                vc.component._listReportInfoSettingTitles(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _goBack: function() {
                vc.goBack();
            },
            _moreCondition: function() {
                if (vc.component.reportInfoSettingTitleManageInfo.moreCondition) {
                    vc.component.reportInfoSettingTitleManageInfo.moreCondition = false;
                } else {
                    vc.component.reportInfoSettingTitleManageInfo.moreCondition = true;
                }
            },
            _getTitleTypeName: function(_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            _openQuestionValueModel: function(_reportInfoSettingTitle) {
                vc.emit('reportInfoSettingTitleValue', 'openreportInfoSettingTitleValueModel', _reportInfoSettingTitle);
            },
            _toQuestionValueModel: function(_reportInfoSettingTitle) {
                vc.jumpToPage('/#/pages/property/reportInfoAnswerValueManage?titleId=' + _reportInfoSettingTitle.titleId)
            }


        }
    });
})(window.vc);