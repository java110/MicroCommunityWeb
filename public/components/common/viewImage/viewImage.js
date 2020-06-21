
(function (vc) {
    vc.extends({
        data: {
            viewImageInfo: {
                url: '',
                showImage: false
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewImage', 'showImage', function (_param) {
                $that.viewImageInfo.url = _param.url;
                $that.viewImageInfo.showImage = true;

                $that._launchIntoFullscreen();
            });
        },
        methods: {

            _closeImage: function () {
                $that._exitFullscreen();
                $that.viewImageInfo.showImage = false;

            },
            _launchIntoFullscreen: function () {
                let full = document.getElementById("viewImage");
                console.log(full);
                if (full.requestFullscreen) {
                    full.requestFullscreen();
                }
                else if (full.mozRequestFullScreen) {
                    full.mozRequestFullScreen();
                }
                else if (full.webkitRequestFullscreen) {
                    full.webkitRequestFullscreen();
                }
                else if (full.msRequestFullscreen) {
                    full.msRequestFullscreen();
                }
            },
            _exitFullscreen: function () {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            },
        }

    });
  

    document.addEventListener("fullscreenchange", function (e) {
        if (document.fullscreenElement) {
            console.log('进入全屏')
        } else {
            $that.viewImageInfo.showImage = false;
        }
    })
})(window.vc);