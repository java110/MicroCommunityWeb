/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            operationalAnalysisInfo: {
                conditions:{
                    communityId:'',
                }
            }
        },
        _initMethod: function() {
           
        },
        _initEvent: function() {
            vc.on('selectAdminCommunity','changeCommunity',function(_community){
                $that.operationalAnalysisInfo.conditions.communityId = _community.communityId;
                $that._loadOperationalAnalysisData();
            })
        },
        methods: {
            _loadOperationalAnalysisData: function (_page, _rows) {
                let param = {
                    params: {
                        page:_page,
                        row:_rows,
                        communityId:$that.operationalAnalysisInfo.conditions.communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.getCommunityOperationalAnalysis',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let _payFeeData = _json.data.feeDetailData;
                        $that._initAnalysisChart(_payFeeData,'communityPayFeeDetail','缴费订单数','缴费订单');
                        let _repairData = _json.data.repairData;
                        $that._initAnalysisChart(_repairData,'communityRepair','报修订单数','报修订单');
                        let _inspectionData = _json.data.inspectionData;
                        $that._initAnalysisChart(_inspectionData,'communityInspection','巡检数','巡检数');
                        let _maintainanceData = _json.data.maintainanceData;
                        $that._initAnalysisChart(_maintainanceData,'communityMaintainance','保养数','包养数');
                        let _itemInData = _json.data.itemInData;
                        $that._initAnalysisChart(_itemInData,'communityItemIn','采购订单数','采购订单');
                        let _itemOutData = _json.data.itemOutData;
                        $that._initAnalysisChart(_itemOutData,'communityItemOut','领用订单数','领用订单');
                        let _carInData = _json.data.carInData;
                        $that._initAnalysisChart(_carInData,'communityCarIn','车辆进场数','车辆进场数');
                        let _personInData = _json.data.personInData;
                        $that._initAnalysisChart(_personInData,'communityPersonIn','开门记录','开门记录');
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initAnalysisChart: function(_data,_element,_title,_lineName) {
                let dom = document.getElementById(_element);
                let myChart = echarts.init(dom);
                let _createTime = [];
                let _realChargeTotals = [];
                _data.forEach(item => {
                    _createTime.push(item.createTime);
                    _realChargeTotals.push(item.countValue);
                });
                var app = {};
                option = null;
                option = {
                    title: {
                        text: _title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: _createTime
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: _createTime
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: _lineName,
                        type: 'line',
                        stack: 'Total',
                        data: _realChargeTotals
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }
        }
    });
})(window.vc);