(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketSmsInfo: {
                smsId: '',
                smsName: '',
                smsType: '',
                remark: '',
                smsTypes:[],
                smsTypeValues:[]

            }
        },
        _initMethod: function () {
            vc.getDict('market_sms_key','sms_type',function(_data){
                $that.addMarketSmsInfo.smsTypes = _data;
            })
        },
        _initEvent: function () {
            vc.on('addMarketSms', 'openAddMarketSmsModal', function () {
                $('#addMarketSmsModel').modal('show');
            });
        },
        methods: {
            addMarketSmsValidate() {
                return vc.validate.validate({
                    addMarketSmsInfo: vc.component.addMarketSmsInfo
                }, {
                    'addMarketSmsInfo.smsName': [
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
                    'addMarketSmsInfo.smsType': [
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
                    'addMarketSmsInfo.remark': [
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
            saveMarketSmsInfo: function () {
                if (!vc.component.addMarketSmsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketSms.saveMarketSms',
                    JSON.stringify(vc.component.addMarketSmsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketSmsModel').modal('hide');
                            vc.component.clearAddMarketSmsInfo();
                            vc.emit('marketSmsManage', 'listMarketSms', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddMarketSmsInfo: function () {
                let _smsTypes = $that.addMarketSmsInfo.smsTypes;
                vc.component.addMarketSmsInfo = {
                    smsName: '',
                    smsType: '',
                    remark: '',
                    smsTypes:_smsTypes,
                    smsTypeValues:[]
                };
            },
            _addChangeSmsType:function(){
                if(!$that.addMarketSmsInfo.smsType){
                    return;
                }

                let _param = {
                    params:{
                        smsType:$that.addMarketSmsInfo.smsType,
                        page:1,
                        row:100
                    }
                    
                }
                 //发送get请求
                 vc.http.apiGet('/marketSms.listMarketSmsKey',
                 _param,
                 function (json, res) {
                     let _marketSmsManageInfo = JSON.parse(json);
                     $that.addMarketSmsInfo.smsTypeValues = _marketSmsManageInfo.data;
                 }, function (errInfo, error) {
                     console.log('请求失败处理');
                 }
             );
            }
        }
    });

})(window.vc);
