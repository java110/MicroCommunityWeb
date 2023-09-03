(function (vc) {
    vc.extends({
        data: {
            viewImageInfo: {
                url: '',
                showImage: false,
                imgWidth: 800,
                imgHeight: 800
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewImage', 'showImage', function (_param) {
                $that.viewImageInfo.url = _param.url;
                $that.viewImageInfo.showImage = true;
                $that._launchIntoFullscreen();
                var img = new Image();
                img.src = _param.url;
                // 加载完成执行
                img.onload = function () {
                    let imgScale = img.width / img.height;
                    console.log(imgScale);
                    $that.viewImageInfo.imgWidth = 800;
                    $that.viewImageInfo.imgHeight = 800 / imgScale;
                };
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
                } else if (full.mozRequestFullScreen) {
                    full.mozRequestFullScreen();
                } else if (full.webkitRequestFullscreen) {
                    full.webkitRequestFullscreen();
                } else if (full.msRequestFullscreen) {
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
            }
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