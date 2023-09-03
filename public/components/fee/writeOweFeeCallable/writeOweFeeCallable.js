(function(vc) {
    vc.extends({
        data: {
            writeOweFeeCallableInfo: {
                roomId: '',
                roomName: '',
                fees: [],
                feeIds: [],
                remark: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('writeOweFeeCallable', 'openWriteOweFeeCallableModal', function(_param) {
                vc.copyObject(_param, $that.writeOweFeeCallableInfo);
                $that._loadWriteOweRoomFees();
                $('#writeOweFeeCallableModel').modal('show');
            });
        },
        methods: {
            
            _wirteCallable: function() {
                
                $that.writeOweFeeCallableInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/oweFeeCallable.writeOweFeeCallable',
                    JSON.stringify($that.writeOweFeeCallableInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#writeOweFeeCallableModel').modal('hide');
                            $that.clearWriteOweFeeCallable();
                            vc.emit('oweFeeCallable', 'listOweFeeCallable', {});
                            vc.emit('simplifyCallable', 'listOwnerData', {});

                            vc.toast("登记成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearWriteOweFeeCallable: function() {
                $that.writeOweFeeCallableInfo = {
                    roomId: '',
                    roomName: '',
                    fees: [],
                    feeIds: [],
                    remark: '',
                };
            },

            _loadWriteOweRoomFees: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.writeOweFeeCallableInfo.roomId,
                        state: '2008001',
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        $that.writeOweFeeCallableInfo.fees = _json.fees;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);