(function (vc, vm) {
    vc.extends({
        data: {
            deleteQuestionAnswerTitleInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteQuestionAnswerTitle', 'openDeleteQuestionAnswerTitleModal', function (_params) {
                vc.component.deleteQuestionAnswerTitleInfo = _params;
                $('#deleteQuestionAnswerTitleModel').modal('show');
            });
        },
        methods: {
            deleteQuestionAnswerTitle: function () {
                vc.component.deleteQuestionAnswerTitleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/questionAnswer/deleteQuestionAnswerTitle',
                    JSON.stringify(vc.component.deleteQuestionAnswerTitleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteQuestionAnswerTitleModel').modal('hide');
                            vc.emit('questionAnswerTitleManage', 'listQuestionAnswerTitle', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteQuestionAnswerTitleModel: function () {
                $('#deleteQuestionAnswerTitleModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
