(function (vc) {
    vc.extends({
        data: {
            wirteInvoiceEventInfo: {
                applyId: '',
                eventType:'',
                remark: '',
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
           
            vc.on('wirteInvoiceEvent', 'openWirteInvoiceModal', function(_param) {
                vc.copyObject(_param,$that.wirteInvoiceEventInfo);
                $('#wirteInvoiceEventModel').modal('show');
            });
        },
        methods: {
            _wirteEvent: function () {
                let _eventType = $that.wirteInvoiceEventInfo.eventType;
                if (!_eventType) {
                    vc.toast("请选择类型");
                    return;
                }
                $that.wirteInvoiceEventInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/invoice.writeInvoiceApply',
                    JSON.stringify($that.wirteInvoiceEventInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == '0') {
                            //关闭model
                            $('#wirteInvoiceEventModel').modal('hide');
                            $that.clearWirteInvoiceEventInfo();
                            vc.emit('invoiceApply', 'listInvoiceApply', {});
                            vc.toast("上传成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            clearWirteInvoiceEventInfo: function () {
                $that.wirteInvoiceEventInfo = {
                    applyId: '',
                    eventType:'',
                    remark: '',
                };
            },
        }
    });
})(window.vc);