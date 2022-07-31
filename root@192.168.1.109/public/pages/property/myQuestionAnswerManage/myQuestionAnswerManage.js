/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            myQuestionAnswerManageInfo: {
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
                    roleCd: 'staff'
                }
            }
        },
        _initMethod: function() {
            vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('myQuestionAnswerManage', 'listQuestionAnswer', function(_param) {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listQuestionAnswers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswers: function(_page, _rows) {

                vc.component.myQuestionAnswerManageInfo.conditions.page = _page;
                vc.component.myQuestionAnswerManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.myQuestionAnswerManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/userQuestionAnswer/queryUserQuestionAnswer',
                    param,
                    function(json, res) {
                        var _myQuestionAnswerManageInfo = JSON.parse(json);
                        vc.component.myQuestionAnswerManageInfo.total = _myQuestionAnswerManageInfo.total;
                        vc.component.myQuestionAnswerManageInfo.records = _myQuestionAnswerManageInfo.records;
                        vc.component.myQuestionAnswerManageInfo.questionAnswers = _myQuestionAnswerManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.myQuestionAnswerManageInfo.records,
                            dataCount: vc.component.myQuestionAnswerManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toQuestionAnswerTitle: function(_questionAnswer) {
                let now = new Date().getTime();
                let start = new Date(_questionAnswer.startTime.replace(/-/g, '/')).getTime();
                let end = new Date(_questionAnswer.endTime.replace(/-/g, '/')).getTime();
                if (now < start || now > end) {
                    vc.toast('不在开放时段内！');
                    return;
                }
                vc.jumpToPage('/#/pages/property/userQuestionAnswerManage?qaId=' +
                    _questionAnswer.qaId + "&objType=" + _questionAnswer.objType +
                    "&objId=" + _questionAnswer.objId +
                    "&answerType=1002&userQaId=-1")
            },
            _queryQuestionAnswerMethod: function() {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.myQuestionAnswerManageInfo.moreCondition) {
                    vc.component.myQuestionAnswerManageInfo.moreCondition = false;
                } else {
                    vc.component.myQuestionAnswerManageInfo.moreCondition = true;
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