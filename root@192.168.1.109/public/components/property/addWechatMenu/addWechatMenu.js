(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addWechatMenuInfo: {
                wechatMenuId: '',
                menuName: '',
                menuType: 'top',
                menuLevel: '',
                menuValue: '',
                appId: '',
                pagepath: '',
                seq:'',
                parentMenuId:''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addWechatMenu', 'openAddWechatMenuModal', function (_param) {
                $that.addWechatMenuInfo.menuLevel = _param.menuLevel;
                $that.addWechatMenuInfo.parentMenuId = _param.parentMenuId;
                if(  _param.menuLevel == '202'){
                    $that.addWechatMenuInfo.menuType = 'view';
                }
                $('#addWechatMenuModel').modal('show');
            });
        },
        methods: {
            addWechatMenuValidate() {
                return vc.validate.validate({
                    addWechatMenuInfo: vc.component.addWechatMenuInfo
                }, {
                    'addWechatMenuInfo.menuName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "菜单名称不能为空"
                        },
                        {
                            limit: "maxIn",
                            param: "1,7",
                            errInfo: "菜单名称不能超过7位"
                        },
                    ],
                    'addWechatMenuInfo.menuType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "菜单类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "菜单类型格式错误"
                        },
                    ],
                    'addWechatMenuInfo.menuLevel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "菜单级别不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "菜单级别格式错误"
                        },
                    ],
                    'addWechatMenuInfo.menuValue': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值不能超过200位"
                        }
                    ],
                    'addWechatMenuInfo.appId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "AppId不能超过64位"
                        },
                    ],
                    'addWechatMenuInfo.pagepath': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "小程序地址不能超过200位"
                        },
                    ],




                });
            },
            saveWechatMenuInfo: function () {
                if (!vc.component.addWechatMenuValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addWechatMenuInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addWechatMenuInfo);
                    $('#addWechatMenuModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'smallWeChat.saveWechatMenu',
                    JSON.stringify(vc.component.addWechatMenuInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addWechatMenuModel').modal('hide');
                            vc.component.clearAddWechatMenuInfo();
                            vc.emit('wechatMenuManage', 'listWechatMenu', {});

                            return;
                        }
                        vc.message(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddWechatMenuInfo: function () {
                vc.component.addWechatMenuInfo = {
                    menuName: '',
                    menuType: '',
                    menuLevel: '',
                    menuValue: '',
                    appId: '',
                    pagepath: '',
                    seq:''
                };
            }
        }
    });

})(window.vc);
