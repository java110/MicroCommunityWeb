(function (vc, vm) {
    vc.extends({
        data: {
            mergeFeeInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('mergeFee', 'openMergeFeeModal', function (_params) {
                $that.mergeFeeInfo = _params;
                $('#mergeFeeModel').modal('show');
            });
        },
        methods: {
            _doMergeFee: function () {
                let _data = {
                    feeId:$that.mergeFeeInfo.feeId,
                    communityId:vc.getCurrentCommunity().communityId,
                }
                vc.http.apiPost(
                    '/feeSub.mergePayFee',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#mergeFeeModel').modal('hide');
                            vc.emit('feeDetailSub', 'loadSub', {});
                            vc.toast("合并成功，请到业务受理查看合并后费用");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            closeMergeFeeModel: function () {
                $('#mergeFeeModel').modal('hide');
            }
        }
    });
})(window.vc, window.$that);