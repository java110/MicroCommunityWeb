(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketBlacklistInfo: {
                blId: '',
                personName: '',
                filter: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMarketBlacklist', 'openAddMarketBlacklistModal', function () {
                $('#addMarketBlacklistModel').modal('show');
            });
        },
        methods: {
            addMarketBlacklistValidate() {
                return vc.validate.validate({
                    addMarketBlacklistInfo: vc.component.addMarketBlacklistInfo
                }, {
                    'addMarketBlacklistInfo.personName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "用户名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "用户名称不能超过64"
                        },
                    ],
                    'addMarketBlacklistInfo.filter': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "过滤条件不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "过滤条件不能超过64"
                        },
                    ],
                    'addMarketBlacklistInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],




                });
            },
            saveMarketBlacklistInfo: function () {
                if (!vc.component.addMarketBlacklistValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketBlacklist.saveMarketBlacklist',
                    JSON.stringify(vc.component.addMarketBlacklistInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketBlacklistModel').modal('hide');
                            vc.component.clearAddMarketBlacklistInfo();
                            vc.emit('marketBlacklistManage', 'listMarketBlacklist', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddMarketBlacklistInfo: function () {
                vc.component.addMarketBlacklistInfo = {
                    personName: '',
                    filter: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
