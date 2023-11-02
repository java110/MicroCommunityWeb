/**
    入驻小区
**/
(function (vc) {
    vc.extends({
        data: {
            devIndexInfo: {
                datas: [],
                action: '',
                pages: [{
                    name: '应用',
                    url: '/#/pages/dev/appManage?tab=应用信息',
                    icon: '/img/app.png'
                }, {
                    name: '服务',
                    url: '/#/pages/dev/serviceManage?tab=服务信息',
                    icon: '/img/api.png'
                }, {
                    name: '服务注册',
                    url: '/#/pages/dev/serviceRegisterManage?tab=服务注册',
                    icon: '/img/register.png'
                }, {
                    name: '菜单维护',
                    url: '/#/pages/dev/menuManage?tab=菜单维护',
                    icon: '/img/menu.png'
                }, {
                    name: '配置中心',
                    url: '/#/pages/dev/mappingManage?tab=配置中心',
                    icon: '/img/config.png'
                }, {
                    name: '刷新缓存',
                    url: '/#/pages/dev/cacheManage?tab=刷新缓存',
                    icon: '/img/cache.png'
                }, {
                    name: '定时任务',
                    url: '/#/pages/dev/jobManage?tab=定时任务',
                    icon: '/img/job.png'
                }],
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('devIndex', 'initData', function (_param) {
                 $that._loadViewDevData();
                 $that._loadAppServiceData();
            });
        },
        methods: {
            _loadViewDevData: function () {
                //获取主机访问token
                let param = {
                    params: {
                        platform: 'admin'
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.queryDevCount',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            console.log(_json);
                            return;
                        }
                        for (let _index = 0; _index < _json.data.length; _index++) {
                            if (_index % 4 == 0) {
                                _json.data[_index].color = "#1acda1";
                            }
                            if (_index % 4 == 1) {
                                _json.data[_index].color = "#ffae11";
                            }
                            if (_index % 4 == 2) {
                                _json.data[_index].color = "#ff7911";
                            }
                            if (_index % 4 == 3) {
                                _json.data[_index].color = "#3a68f2";
                            }
                        }
                        $that.devIndexInfo.datas = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            newFlow: function(item) {
                vc.jumpToPage(item.url);
            },
            _loadAppServiceData: function () {
                //获取主机访问token
                let param = {
                    params: {
                        platform: 'admin'
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.queryAppServiceData',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            console.log(_json);
                            return;
                        }
                       
                        $that._initDevIndexAppServiceCharts(_json.data);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initDevIndexAppServiceCharts: function (_data) {
                let dom = document.getElementById('appServiceCharts');
                let _source = [
                    ['product', '接口数'],
                ];

                _data.forEach(item => {
                    _source.push([
                        item.name,
                        item.serviceCount,
                    ])
                });

                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        show: "true",
                        text: '应用接口数'
                    },
                    color: ['#66CDAA'],
                    dataset: {
                        source: _source
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    series: [
                        { type: 'bar' }
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

            },

            
        }
    });
})(window.vc);