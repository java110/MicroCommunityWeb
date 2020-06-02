(function (vc) {

    vc.extends({
        data: {
            addJobInfo: {
                appId: '',
                name: '',
                securityCode: '',
                whileListIp: '',
                blackListIp: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addJob', 'openAddJobModal', function () {
                $('#addJobModel').modal('show');
            });
        },
        methods: {
            addJobValidate() {
                return vc.validate.validate({
                    addJobInfo: vc.component.addJobInfo
                }, {
                    'addJobInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "应用名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "应用名称必须在2至50字符之间"
                        },
                    ],
                    'addJobInfo.securityCode': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "秘钥太长超过64位"
                        },
                    ],
                    'addJobInfo.whileListIp': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "白名单内容不能超过200"
                        },
                    ],
                    'addJobInfo.blackListIp': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "黑名单内容不能超过200"
                        },
                    ],
                    'addJobInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],


                });
            },
            saveAppInfo: function () {
                if (!vc.component.addJobValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //vc.component.addJobInfo.communityId = vc.getCurrentCommunity().communityId;

            
                vc.http.post(
                    'addJob',
                    'save',
                    JSON.stringify(vc.component.addJobInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addJobModel').modal('hide');
                            vc.component.clearAddJobInfo();
                            vc.emit('appManage', 'listApp', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddJobInfo: function () {
                vc.component.addJobInfo = {
                    name: '',
                    securityCode: '',
                    whileListIp: '',
                    blackListIp: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
