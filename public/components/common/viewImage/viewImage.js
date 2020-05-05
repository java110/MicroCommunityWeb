
(function (vc) {
    vc.extends({
        data: {
            viewImageInfo: {
                url: '',
                showImage:false
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewImage', 'showImage', function (_param) {
                $that.viewImageInfo.url = _param.url;
                $that.viewImageInfo.showImage = true;
            });
        },
        methods: {
            
            _closeImage:function(){
                $that.viewImageInfo.showImage = false;
             }
        }

    });
})(window.vc);