/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            ownerVotingInfo: {
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
            $that._listOwnerVotings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('ownerVoting', 'listOwnerVoting', function (_param) {
                $that._listOwnerVotings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerVotings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerVotings: function (_page, _rows) {
                $that.ownerVotingInfo.conditions.page = _page;
                $that.ownerVotingInfo.conditions.row = _rows;
                let param = {
                    params: $that.ownerVotingInfo.conditions
                };
                param.params.qaId = param.params.qaId.trim();
                param.params.qaName = param.params.qaName.trim();
                //发送get请求
                vc.http.apiGet('/question.listOwnerVote',
                    param,
                    function (json, res) {
                        var _ownerVotingInfo = JSON.parse(json);
                        $that.ownerVotingInfo.questionAnswers = _ownerVotingInfo.data;
                        $that.ownerVotingInfo.total = _ownerVotingInfo.total;
                        $that.ownerVotingInfo.records = _ownerVotingInfo.records;
                        vc.emit('pagination', 'init', {
                            total: $that.ownerVotingInfo.records,
                            dataCount: $that.ownerVotingInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOwnerVotingModal: function () {
                vc.jumpToPage('/#/pages/question/addOwnerVoting')
            },
            _openEditOwnerVotingModel: function (_questionAnswer) {
                vc.jumpToPage('/#/pages/question/editOwnerVoting?qaId=' + _questionAnswer.qaId)
            },
            _openDeleteOwnerVotingModel: function (_questionAnswer) {
                vc.emit('deleteQuestionAnswer', 'openDeleteQuestionAnswerModal', _questionAnswer);
            },
            _openPublishOwnerVotingModel: function (_questionAnswer) {
                vc.emit('publishQuestionAnswer', 'openPublishQuestionAnswerModal', _questionAnswer);
            },
            _ownerVotingDetail: function (_questionAnswer) {
                window.open('/print.html#/pages/question/printOwnerVoting?qaId=' + _questionAnswer.qaId)
            },
            //查询
            _queryOwnerVotingMethod: function () {
                $that._listOwnerVotings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOwnerVotingMethod: function () {
                $that.ownerVotingInfo.conditions.qaId = "";
                $that.ownerVotingInfo.conditions.qaName = "";
                $that.ownerVotingInfo.conditions.qaType = "";
                $that._listOwnerVotings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toOwnerVotingTitle: function (_questionAnswer) {
                vc.jumpToPage('/#/pages/property/questionAnswerTitleManage?qaId=' + _questionAnswer.qaId + "&objType="
                    + _questionAnswer.objType + "&objId=" + _questionAnswer.objId)
            },
            _moreCondition: function () {
                if ($that.ownerVotingInfo.moreCondition) {
                    $that.ownerVotingInfo.moreCondition = false;
                } else {
                    $that.ownerVotingInfo.moreCondition = true;
                }
            },
            showImg: function (e) {
                vc.emit('viewImage', 'showImage', {url: e});
            }
        }
    });
})(window.vc);