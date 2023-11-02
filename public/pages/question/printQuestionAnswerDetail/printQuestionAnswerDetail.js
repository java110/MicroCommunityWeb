/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            printQuestionAnswerDetailInfo: {
                qaName: '',
                startTime: '',
                endTime: '',
                communityId: vc.getCurrentCommunity().communityId,
                content: '',
                titleType: '',
                questionTitles: [],
                updateRoomIds: false,
                voteCount: 0,
                qaId: '',
                votedCount: 0,
                userQuestions: [],
                roomId: '',
                userQuestion: {}
            }
        },
        _initMethod: function () {
            $that.printQuestionAnswerDetailInfo.qaId = vc.getParam('qaId');
            $that._listValues();
        },
        _initEvent: function () {
            vc.on('ownerVoting', 'listQuestionAnswer', function (_param) {
                $that._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswers: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.printQuestionAnswerDetailInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionAnswer',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        vc.copyObject(_info.data[0], $that.printQuestionAnswerDetailInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadQuestionTitles: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.printQuestionAnswerDetailInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionTitle',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        $that.printQuestionAnswerDetailInfo.questionTitles = _info.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printPurchaseApplyDiv: function () {
                $that.printFlag = '1';
                document.getElementById("print-btn").style.display = "none"; //隐藏
                document.getElementById("print-room").style.display = "none"; //隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
                // document.getElementById("print-btn").style.display = "display"; //隐藏
                // document.getElementById("print-room").style.display = "display"; //隐藏
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            },
            _getTitleTypeName: function (_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            swatchRoom: function (_room) {
                $that.printQuestionAnswerDetailInfo.roomId = _room.roomId;
                $that.printQuestionAnswerDetailInfo.userQuestion = _room;
            },
            _listValues: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.printQuestionAnswerDetailInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listUserQuestionAnswer',
                    param,
                    function (json, res) {
                        let _ownerVotingInfo = JSON.parse(json);
                        $that.printQuestionAnswerDetailInfo.userQuestions = _ownerVotingInfo.data;
                        $that._listQuestionAnswers();
                        $that._loadQuestionTitles();
                        if (_ownerVotingInfo.data && _ownerVotingInfo.data.length > 0) {
                            $that.swatchRoom(_ownerVotingInfo.data[0]);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getChooseValue: function (_title) {
                let _userQuestion = $that.printQuestionAnswerDetailInfo.userQuestion;
                let _chooseValue = 'X';
                if (_userQuestion.hasOwnProperty('values')) {
                    _userQuestion.values.forEach(tmpValue => {
                        if (tmpValue.qaValue == _title.qaValue) {
                            _chooseValue = 'V';
                        }
                    })
                }
                return _chooseValue;
            }
        }
    });
})(window.vc);