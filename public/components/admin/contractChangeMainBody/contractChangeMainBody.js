(function (vc) {

    vc.extends({
        propTypes: {
            emitChooseContract: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            contractChangeMainBodyInfo: {
                contractName: '',
                partyA: '',
                aContacts: '',
                aLink: '',
                partyB: '',
                bContacts: '',
                bLink: '',
                planType: '1001'
            }
        },
        watch: {
            contractChangeMainBodyInfo: {
                deep: true,
                handler: function () {
                    vc.emit($props.emitChooseContract, $props.emitLoadData, $that.contractChangeMainBodyInfo);
                }
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {

        },
        methods: {
            clearcontractChangeMainBodyInfo: function () {
                vc.component.contractChangeMainBodyInfo = {
                    contractName: '',
                    partyA: '',
                    aContacts: '',
                    aLink: '',
                    partyB: '',
                    bContacts: '',
                    bLink: '',
                    planType: '1001'

                };
            }
        }
    });

})(window.vc);
