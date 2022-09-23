(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addContractPartyaInfo: {
                partyaId: '',
                partyA: '',
                aContacts: '',
                aLink: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addContractPartya', 'openAddContractPartyaModal', function () {
                $('#addContractPartyaModel').modal('show');
            });
        },
        methods: {
            addContractPartyaValidate() {
                return vc.validate.validate({
                    addContractPartyaInfo: vc.component.addContractPartyaInfo
                }, {
                    'addContractPartyaInfo.partyA': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "甲方太长"
                        },
                    ],
                    'addContractPartyaInfo.aContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "甲方联系人不能超过64"
                        },
                    ],
                    'addContractPartyaInfo.aLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系电话格式错误"
                        },
                    ]
                });
            },
            saveContractPartyaInfo: function () {
                if (!vc.component.addContractPartyaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addContractPartyaInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addContractPartyaInfo);
                    $('#addContractPartyaModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/contractPartya/saveContractPartya',
                    JSON.stringify(vc.component.addContractPartyaInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addContractPartyaModel').modal('hide');
                            vc.component.clearAddContractPartyaInfo();
                            vc.emit('contractPartyaManage', 'listContractPartya', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddContractPartyaInfo: function () {
                vc.component.addContractPartyaInfo = {
                    partyA: '',
                    aContacts: '',
                    aLink: ''
                };
            }
        }
    });
})(window.vc);
