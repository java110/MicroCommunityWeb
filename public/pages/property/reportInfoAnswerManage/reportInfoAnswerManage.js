/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            userQuestionAnswerManageInfo: {
                questionAnswerTitles: [],
                total: 0,
                records: 1,
                moreCondition: false,
                reportInfoSettings: [],
                settingId: '',
                communityId: vc.getCurrentCommunity().communityId,
                personId: '',
                personName: ''
            }
        },
        _initMethod: function () {
            $that._listReportInfoSettings(1, 50);
            /**let _that = $that.userQuestionAnswerManageInfo;
             let _qaId = vc.getParam('qaId');
             _that.qaId = _qaId;
             _that.objType = vc.getParam('objType');
             _that.objId = vc.getParam('objId');
             _that.answerType = vc.getParam('answerType');
             _that.userQaId = vc.getParam('userQaId');
             vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);**/
        },
        _initEvent: function () {
        },
        methods: {
            _listQuestionAnswerTitles: function (_page, _rows) {
                let _that = $that.userQuestionAnswerManageInfo;
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        settingId: _that.settingId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportInfoSettingTitle/querySettingTitle',
                    param,
                    function (json, res) {
                        _that.questionAnswerTitles = [];
                        let _userQuestionAnswerManageInfo = JSON.parse(json);
                        _that.questionAnswerTitles = _userQuestionAnswerManageInfo.data;
                        console.log(_that.questionAnswerTitles);
                        _that.questionAnswerTitles.forEach(item => {
                            if (item.titleType == '3003') {
                                item.valueContent = '';
                            } else {
                                item.valueContent = [];
                            }
                        });
                        vc.component.userQuestionAnswerManageInfo.moreCondition = true;
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
                        vc.component.userQuestionAnswerManageInfo.total = _reportInfoSettingManageInfo.total;
                        vc.component.userQuestionAnswerManageInfo.records = _reportInfoSettingManageInfo.records;
                        vc.component.userQuestionAnswerManageInfo.reportInfoSettings = _reportInfoSettingManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toQuestionAnswerTitle: function (_questionAnswer) {
                vc.jumpToPage('/#/pages/property/questionAnswerTitleManage?qaId=' + _questionAnswer.qaId + "&objType=" + _questionAnswer.objType + "&objId=" + _questionAnswer.objId)
            },
            _queryQuestionAnswerMethod: function () {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.userQuestionAnswerManageInfo.moreCondition) {
                    vc.component.userQuestionAnswerManageInfo.moreCondition = false;
                } else {
                    vc.component.userQuestionAnswerManageInfo.moreCondition = true;
                }
            },
            _getStateName: function (_state) {
                if (_state == '1201') {
                    return '待领导评价';
                } else if (_state == '1202') {
                    return '完成';
                }
                return '待答题'
            },
            _goBack: function () {
                vc.goBack();
            },
            _saveUserQuestionAnswer: function () {
                vc.http.apiPost(
                    '/reportInfoAnswerValue/saveReportInfoAnswerValue',
                    JSON.stringify(vc.component.userQuestionAnswerManageInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.toast("登记成功");
                            $that._goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);