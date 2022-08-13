/**
 权限组
 **/
(function(vc) {
    vc.extends({
        data: {
            changeStaffPwdInfo: {
                oldPwd: '',
                newPwd: '',
                reNewPwd: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {},
        methods: {
            assetImportValidate: function() {
                return vc.validate.validate({
                    changeStaffPwdInfo: vc.component.changeStaffPwdInfo
                }, {

                    'changeStaffPwdInfo.oldPwd': [{
                        limit: "required",
                        param: "",
                        errInfo: "原始密码不能为空"
                    }],
                    'changeStaffPwdInfo.newPwd': [{
                        limit: "required",
                        param: "",
                        errInfo: "新密码不能为空"
                    }],
                    'changeStaffPwdInfo.reNewPwd': [{
                        limit: "required",
                        param: "",
                        errInfo: "确认密码不能为空"
                    }]
                });
            },
            _changePwd: function() {
                if (!vc.component.assetImportValidate()) {
                    return;
                }
                if (vc.component.changeStaffPwdInfo.newPwd != vc.component.changeStaffPwdInfo.reNewPwd) {
                    vc.toast('两次密码不一致');
                    return;
                }
                vc.http.apiPost(
                    '/user.changeStaffPwd',
                    JSON.stringify(vc.component.changeStaffPwdInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast("修改成功");
                            vc.component.changeStaffPwdInfo.oldPwd = '';
                            vc.component.changeStaffPwdInfo.newPwd = '';
                            vc.component.changeStaffPwdInfo.reNewPwd = '';
                            vc.clearTabToLocal();
                            vc.jumpToPage("/user.html#/pages/frame/login");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);