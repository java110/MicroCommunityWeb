(function (vc) {
    vc.extends({
        data: {
            cancelAccountDetailInfo: {
                detailId: '',
                acctName: '',
                amount: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('cancelAccountDetail', 'openAddModal', function (_param) {
                $('#cancelAccountDetailModel').modal('show');
                vc.copyObject(_param, $that.cancelAccountDetailInfo);
                that.cancelAccountDetailInfo.remark = '';
            });
        },
        methods: {
            cancelAccountDetailValidate() {
                return vc.validate.validate({
                    cancelAccountDetailInfo: vc.component.cancelAccountDetailInfo
                }, {
                    'cancelAccountDetailInfo.detailId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "明细不存在"
                        }
                    ],
                    'cancelAccountDetailInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "撤销原因不能空"
                        }
                    ]
                });
            },
            _cancelAccountDetailInfo: function () {
                if (!vc.component.cancelAccountDetailValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.cancelAccountDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/account.cancelAccountDetail',
                    JSON.stringify(vc.component.cancelAccountDetailInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#cancelAccountDetailModel').modal('hide');
                            vc.component.clearPrestoreAccountInfo();
                            vc.emit('accountDetailManage', 'listAccountDetail', {});
                            vc.toast('撤销成功');
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.cancelAccountDetailInfo.errorInfo = errInfo;
                    });
            },
            clearPrestoreAccountInfo: function () {
                vc.component.cancelAccountDetailInfo = {
                    detailId: '',
                    acctName: '',
                    amount: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);