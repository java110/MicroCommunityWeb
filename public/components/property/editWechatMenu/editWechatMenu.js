(function (vc, vm) {

    vc.extends({
        data: {
            editWechatMenuInfo: {
                wechatMenuId: '',
                menuName: '',
                menuType: '',
                menuLevel: '',
                menuValue: '',
                appId: '',
                pagepath: '',
                parentMenuId:'',
                seq:''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editWechatMenu', 'openEditWechatMenuModal', function (_params) {
                vc.component.refreshEditWechatMenuInfo();
                $('#editWechatMenuModel').modal('show');
                vc.copyObject(_params, vc.component.editWechatMenuInfo);
                vc.component.editWechatMenuInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editWechatMenuValidate: function () {
                return vc.validate.validate({
                    editWechatMenuInfo: vc.component.editWechatMenuInfo
                }, {
                    'editWechatMenuInfo.menuName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "菜单名称不能为空"
                        },
                        {
                            limit: "max",
                            param: "1,7",
                            errInfo: "菜单名称不能超过7位"
                        },
                    ],
                    'editWechatMenuInfo.menuType': [
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
                    'editWechatMenuInfo.menuLevel': [
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
                    'editWechatMenuInfo.menuValue': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值不能超过200位"
                        },
                    ],
                    'editWechatMenuInfo.appId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "AppId不能超过64位"
                        },
                    ],
                    'editWechatMenuInfo.pagepath': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "小程序地址不能超过200位"
                        },
                    ],
                    'editWechatMenuInfo.wechatMenuId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "菜单ID不能为空"
                        }]

                });
            },
            editWechatMenu: function () {
                if (!vc.component.editWechatMenuValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'smallWeChat.updateWechatMenu',
                    JSON.stringify(vc.component.editWechatMenuInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editWechatMenuModel').modal('hide');
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
            refreshEditWechatMenuInfo: function () {
                vc.component.editWechatMenuInfo = {
                    wechatMenuId: '',
                    menuName: '',
                    menuType: '',
                    menuLevel: '',
                    menuValue: '',
                    appId: '',
                    pagepath: '',
                    parentMenuId:'',
                    seq:''
    
                }
            }
        }
    });

})(window.vc, window.vc.component);
