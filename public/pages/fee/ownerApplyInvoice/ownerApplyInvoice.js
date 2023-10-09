(function (vc) {
    vc.extends({
        data: {
            ownerApplyInvoiceInfo: {
                ownerId: '',
                ownerName: '',
                invoiceType:'',
                invoiceName:'',
                invoiceAddress:'',

                feeDetails: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerApplyInvoice', 'chooseOwner', function (_owner) {
                $that.ownerApplyInvoiceInfo.ownerName = _owner.name;
                $that.ownerApplyInvoiceInfo.ownerId = _owner.ownerId;
                $that._loadFeeDetails();
            });


        },
        methods: {
            
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },

            _loadFeeDetails:function(){

            }
        }
    });
})(window.vc);