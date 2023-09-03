(function(vc) {
    vc.extends({
        data: {
            publishQuestionAnswerInfo: {
                qaId: '',
                qaName: '',
                notifyWay: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('publishQuestionAnswer', 'openPublishQuestionAnswerModal', function(_param) {
                vc.copyObject(_param, $that.publishQuestionAnswerInfo);
                $('#publishQuestionAnswerModel').modal('show');
            });
        },
        methods: {
            publishQuestionAnswerValidate() {
                return vc.validate.validate({
                    publishQuestionAnswerInfo: $that.publishQuestionAnswerInfo
                }, {
                    'publishQuestionAnswerInfo.qaId': [{
                        limit: "required",
                        param: "",
                        errInfo: "投票不能为空"
                    }],
                    'publishQuestionAnswerInfo.notifyWay': [{
                        limit: "required",
                        param: "",
                        errInfo: "通知方式不能为空"
                    }, ]
                });
            },
            publishQuestionAnswer: function() {
                if (!$that.publishQuestionAnswerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.publishQuestionAnswerInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/question.publishQuestion',
                    JSON.stringify($that.publishQuestionAnswerInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#publishQuestionAnswerModel').modal('hide');

                            $that.clearPublishQuestionAnswerInfo();
                            vc.emit('ownerVoting', 'listOwnerVoting', {});
                            vc.emit('questionAnswerManage', 'listQuestionAnswer', {})
                            vc.toast("发布成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearPublishQuestionAnswerInfo: function() {
                $that.publishQuestionAnswerInfo = {
                    qaId: '',
                    qaName: '',
                    notifyWay: '',
                };
            },

        }
    });
})(window.vc);