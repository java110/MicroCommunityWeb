(function (vc) {
    vc.extends({
        data: {
            adminLoginPropertyInfo: {
                username: '',
                userId: '',
                curPasswd: '',
                curUserName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('adminLoginProperty', 'login', function (_param) {
                vc.copyObject(_param, $that.adminLoginPropertyInfo);
                $('#adminLoginPropertyModel').modal('show');
            });
        },
        methods: {
            adminLoginPropertyValidate() {
                return vc.validate.validate({
                    adminLoginPropertyInfo: vc.component.adminLoginPropertyInfo
                }, {
                    'adminLoginPropertyInfo.curPasswd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "当前用户密码不能为空"
                        }
                    ]
                });
            },
            _adminLoginPropertySubmit: function () {
                if (!vc.component.adminLoginPropertyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/adminLoginPropertyAccount',
                    JSON.stringify($that.adminLoginPropertyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        $that.clearAddBasePrivilegeInfo();
                        $('#adminLoginPropertyModel').modal('hide');
                        let _data = JSON.parse(json);
                        if (_data.hasOwnProperty('code') && _data.code != '0') {
                            vc.toast(_data.msg);
                            return;
                        }
                        if (res.status == 200) {
                            vc.component.clearCacheData();
                            vc.component._loadSysInfo();
                            vc.emit('initData', 'loadCommunityInfo', {
                                url: '/'
                            });
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            clearAddBasePrivilegeInfo: function () {
                vc.component.adminLoginPropertyInfo = {
                    username: '',
                    userId: '',
                    curPasswd: '',
                    curUserName: ''
                }
            },
            clearCacheData: function () {
                vc.clearCacheData();
            },
            _loadSysInfo: function () {
                var param = {
                    params: {
                        sys: 'HC'
                    }
                }
                vc.http.get(
                    'login',
                    'getSysInfo',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status != 200) {
                            console.log("加载系统信息失败");
                            vc.saveData("_sysInfo", {logo: 'HC'});
                            vc.copyObject(json, vc.component.loginInfo);
                            return;
                        }
                        vc.copyObject(JSON.parse(json), vc.component.loginInfo);
                        //保存到浏览器
                        vc.saveData("_sysInfo", JSON.parse(json));
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.saveData("_sysInfo", {logo: 'HC'});
                        vc.copyObject(json, vc.component.loginInfo);
                        vc.component.loginInfo.errorInfo = errInfo;
                    });
            },
        }
    });
})(window.vc);
