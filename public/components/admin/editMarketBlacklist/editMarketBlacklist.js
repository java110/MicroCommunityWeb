(function (vc, vm) {

    vc.extends({
        data: {
            editMarketBlacklistInfo: {
                blId: '',
                personName: '',
                filter: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editMarketBlacklist', 'openEditMarketBlacklistModal', function (_params) {
                vc.component.refreshEditMarketBlacklistInfo();
                $('#editMarketBlacklistModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketBlacklistInfo);
            });
        },
        methods: {
            editMarketBlacklistValidate: function () {
                return vc.validate.validate({
                    editMarketBlacklistInfo: vc.component.editMarketBlacklistInfo
                }, {
                    'editMarketBlacklistInfo.personName': [
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
                    'editMarketBlacklistInfo.filter': [
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
                    'editMarketBlacklistInfo.remark': [
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
                    'editMarketBlacklistInfo.blId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketBlacklist: function () {
                if (!vc.component.editMarketBlacklistValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketBlacklist.updateMarketBlacklist',
                    JSON.stringify(vc.component.editMarketBlacklistInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketBlacklistModel').modal('hide');
                            vc.emit('marketBlacklistManage', 'listMarketBlacklist', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditMarketBlacklistInfo: function () {
                vc.component.editMarketBlacklistInfo = {
                    blId: '',
                    personName: '',
                    filter: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
