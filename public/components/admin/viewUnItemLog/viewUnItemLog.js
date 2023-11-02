(function (vc, vm) {

    vc.extends({
        data: {
            viewUnItemLogInfo: {
                bId: '',
                serviceName: '',
                logText: '',
                preValue: '',
                afterValue: '',
                action:'',
                actionObj:'',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('viewUnItemLog', 'openLog', function (_params) {
                $that.clearLog();
                $that.viewUnItemLogInfo.bId = _params.bId;
                if(_params.action == 'ADD'){
                    $that.viewUnItemLogInfo.action = '添加';
                }else if(_params.action == 'MOD'){
                    $that.viewUnItemLogInfo.action = '修改';
                }else if(_params.action == 'DEL'){
                    $that.viewUnItemLogInfo.action = '删除';
                }else{
                    $that.viewUnItemLogInfo.action = '-';
                }
                $that.viewUnItemLogInfo.actionObj = _params.actionObj;
                $('#viewUnItemLogModel').modal('show');
                $that._loadOrderUnitemLog();
            });
        },
        methods: {
            _loadOrderUnitemLog(){
                
                let param = {
                    params: {
                        bId:$that.viewUnItemLogInfo.bId,

                    }
                };
                //发送get请求
                vc.http.apiGet('/corders.listUnitemLog',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.copyObject(_json.data,$that.viewUnItemLogInfo);

                        let _logText = JSON.parse(_json.data.logText);
                        $that.viewUnItemLogInfo.preValue = JSON.stringify(_logText.preValue);
                        $that.viewUnItemLogInfo.afterValue = JSON.stringify(_logText.afterValue);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearLog: function () {
                $that.viewUnItemLogInfo = {
                    bId: '',
                    serviceName: '',
                    logText: '',
                    preValue: '',
                    afterValue: '',
                    action:'',
                    actionObj:'',
                }
            }
        }
    });

})(window.vc, window.$that);
