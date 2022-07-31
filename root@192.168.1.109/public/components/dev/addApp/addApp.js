(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAppInfo: {
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
            vc.on('addApp', 'openAddAppModal', function () {
                $('#addAppModel').modal('show');
            });
        },
        methods: {
            addAppValidate() {
                return vc.validate.validate({
                    addAppInfo: vc.component.addAppInfo
                }, {
                    'addAppInfo.name': [
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
                    'addAppInfo.securityCode': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "秘钥太长超过64位"
                        },
                    ],
                    'addAppInfo.whileListIp': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "白名单内容不能超过200"
                        },
                    ],
                    'addAppInfo.blackListIp': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "黑名单内容不能超过200"
                        },
                    ],
                    'addAppInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],


                });
            },
            saveAppInfo: function () {
                if (!vc.component.addAppValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //vc.component.addAppInfo.communityId = vc.getCurrentCommunity().communityId;

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAppInfo);
                    $('#addAppModel').modal('hide');
                    return;
                }

                vc.http.post(
                    'addApp',
                    'save',
                    JSON.stringify(vc.component.addAppInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addAppModel').modal('hide');
                            vc.component.clearAddAppInfo();
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
            clearAddAppInfo: function () {
                vc.component.addAppInfo = {
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
