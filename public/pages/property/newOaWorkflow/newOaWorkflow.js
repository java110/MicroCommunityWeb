/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            newOaWorkflowInfo: {
                switchValue: '',
            }
        },
        _initMethod: function () {
            //$that.newOaWorkflowInfo.switchValue = vc.getParam('switchValue');
            let _switchValue = vc.getParam('switchValue');
            
            if (_switchValue) {
                $that.swatch(_switchValue);
                return;
            }
            $that.swatch('newOaWorkflowPool');
        },
        _initEvent: function () {
            vc.on('newOaWorkflow', 'listNewOaWorkflow', function (_param) {
                vc.component._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('newOaWorkflow', 'switch', function (_switchValue) {
                $that.swatch(_switchValue);
            })
        },
        methods: {
            swatch: function (_value) {
                if($that.newOaWorkflowInfo.switchValue == _value){
                    return ;
                }
                $that.newOaWorkflowInfo.switchValue = _value;
                vc.emit(_value, 'witch', {
                    flowId: vc.getParam('flowId')
                });
            }
        }
    });
})(window.vc);
