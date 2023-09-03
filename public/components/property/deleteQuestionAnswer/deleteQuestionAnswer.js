(function(vc, vm) {
    vc.extends({
        data: {
            deleteQuestionAnswerInfo: {}
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('deleteQuestionAnswer', 'openDeleteQuestionAnswerModal', function(_params) {
                vc.component.deleteQuestionAnswerInfo = _params;
                $('#deleteQuestionAnswerModel').modal('show');
            });
        },
        methods: {
            deleteQuestionAnswer: function() {
                vc.component.deleteQuestionAnswerInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/question.deleteQuestionAnswer',
                    JSON.stringify(vc.component.deleteQuestionAnswerInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteQuestionAnswerModel').modal('hide');
                            vc.emit('questionAnswerManage', 'listQuestionAnswer', {});
                            vc.emit('ownerVoting', 'listOwnerVoting', {});

                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeDeleteQuestionAnswerModel: function() {
                $('#deleteQuestionAnswerModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);