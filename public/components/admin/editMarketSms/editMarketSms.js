(function (vc, vm) {

    vc.extends({
        data: {
            editMarketSmsInfo: {
                smsId: '',
                smsName: '',
                smsType: '',
                smsTypes: [],
                remark: '',
                smsTypeValues:[]

            }
        },
        _initMethod: function () {

            vc.getDict('market_sms_key','sms_type',function(_data){
                $that.editMarketSmsInfo.smsTypes = _data;
            })

        },
        _initEvent: function () {
            vc.on('editMarketSms', 'openEditMarketSmsModal', function (_params) {
                vc.component.refreshEditMarketSmsInfo();
                $('#editMarketSmsModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketSmsInfo);
                $that.editMarketSmsInfo.smsTypeValues = _params.values;
            });
        },
        methods: {
            editMarketSmsValidate: function () {
                return vc.validate.validate({
                    editMarketSmsInfo: vc.component.editMarketSmsInfo
                }, {
                    'editMarketSmsInfo.smsName': [
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
                    'editMarketSmsInfo.smsType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设置类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设置类型不能超过30"
                        },
                    ],
                    'editMarketSmsInfo.remark': [
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
                    'editMarketSmsInfo.smsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketSms: function () {
                if (!vc.component.editMarketSmsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'marketSms.updateMarketSms',
                    JSON.stringify(vc.component.editMarketSmsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketSmsModel').modal('hide');
                            vc.emit('marketSmsManage', 'listMarketSms', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditMarketSmsInfo: function () {
                let _smsTypes = $that.editMarketSmsInfo.smsTypes;
                vc.component.editMarketSmsInfo = {
                    smsId: '',
                    smsName: '',
                    smsType: '',
                    smsTypes: _smsTypes,
                    remark: '',
                    smsTypeValues:[]
                }
            },
            _editChangeSmsType:function(){
                if(!$that.editMarketSmsInfo.smsType){
                    return;
                }

                let _param = {
                    params:{
                        smsType:$that.editMarketSmsInfo.smsType,
                        page:1,
                        row:100
                    }
                    
                }
                 //发送get请求
                 vc.http.apiGet('/marketSms.listMarketSmsKey',
                 _param,
                 function (json, res) {
                     let _marketSmsManageInfo = JSON.parse(json);
                     $that.editMarketSmsInfo.smsTypeValues = _marketSmsManageInfo.data;
                 }, function (errInfo, error) {
                     console.log('请求失败处理');
                 }
             );
            }
        }
    });

})(window.vc, window.vc.component);
