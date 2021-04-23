(function (vc, vm) {

    vc.extends({
        data: {
            editServiceInfo: {
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
            vc.on('editService', 'openEditServiceModal', function (_params) {
                vc.component.refreshEditServiceInfo();
                vc.getDict('c_service',"url",function(_data){
                    vc.component.editServiceInfo.services = _data;
                });
                $('#editServiceModel').modal('show');
                vc.copyObject(_params, vc.component.editServiceInfo);

            });
        },
        methods: {
            editServiceValidate: function () {
                return vc.validate.validate({
                    editServiceInfo: vc.component.editServiceInfo
                }, {
                    'editServiceInfo.name': [
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
                    'editServiceInfo.serviceCode': [
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
                    'editServiceInfo.businessTypeCd': [
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
                    'editServiceInfo.seq': [
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
                    'editServiceInfo.messageQueueName': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "消息队列不能超过50"
                        },
                    ],
                    'editServiceInfo.isInstance': [
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
                    'editServiceInfo.url': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "调用地址不能超过200"
                        },
                    ],
                    'editServiceInfo.method': [
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
                    'editServiceInfo.timeout': [
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
                    'editServiceInfo.retryCount': [
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
                    'editServiceInfo.provideAppId': [
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
                    'editServiceInfo.serviceId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "服务ID不能为空"
                        }]

                });
            },
            editService: function () {
                if (!vc.component.editServiceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.post(
                    'editService',
                    'update',
                    JSON.stringify(vc.component.editServiceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editServiceModel').modal('hide');
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
            refreshEditServiceInfo: function () {
                vc.component.editServiceInfo = {
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
            }
        }
    });

})(window.vc, window.vc.component);
