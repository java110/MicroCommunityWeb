(function (vc) {

    vc.extends({
        data: {
            chooseFlowElementConditionInfo: {
                flag: 'Auto',
                condition: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseFlowElementCondition', 'openModal', function (_param) {
                $that.clearAddActivitiesRuleInfo();
                vc.copyObject(_param, $that.chooseFlowElementConditionInfo);
                $('#chooseFlowElementConditionModel').modal('show');
            });
        },
        methods: {
            chooseFlowCondition: function () {
                vc.emit('bpmnjs', 'index', $that.chooseFlowElementConditionInfo);
                $('#chooseFlowElementConditionModel').modal('hide');
            },
            clearAddActivitiesRuleInfo: function () {
                vc.component.chooseFlowElementConditionInfo = {
                    condition: '',
                    flag: 'Auto',
                };
            }
        }
    });

})(window.vc);
