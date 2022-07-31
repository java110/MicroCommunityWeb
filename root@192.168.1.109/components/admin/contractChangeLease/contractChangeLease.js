(function (vc) {

    vc.extends({
        propTypes: {
            emitChooseContract: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            contractChangeLeaseInfo: {
                startTime: '',
                endTime: '',

                planType: '2002'
            }
        },
        watch: {
            contractChangeLeaseInfo: {
                deep: true,
                handler: function () {
                    vc.emit($props.emitChooseContract, $props.emitLoadData, $that.contractChangeLeaseInfo);
                }
            }
        },
        _initMethod: function () {
            vc.initDateTime('changeStartTime', function (_value) {
                $that.contractChangeLeaseInfo.startTime = _value;
            });
            vc.initDateTime('changeEndTime', function (_value) {
                $that.contractChangeLeaseInfo.endTime = _value;
            });

        },
        _initEvent: function () {

        },
        methods: {
            clearcontractChangeLeaseInfo: function () {
                vc.component.contractChangeLeaseInfo = {
                    startTime: '',
                    endTime: '',
                    planType: '2002'
                };
            }
        }
    });

})(window.vc);
