/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            questionAnswerManageInfo: {
                questionAnswers: [],
                total: 0,
                records: 1,
                moreCondition: false,
                qaId: '',
                conditions: {
                    qaType: '',
                    qaName: '',
                    qaId: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('questionAnswerManage', 'listQuestionAnswer', function (_param) {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listQuestionAnswers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswers: function (_page, _rows) {

                vc.component.questionAnswerManageInfo.conditions.page = _page;
                vc.component.questionAnswerManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.questionAnswerManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/questionAnswer/queryQuestionAnswer',
                    param,
                    function (json, res) {
                        var _questionAnswerManageInfo = JSON.parse(json);
                        vc.component.questionAnswerManageInfo.total = _questionAnswerManageInfo.total;
                        vc.component.questionAnswerManageInfo.records = _questionAnswerManageInfo.records;
                        vc.component.questionAnswerManageInfo.questionAnswers = _questionAnswerManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.questionAnswerManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddQuestionAnswerModal: function () {
                vc.emit('addQuestionAnswer', 'openAddQuestionAnswerModal', {});
            },
            _openEditQuestionAnswerModel: function (_questionAnswer) {
                vc.emit('editQuestionAnswer', 'openEditQuestionAnswerModal', _questionAnswer);
            },
            _openDeleteQuestionAnswerModel: function (_questionAnswer) {
                vc.emit('deleteQuestionAnswer', 'openDeleteQuestionAnswerModal', _questionAnswer);
            },
            _queryQuestionAnswerMethod: function () {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _toQuestionAnswerTitle:function(_questionAnswer){

            },
            _moreCondition: function () {
                if (vc.component.questionAnswerManageInfo.moreCondition) {
                    vc.component.questionAnswerManageInfo.moreCondition = false;
                } else {
                    vc.component.questionAnswerManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
