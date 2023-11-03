/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingFeeLedgerInfo: {
                payFees: [],
                communitys:[],
                total: 0,
                records: 1,
                conditions: {
                    communityId: '',
                    payObjType: '',
                    startTime: '',
                    endTime: '',
                    primeRate: '',
                    roomName: ''
                }
            }
        },
        _initMethod: function () {
            $that._listPropertyFeeLedger(1,DEFAULT_ROWS); 
            $that._loadLedgerCommunitys();

            vc.initDate('start_time',function(_value){
                $that.parkingFeeLedgerInfo.conditions.startTime = _value;
            });
            vc.initDate('end_time',function(_value){
                $that.parkingFeeLedgerInfo.conditions.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listPropertyFeeLedger(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            
            _listPropertyFeeLedger: function (_page, _rows) {
                let param = {
                    params: {
                        page:_page,
                        row:_rows
                    }
                };
                //发送get请求
                vc.http.apiGet('/admin.getParkingFeeSummary',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.parkingFeeLedgerInfo.total = _json.total;
                        $that.parkingFeeLedgerInfo.records = Math.ceil(_json.total / _rows);
                        $that.parkingFeeLedgerInfo.payFees = _json.data;
                       
                        vc.emit('pagination', 'init', {
                            total: $that.parkingFeeLedgerInfo.records,
                            dataCount: $that.parkingFeeLedgerInfo.total,
                            currentPage: _page,
                            // dataCount: $that.parkingFeeLedgerInfo.total
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _computeTableDivWidth: function () {
                let mainWidth = document.getElementsByTagName('body')[0].clientWidth - document.getElementById('menu-nav').offsetWidth;
                //let treeWidth = document.getElementsByClassName('room-floor-unit-tree')[0].offsetWidth;
                mainWidth = mainWidth - 20 - 15 - 20;
                //document.getElementsByClassName('hc-table-div')[0].style.width=mainWidth+'px';
                return mainWidth + 'px';
            },
            //查询
            _queryPayFeeMethod: function () {
                $that._listPropertyFeeLedger(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getPayFeeDetailCode:function(_fee,month){
                let _monthData = _fee.monthData;
                let _receiptCode = "无";
                _monthData.forEach(_item => {
                    let _curMonthTime = new Date(_item.curMonthTime);

                    if(month == (_curMonthTime.getMonth()+1)){
                        _receiptCode = _item.receiptCode;
                    }
                });

                if(!_receiptCode || _receiptCode == '-1'){
                    _receiptCode = "无";
                }
                
                return _receiptCode;
            },
            _getReceivableAmount:function(_fee,month){

                let _monthData = _fee.monthData;
                let _amount = 0.0;
                _monthData.forEach(_item => {
                    let _curMonthTime = new Date(_item.curMonthTime);

                    if(month == (_curMonthTime.getMonth()+1)){
                        _amount = _item.receivableAmount;
                    }
                });
                return _amount
            },
            _getReceivedAmount:function(_fee,month){
                let _monthData = _fee.monthData;
                let _amount = 0.0;
                _monthData.forEach(_item => {
                    let _curMonthTime = new Date(_item.curMonthTime);
                    if(month == (_curMonthTime.getMonth()+1)){
                        _amount = _item.receivedAmount;
                    }
                });
                return _amount
            },
            _getDiscountAmount:function(_fee,month){
                let _amount = "0.0";

                if(_fee.oweAmount == 0){
                    return _amount;
                }

                _amount = $that._getReceivableAmount(_fee,month) - $that._getReceivedAmount(_fee,month);

                return _amount.toFixed(2)
            },
            _getOweFeeAmount:function(_fee,month){
                let _monthData = _fee.monthData;
                let _amount = 0.0;
                _monthData.forEach(_item => {
                    let _curMonthTime = new Date(_item.curMonthTime);
                    if(month == (_curMonthTime.getMonth()+1)){
                        _amount = _item.oweAmount;
                    }
                });
                return _amount
            },
            _loadLedgerCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.parkingFeeLedgerInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity: function () {
                $that._listPropertyFeeLedger(1,DEFAULT_ROWS); 
            },
            
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeManage&' + vc.objToGetParam($that.parkingFeeLedgerInfo.conditions));
            },
        }
    });
})(window.vc);