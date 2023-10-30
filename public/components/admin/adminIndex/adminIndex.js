/**
    入驻小区
**/
(function (vc) {
    vc.extends({
        data: {
            adminIndexInfo: {
                hostCount: 0,
                datas: [],
                action: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('adminIndex', 'initData', function (_param) {
                $that._loadViewAdminData();
                $that._loadCommunityFee();
                $that._loadCommunityRepair();
            });
        },
        methods: {

            _loadViewAdminData: function () {
                //获取主机访问token
                let param = {
                    params: {
                        platform: 'admin'
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.queryAdminCount',
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
                        $that.adminIndexInfo.datas = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadCommunityFee: function () {
                //获取主机访问token
                let param = {
                    params: {
                        platform: 'admin'
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.queryCommunityFee',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            console.log(_json);
                            return;
                        }
                       
                        $that._initAdminIndexCommunityFeeCharts(_json.data);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initAdminIndexCommunityFeeCharts: function (_data) {
                let dom = document.getElementById('communityFeeCharts');
                let _source = [
                    ['product', '缴费数', '缴费金额'],
                ];

                _data.forEach(item => {
                    _source.push([
                        item.communityName,
                        item.count,
                        item.receivedAmount
                    ])
                });

                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        show: "true",
                        text: '小区缴费统计'
                    },
                    color: ['#FFDAB9', '#66CDAA'],
                    dataset: {
                        source: _source
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    series: [
                        { type: 'bar' },
                        { type: 'bar' }
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

            },
            _loadCommunityRepair: function () {
                //获取主机访问token
                let param = {
                    params: {
                        platform: 'admin'
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.queryCommunityRepair',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            console.log(_json);
                            return;
                        }
                       
                        $that._initAdminIndexCommunityRepairCharts(_json.data);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initAdminIndexCommunityRepairCharts: function (_data) {
                let dom = document.getElementById('communityRepairCharts');
                let _source = [
                    ['product', '报修单数'],
                ];

                _data.forEach(item => {
                    _source.push([
                        item.communityName,
                        item.count
                    ])
                });

                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        show: "true",
                        text: '小区缴费统计'
                    },
                    color: ['#FFDAB9', '#66CDAA'],
                    dataset: {
                        source: _source
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    series: [
                        { type: 'bar' },
                        { type: 'bar' }
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

            }
        }
    });
})(window.vc);