(function (vc, vm) {

    vc.extends({
        data: {
            deleteWechatSmsTemplateInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteWechatSmsTemplate', 'openDeleteWechatSmsTemplateModal', function (_params) {

                vc.component.deleteWechatSmsTemplateInfo = _params;
                $('#deleteWechatSmsTemplateModel').modal('show');

            });
        },
        methods: {
            deleteWechatSmsTemplate: function () {
                vc.component.deleteWechatSmsTemplateInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/wechat/deleteWechatTemplate',
                    JSON.stringify(vc.component.deleteWechatSmsTemplateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteWechatSmsTemplateModel').modal('hide');
                            vc.emit('wechatSmsTemplateManage', 'listWechatSmsTemplate', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteWechatSmsTemplateModel: function () {
                $('#deleteWechatSmsTemplateModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
