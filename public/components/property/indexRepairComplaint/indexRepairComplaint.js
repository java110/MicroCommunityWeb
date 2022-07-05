(function (vc) {
    vc.extends({
        data: {
            indexRepairComplaintInfo: {
                allCount:0,
                waitCount:0,
                doingCount:0,
                finishCount:0,
                allComplaintCount:0,
                waitComplaintCount:0,
                finishComplaintCount:0,
            }
        },
        _initMethod: function () {
           
           $that._loadIndexComplaintData();
            $that._loadIndexRepairData();
        },
        _initEvent: function () {
        },
        methods: {
            _loadIndexRepairData:function(){
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/propertyIndex.queryRepairIndex',
                    param,
                    function (json, res) {
                        let _res = JSON.parse(json);
                        if(_res.code != 0){
                            return;
                        }
                        vc.copyObject(_res.data, $that.indexRepairComplaintInfo);
                        let _dom = document.getElementById('repairCount');
                        $that._initEcharts($that.indexRepairComplaintInfo.finishCount, $that.indexRepairComplaintInfo.allCount -  $that.indexRepairComplaintInfo.finishCount, _dom, vc.i18n('报修信息', 'indexRepairComplaint'), vc.i18n('已处理', 'indexContext'), vc.i18n('未处理', 'indexContext'), '#4B7AF0', '#E2EDF6');
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                       
                    }
                );
            },
            _loadIndexComplaintData:function(){
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/propertyIndex.queryComplaintIndex',
                    param,
                    function (json, res) {
                        let _res = JSON.parse(json);
                        if(_res.code != 0){
                            return;
                        }
                        vc.copyObject(_res.data, $that.indexRepairComplaintInfo);
                        let _complaintCountDom = document.getElementById('complaintCount');
                        $that._initEcharts($that.indexRepairComplaintInfo.finishComplaintCount, $that.indexRepairComplaintInfo.allComplaintCount -  $that.indexRepairComplaintInfo.finishComplaintCount, _complaintCountDom, vc.i18n('投诉统计', 'indexRepairComplaint'), vc.i18n('已处理', 'indexContext'), vc.i18n('未处理', 'indexContext'), '#01C36D', '#E2EDF6');
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                       
                    }
                );
            },
            _initEcharts: function (userCount, freeCount, dom, _title, _userCountName, _freeCountName, userColor, freeColor) {
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    tooltip: {
                        trigger: 'item'
                    },

                    legend: {
                        top: '5%',
                        left: 'right',
                        orient: 'vertical',  //垂直显示
                    },
                    color: [userColor, freeColor],
                    series: [{
                        name: _title,
                        type: 'pie',
                        radius: ['40%', '65%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'top'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: userCount, name: _userCountName },
                            { value: freeCount, name: _freeCountName }
                        ],
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },
        }
    })
})(window.vc);