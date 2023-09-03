(function (vc, vm) {

    vc.extends({
        data: {
            editMarketTextInfo: {
                textId: '',
                name: '',
                sendRate: '',
                textContent: '',
                marketSmss:[],
                smsId:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editMarketText', 'openEditMarketTextModal', function (_params) {
                vc.component.refreshEditMarketTextInfo();
                $('#editMarketTextModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketTextInfo);
                $that._listEditMarketSms();
            });
        },
        methods: {
            editMarketTextValidate: function () {
                return vc.validate.validate({
                    editMarketTextInfo: vc.component.editMarketTextInfo
                }, {
                    'editMarketTextInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'editMarketTextInfo.sendRate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "发送频率不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "发送频率不能超过30"
                        },
                    ],
                    'editMarketTextInfo.textContent': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注'不能超过512"
                        },
                    ],
                    'editMarketTextInfo.textId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketText: function () {
                if (!vc.component.editMarketTextValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketText.updateMarketText',
                    JSON.stringify(vc.component.editMarketTextInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketTextModel').modal('hide');
                            vc.emit('marketTextManage', 'listMarketText', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditMarketTextInfo: function () {
                vc.component.editMarketTextInfo = {
                    textId: '',
                    name: '',
                    sendRate: '',
                    textContent: '',
                    marketSmss:[],
                    smsId:''

                }
            },
            _listEditMarketSms: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/marketSms.listMarketSms',
                    param,
                    function (json, res) {
                        let _marketSms = JSON.parse(json);
                        $that.editMarketTextInfo.marketSmss = _marketSms.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
