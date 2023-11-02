/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            printQuestionAnswerInfo: {
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
                votedCount: 0
            }
        },
        _initMethod: function () {
            $that.printQuestionAnswerInfo.qaId = vc.getParam('qaId');
            $that._listQuestionAnswers();
            $that._loadQuestionTitles();
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
                        qaId: $that.printQuestionAnswerInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionAnswer',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        vc.copyObject(_info.data[0], $that.printQuestionAnswerInfo);
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
                        qaId: $that.printQuestionAnswerInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionTitle',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        $that.printQuestionAnswerInfo.questionTitles = _info.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printPurchaseApplyDiv: function () {
                $that.printFlag = '1';
                document.getElementById("print-btn").style.display = "none"; //隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
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
        }
    });
})(window.vc);