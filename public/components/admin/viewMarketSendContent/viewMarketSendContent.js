(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewMarketSendContentInfo: {
                sendContent: '',

            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
            vc.on('viewMarketSendContent', 'openModal', function (_param) {
                $('#viewMarketSendContentModel').modal('show');
                $that.viewMarketSendContentInfo = _param;
            });
        },
        methods: {
            
        }
    });

})(window.vc);
