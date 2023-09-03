/**
业主详情页面
 **/
(function(vc) {
    vc.extends({
        data: {
            dataReportInfo: {
                curDay: 'thirty',
                _currentTab: 'dataReportEarnedStatistics',
                fees: [],
                orders: [],
                inouts: [],
                others: [],
                conditions: {
                    startDate: '',
                    endDate: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._initDate();
            $that.changeTab($that.dataReportInfo._currentTab);
            $that._loadDataReportFee();
            $that._loadDataReportOrder();
            $that._loadDataReportInout();
            $that._loadDataReportOthers();


        },
        _initEvent: function() {
            vc.on('dataReport', 'listOwnerData', function(_info) {
                $that.changeTab($that.dataReportInfo._currentTab);
            });
        },
        methods: {
            _initDate: function() {
                vc.initDate('startDate', function(_value) {
                    $that.dataReportInfo.conditions.startDate = _value;
                    $that._changeDate();
                });
                vc.initDate('endDate', function(_value) {
                    console.log(_value)
                    $that.dataReportInfo.conditions.endDate = _value;
                    console.log($that.dataReportInfo.conditions.endDate)

                    $that._changeDate();
                });
                let _data = new Date();
                let _month = _data.getMonth() + 1;
                let _newDate = "";
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.dataReportInfo.conditions.startDate = _newDate;
                _data.setMonth(_data.getMonth() + 1);
                _month = _data.getMonth() + 1;
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.dataReportInfo.conditions.endDate = _newDate;
            },
            _changeDate: function(_day) {
                $that.dataReportInfo.curDay = _day;
                let _endDate = new Date();
                if (_day == 'today') {
                    $that.dataReportInfo.conditions.endDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                    $that.dataReportInfo.conditions.startDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                } else if (_day == 'yesterday') {
                    _endDate.setDate(_endDate.getDate() - 1);
                    $that.dataReportInfo.conditions.endDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                    $that.dataReportInfo.conditions.startDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                } else if (_day == 'seven') {
                    $that.dataReportInfo.conditions.endDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                    _endDate.setDate(_endDate.getDate() - 7);
                    $that.dataReportInfo.conditions.startDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                } else if (_day == 'thirty') {
                    $that.dataReportInfo.conditions.endDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                    _endDate.setDate(_endDate.getDate() - 30);
                    $that.dataReportInfo.conditions.startDate = _endDate.getFullYear() + "-" + (_endDate.getMonth() + 1) + "-" + _endDate.getDate();
                }
                $that._loadDataReportFee();
                $that._loadDataReportOrder();
                $that._loadDataReportInout();
                $that._loadDataReportOthers();
                $that.changeTab($that.dataReportInfo._currentTab);

            },
            _loadDataReportFee: function() {
                let param = {
                        params: $that.dataReportInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/dataReport.queryFeeDataReport',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.dataReportInfo.fees = _json.data
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadDataReportOrder: function() {
                let param = {
                        params: $that.dataReportInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/dataReport.queryOrderDataReport',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.dataReportInfo.orders = _json.data
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadDataReportInout: function() {
                let param = {
                        params: $that.dataReportInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/dataReport.queryInoutDataReport',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.dataReportInfo.inouts = _json.data
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadDataReportOthers: function() {
                let param = {
                        params: $that.dataReportInfo.conditions
                    }
                    //发送get请求
                vc.http.apiGet('/dataReport.queryOthersDataReport',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.dataReportInfo.others = _json.data
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function(_tab) {
                $that.dataReportInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    startDate: $that.dataReportInfo.conditions.startDate,
                    endDate: $that.dataReportInfo.conditions.endDate,
                })
            },
        }
    });
})(window.vc);