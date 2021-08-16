(function (vc, vm) {

    vc.extends({
        data: {
            deleteOaWorkflowInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteOaWorkflow', 'openDeleteOaWorkflowModal', function (_params) {

                vc.component.deleteOaWorkflowInfo = _params;
                $('#deleteOaWorkflowModel').modal('show');

            });
        },
        methods: {
            deleteOaWorkflow: function () {
                vc.http.apiPost(
                    '/oaWorkflow/deleteOaWorkflow',
                    JSON.stringify(vc.component.deleteOaWorkflowInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOaWorkflowModel').modal('hide');
                            vc.emit('oaWorkflowManage', 'listOaWorkflow', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteOaWorkflowModel: function () {
                $('#deleteOaWorkflowModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
