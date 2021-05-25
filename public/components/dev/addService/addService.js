(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addServiceInfo: {
                serviceId: '',
                name: '',
                serviceCode: '',
                businessTypeCd: 'API',
                seq: '1',
                messageQueueName: '',
                isInstance: 'T',
                url: 'http://community-service',
                method: '',
                timeout: '60',
                retryCount: '3',
                provideAppId: '8000418002',
                services:[]

            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
            vc.on('addService', 'openAddServiceModal', function () {
                vc.getDict('c_service',"url",function(_data){
                    vc.component.addServiceInfo.services = _data;
                });
                $('#addServiceModel').modal('show');
            });
        },
        methods: {
            addServiceValidate() {
                return vc.validate.validate({
                    addServiceInfo: vc.component.addServiceInfo
                }, {
                    'addServiceInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "服务名称不能超过50"
                        },
                    ],
                    'addServiceInfo.serviceCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务编码不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "服务编码必须在2至50字符之间"
                        },
                    ],
                    'addServiceInfo.businessTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "秘钥不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,4",
                            errInfo: "业务类型必须为API"
                        },
                    ],
                    'addServiceInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "序列不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1",
                            errInfo: "序列格式错误"
                        },
                    ],
                    'addServiceInfo.messageQueueName': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "消息队列不能超过50"
                        },
                    ],
                    'addServiceInfo.isInstance': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否实例不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "实例不能超过50"
                        },
                    ],
                    'addServiceInfo.url': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "调用地址不能超过200"
                        },
                    ],
                    'addServiceInfo.method': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "调用方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "调用方式不能超过50"
                        },
                    ],
                    'addServiceInfo.timeout': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "超时时间不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "超时时间必须为数字"
                        },
                    ],
                    'addServiceInfo.retryCount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "重试次数不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "重试次数必须为数字"
                        },
                    ],
                    'addServiceInfo.provideAppId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "提供服务不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "重试次数必须为数字"
                        },
                    ],




                });
            },
            saveServiceInfo: function () {
                if (!vc.component.addServiceValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //vc.component.addServiceInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addServiceInfo);
                    $('#addServiceModel').modal('hide');
                    return;
                }
                vc.http.post(
                    'addService',
                    'save',
                    JSON.stringify(vc.component.addServiceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addServiceModel').modal('hide');
                            vc.component.clearAddServiceInfo();
                            vc.emit('serviceManage', 'listService', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddServiceInfo: function () {
                vc.component.addServiceInfo = {
                    name: '',
                    serviceCode: '',
                    businessTypeCd: 'API',
                    seq: '1',
                    messageQueueName: '',
                    isInstance: 'T',
                    url: 'http://community-service',
                    method: '',
                    timeout: '60',
                    retryCount: '3',
                    provideAppId: '8000418002',
                    services:[]

                };
            }
        }
    });

})(window.vc);
