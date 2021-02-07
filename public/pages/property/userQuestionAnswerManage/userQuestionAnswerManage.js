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
                qaId: '',
                objType: '',
                objId: '',
                answerType: '1002',
                userQaId:'-1'
            }
        },
        _initMethod: function () {
            let _that = $that.userQuestionAnswerManageInfo;
            let _qaId = vc.getParam('qaId');
            _that.qaId = _qaId;
            _that.objType = vc.getParam('objType');
            _that.objId = vc.getParam('objId');
            _that.answerType = vc.getParam('answerType');
            _that.userQaId = vc.getParam('userQaId');
            vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
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
                        qaId: _that.qaId,
                        objType: _that.objType,
                        objId: _that.objId
                    }
                };

                //发送get请求
                vc.http.apiGet('/questionAnswer/queryQuestionAnswerTitle',
                    param,
                    function (json, res) {
                        let _userQuestionAnswerManageInfo = JSON.parse(json);
                        _that.questionAnswerTitles = _userQuestionAnswerManageInfo.data;
                        _that.questionAnswerTitles.forEach(item => {

                            if (item.titleType == '3003') {
                                item.valueContent = '';
                            } else {
                                item.valueContent = [];
                            }

                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toQuestionAnswerTitle: function (_questionAnswer) {
                vc.jumpToPage('/admin.html#/pages/property/questionAnswerTitleManage?qaId=' + _questionAnswer.qaId + "&objType=" + _questionAnswer.objType + "&objId=" + _questionAnswer.objId)
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
                    '/userQuestionAnswer/saveUserQuestionAnswerValue',
                    JSON.stringify(vc.component.userQuestionAnswerManageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let data = JSON.parse(json);
                        if (data.code != 0) {
                            vc.toast(data.msg);
                            return;
                        }
                        $that._goBack();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }


        }
    });
})(window.vc);
