/**
业主详情页面
 **/
(function(vc) {
    vc.extends({
        data: {
            parkingMapInfo: {
                datas: [],
                parkStatusList: [],
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {

            $that._loadDatas();


        },
        _initEvent: function() {

        },
        methods: {
            _loadDatas: function() {
                let param = {
                        params: $that.parkingMapInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/parkingSpace.queryParkingMap',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.parkingMapInfo.datas = _json;
                        $that._initParkingMap();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initParkingMap: function() {
                const parkStatusList = [{
                        id: 86,
                        status: 1
                    }]
                    //加载geo数据
                const source = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures({
                        type: 'FeatureCollection',
                        features: $that.parkingMapInfo.datas.map(v => {
                            const geoJson = JSON.parse(v.geo);
                            //添加属性
                            geoJson.properties.type = v.type;
                            geoJson.properties.num = v.num;
                            geoJson.properties.ID = v.ID;
                            return geoJson;
                        })
                    })
                });
                //定义块样式
                const partStyle = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 3
                    })
                });
                const parkStyle = new ol.style.Style({
                    text: new ol.style.Text({
                        textAlign: 'center',
                        overflow: false, //永久显示
                        font: 'bold 20px 微软雅黑',
                        fill: new ol.style.Fill({
                            color: 'black'
                        })
                    })
                });
                const redStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,0,0,0.5)',
                    })
                });
                const greenStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0,255,0,0.5)',
                    })
                });
                //初始化图层
                const vectorLayer = new ol.layer.Vector({
                    background: 'lightgray',
                    source: source,
                    style: function(feature) {
                        const { type, num, ID } = feature.getProperties();
                        const styles = [partStyle];
                        if (type == '车位') {
                            parkStyle.getText().setText(num);
                            styles.push(parkStyle);
                            if (parkStatusList.find(v => v.id == ID)?.status) {
                                styles.push(redStyle);
                            } else {
                                styles.push(greenStyle);
                            }
                        }
                        return styles;
                    }
                });
                const view = new ol.View({
                    center: [0, 0],
                    zoom: 1,
                });
                //初始化画布
                const map = new ol.Map({
                    layers: [
                        vectorLayer,
                    ],
                    target: 'map',
                    view: view,
                });
                //定位
                view.fit(source.getExtent(), {
                    nearest: true,
                    padding: [0, 250, 0, 0]
                })
            },
            refreshParkStatus: function() {
                parkStatusList[0].status = !parkStatusList[0].status;
                vectorLayer.changed();
            }


        }
    });
})(window.vc);