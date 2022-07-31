
(function (vc) {
    vc.extends({
        data: {
            viewMapInfo: {
                lat: '',
                lng: '',
                showMap: 'hidden',
                map: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('viewMap', 'showMap', function (_param) {
                console.log(_param);
                $that.viewMapInfo.lat = _param.lat;
                $that.viewMapInfo.lng = _param.lng;
                $that.viewMapInfo.showMap = 'visible';
                $that._launchIntoMapFullscreen();
                $that.initMap();
            });
        },
        methods: {
            initMap: function() {
                //定义地图中心点坐标
                var center = new window.TMap.LatLng($that.viewMapInfo.lat, $that.viewMapInfo.lng)
                //定义map变量，调用 TMap.Map() 构造函数创建地图
                let container = document.getElementById("qqmapcontainer");
                console.log(container);
                console.log(center);
                $that.viewMapInfo.map = new window.TMap.Map(container, {
                    center: center,//设置地图中心点坐标
                    zoom: 17.2,   //设置地图缩放级别
                    viewMode: '2D'
                });
                //初始化marker
                var marker = new window.TMap.MultiMarker({
                    id: "marker-layer", //图层id
                    map: $that.viewMapInfo.map,
                    styles: { //点标注的相关样式
                        "marker": new TMap.MarkerStyle({
                            "width": 25,
                            "height": 35,
                            "anchor": { x: 16, y: 32 },
                            "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png"
                        })
                    },
                    geometries: [{ //点标注数据数组
                        "id": "demo",
                        "styleId": "marker",
                        "position": new TMap.LatLng($that.viewMapInfo.lat, $that.viewMapInfo.lng),
                        "properties": {
                            "title": "marker"
                        }
                    }]
                });
            },

            _closeMap: function () {
                $that._exitMapFullscreen();
                $that.viewMapInfo.showMap = 'hidden';
                $that.viewMapInfo.map.destroy();

            },
            _launchIntoMapFullscreen: function () {
                let full = document.getElementById("viewMap");
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
            _exitMapFullscreen: function () {
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
            $that.viewMapInfo.showMap = 'hidden';
            $that.viewMapInfo.map.destroy();
        }
    })
})(window.vc);