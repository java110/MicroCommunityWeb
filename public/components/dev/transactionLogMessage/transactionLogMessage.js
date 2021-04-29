(function (vc) {

    vc.extends({
        data: {
            transactionLogMessageInfo: {
                logId:'',
                requestHeader:'',
                responseHeader:'',
                requestMessage:'',
                responseMessage:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('transactionLogMessage', 'openModal', function (param) {
                $that.transactionLogMessageInfo.logId = param.logId
                $that.clearLogMessage();
                $that.getLogMessage(param);
                $('#transactionLogMessageModel').modal('show');
            });
        },
        methods: {

            getLogMessage: function (_param) {
                let param = {
                    params:{
                        logId: _param.logId
                    }
                }
                //发送get请求
                vc.http.apiGet('/transactionLog/queryTransactionLogMessage',
                    param,
                    function (json, res) {
                        var _transactionLogManageInfo = JSON.parse(json);
                        let messages = _transactionLogManageInfo.data;

                        if (messages.length > 0) {
                            vc.copyObject(messages[0], $that.transactionLogMessageInfo);
                        }

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            clearLogMessage: function () {
                vc.component.transactionLogMessageInfo = {
                    logId:'',
                    requestHeader:'',
                    responseHeader:'',
                    requestMessage:'',
                    responseMessage:''
                };
            }
        }
    });

})(window.vc);
