/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
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
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('questionAnswerManage', 'listQuestionAnswer', function (_param) {
                $that._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listQuestionAnswers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswers: function (_page, _rows) {
                $that.questionAnswerManageInfo.conditions.page = _page;
                $that.questionAnswerManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.questionAnswerManageInfo.conditions
                };
                param.params.qaId = param.params.qaId.trim();
                param.params.qaName = param.params.qaName.trim();
                //发送get请求
                vc.http.apiGet('/question.listQuestionAnswer',
                    param,
                    function (json, res) {
                        var _questionAnswerManageInfo = JSON.parse(json);
                        $that.questionAnswerManageInfo.total = _questionAnswerManageInfo.total;
                        $that.questionAnswerManageInfo.records = _questionAnswerManageInfo.records;
                        $that.questionAnswerManageInfo.questionAnswers = _questionAnswerManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.questionAnswerManageInfo.records,
                            dataCount: $that.questionAnswerManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddQuestionAnswerModal: function () {
                vc.jumpToPage('/#/pages/question/addQuestionAnswer');
            },
            _openEditQuestionAnswerModel: function (_questionAnswer) {
                vc.jumpToPage('/#/pages/question/editQuestionAnswer?qaId=' + _questionAnswer.qaId);
            },
            _openDeleteQuestionAnswerModel: function (_questionAnswer) {
                vc.emit('deleteQuestionAnswer', 'openDeleteQuestionAnswerModal', _questionAnswer);
            },
            //查询
            _queryQuestionAnswerMethod: function () {
                $that._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetQuestionAnswerMethod: function () {
                $that.questionAnswerManageInfo.conditions.qaId = "";
                $that.questionAnswerManageInfo.conditions.qaName = "";
                $that.questionAnswerManageInfo.conditions.qaType = "";
                $that._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toQuestionAnswerTitle: function (_questionAnswer) {
                vc.jumpToPage('/#/pages/property/questionAnswerTitleManage?qaId=' + _questionAnswer.qaId +
                    "&objType=" + _questionAnswer.objType + "&objId=" + _questionAnswer.objId)
            },
            _moreCondition: function () {
                if ($that.questionAnswerManageInfo.moreCondition) {
                    $that.questionAnswerManageInfo.moreCondition = false;
                } else {
                    $that.questionAnswerManageInfo.moreCondition = true;
                }
            },
            showImg: function (e) {
                vc.emit('viewImage', 'showImage', {url: e});
            },
            _openPublishOwnerVotingModel: function (_questionAnswer) {
                vc.emit('publishQuestionAnswer', 'openPublishQuestionAnswerModal', _questionAnswer);
            },
            _ownerVotingDetail: function (_questionAnswer) {
                window.open('/print.html#/pages/question/printQuestionAnswer?qaId=' + _questionAnswer.qaId)
            },
            _printQuestionAnswerDetail: function (_questionAnswer) {
                window.open('/print.html#/pages/question/printQuestionAnswerDetail?qaId=' + _questionAnswer.qaId)
            }
        }
    });
})(window.vc);