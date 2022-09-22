(function (vc, vm) {
    vc.extends({
        data: {
            editContractPartyaInfo: {
                partyaId: '',
                partyA: '',
                aContacts: '',
                aLink: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editContractPartya', 'openEditContractPartyaModal', function (_params) {
                vc.component.refreshEditContractPartyaInfo();
                $('#editContractPartyaModel').modal('show');
                vc.copyObject(_params, vc.component.editContractPartyaInfo);
                vc.component.editContractPartyaInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editContractPartyaValidate: function () {
                return vc.validate.validate({
                    editContractPartyaInfo: vc.component.editContractPartyaInfo
                }, {
                    'editContractPartyaInfo.partyA': [
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
                    'editContractPartyaInfo.aContacts': [
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
                    'editContractPartyaInfo.aLink': [
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
                    ],
                    'editContractPartyaInfo.partyaId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方编号不能为空"
                        }
                    ]
                });
            },
            editContractPartya: function () {
                if (!vc.component.editContractPartyaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/contractPartya/updateContractPartya',
                    JSON.stringify(vc.component.editContractPartyaInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editContractPartyaModel').modal('hide');
                            vc.emit('contractPartyaManage', 'listContractPartya', {});
                            vc.toast("修改成功");
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
            refreshEditContractPartyaInfo: function () {
                vc.component.editContractPartyaInfo = {
                    partyaId: '',
                    partyA: '',
                    aContacts: '',
                    aLink: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
