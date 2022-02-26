/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffAssessmentManageInfo: {
                questionAnswers: [],
                total: 0,
                records: 1,
                moreCondition: false,
                qaId: '',
                conditions: {
                    qaType: '',
                    qaName: '',
                    qaId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    roleCd: 'staff',
                    state: '1201'
                }
            }
        },
        _initMethod: function() {
            vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('staffAssessmentManage', 'listQuestionAnswer', function(_param) {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listQuestionAnswers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswers: function(_page, _rows) {

                vc.component.staffAssessmentManageInfo.conditions.page = _page;
                vc.component.staffAssessmentManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.staffAssessmentManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/userQuestionAnswer/queryUserQuestionAnswer',
                    param,
                    function(json, res) {
                        var _staffAssessmentManageInfo = JSON.parse(json);
                        vc.component.staffAssessmentManageInfo.total = _staffAssessmentManageInfo.total;
                        vc.component.staffAssessmentManageInfo.records = _staffAssessmentManageInfo.records;
                        vc.component.staffAssessmentManageInfo.questionAnswers = _staffAssessmentManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.staffAssessmentManageInfo.records,
                            dataCount: vc.component.staffAssessmentManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toQuestionAnswerTitle: function(_questionAnswer) {
                vc.jumpToPage('/#/pages/property/userQuestionAnswerManage?qaId=' + _questionAnswer.qaId +
                    "&objType=" + _questionAnswer.objType +
                    "&objId=" + _questionAnswer.objId +
                    "&answerType=2003" +
                    "&userQaId=" + _questionAnswer.userQaId)
            },
            _queryQuestionAnswerMethod: function() {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.staffAssessmentManageInfo.moreCondition) {
                    vc.component.staffAssessmentManageInfo.moreCondition = false;
                } else {
                    vc.component.staffAssessmentManageInfo.moreCondition = true;
                }
            },
            _getStateName: function(_state) {
                if (_state == '1201') {
                    return '待领导评价';
                } else if (_state == '1202') {
                    return '完成';
                }

                return '待答题'
            }


        }
    });
})(window.vc);