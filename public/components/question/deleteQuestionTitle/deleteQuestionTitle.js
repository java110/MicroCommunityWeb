(function(vc, vm) {
    vc.extends({
        data: {
            deleteQuestionTitleInfo: {}
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('deleteQuestionTitle', 'openDeleteQuestionTitleModal', function(_params) {
                vc.component.deleteQuestionTitleInfo = _params;
                $('#deleteQuestionTitleModel').modal('show');
            });
        },
        methods: {
            deleteQuestionTitle: function() {
                vc.component.deleteQuestionTitleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/question.deleteQuestionTitle',
                    JSON.stringify(vc.component.deleteQuestionTitleInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteQuestionTitleModel').modal('hide');
                            vc.emit('questionTitle', 'listQuestionTitle', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteQuestionTitleModel: function() {
                $('#deleteQuestionTitleModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);