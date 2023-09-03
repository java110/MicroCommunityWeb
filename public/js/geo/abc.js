// 中心点坐标 ('EPSG:4326', 'EPSG:3857' 坐标系知识参考博客https://www.cnblogs.com/E7868A/p/11460865.html)

var center_point = ol.proj.transform([6977.3369764867793, 3180.2735531048493], 'EPSG:4326', 'EPSG:3857');
// 高德地图源
var gaodeMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
});

// 创建地图
var map = new ol.Map({
    // 让id为map的div作为地图的容器
    target: 'map',
    // 设置地图图层
    layers: [
        // 创建一个使用Open Street Map地图源的瓦片图层
        //new ol.layer.Tile({source: new ol.source.OSM()})
        gaodeMapLayer
    ],
    // 设置显示地图的视图
    view: new ol.View({
        center: center_point, // 定义地图显示中心
        zoom: 14 // 定义地图显示层级
    }),
    // 设置地图控件，默认的三个控件都不显示
    controls: ol.control.defaults({
        attribution: false,
        rotate: false,
        zoom: false
    })
});

var reader = new ol.format.GeoJSON({
    defaultDataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
});

// 绘制线
var lineLayer = new ol.layer.Vector();
var lineSourceVector = new ol.source.Vector();
lineLayer.setSource(lineSourceVector);
map.addLayer(lineLayer);

// 线图形样式
var lineStyle = function() {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgb(127,127,209)',
            lineDash: [4],
            width: 3,
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)',
        }),
        zIndex: 997
    });
};
lineLayer.setStyle(lineStyle);

function drawParkSpace(_data) {
    console.log(_data)

    lineSourceVector.addFeatures(reader.readFeatures(_data));
}

function queryData() {
    $.ajax({
        url: './json/data.json',
        type: 'get',
        data: {}, //数据也需要转为JSON格式。
        contentType: 'application/json', //指定字符编码格式
        success: function(_data) {
            console.log(_data)
                // _data.forEach(item => {
                //     if (item.type == '车位') {
                //         let geoJson = {
                //             "type": "FeatureCollection",
                //             "features": [JSON.parse(item.geo)]
                //         }
                //         drawParkSpace(geoJson)
                //     }
                // })
            let geoJson = {
                "type": "FeatureCollection",
                "features": [JSON.parse(_data[1].geo)]
            }
            drawParkSpace(JSON.parse(_data[1].geo))
        }
    })
}


queryData();


gaodeMapLayer.setVisible(false)