/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeReceiptManageInfo: {
                rooms: [],
                feeReceipts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                feeReceiptId: '',
                conditions: {
                    objType: '',
                    storeName: '',
                    objId: '',
                    month:'',
                    qstartTime:'',
                    qendTime:'',
                    type:'',
                    roomId:'',
                    communityId: vc.getCurrentCommunity().communityId,
                    receiptId:''
                }
            }
        },
        _initMethod: function () {
            //切换 至费用页面
            vc.on('feeReceipt', 'switch', function (_param) {
                if (_param.ownerId == '') {
                    return;
                }
                console.log(_param);
                vc.component.feeReceiptManageInfo.conditions.roomId=_param.roomName;
                vc.component._listFeeReceipts(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.component._initDate();

            vc.component._listFeeReceipts(DEFAULT_PAGE, DEFAULT_ROWS);

            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.feeReceiptManageInfo.conditions.month = _startTime;
            // });
            // vc.initDateDay('startTime', function (_startTime) {
            //     $that.feeReceiptManageInfo.conditions.startTime = _startTime;
            // });
            // vc.initDateDay('endTime', function (_endTime) {
            //     $that.feeReceiptManageInfo.conditions.endTime = _endTime;
            // });
            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportFeeSummaryInfo.conditions.startTime = _startTime;
            // });

        },
        _initEvent: function () {

            vc.on('feeReceiptManage', 'listFeeReceipt', function (_param) {
                vc.component._listFeeReceipts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeReceipts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate:function(){
                $(".startTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    startView: 2,
                    minView: 2,
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    startView: 2,
                    minView: 2,
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".startTime").val();
                    vc.component.feeReceiptManageInfo.conditions.qstartTime = value ;
                });
                $('.endTime').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".endTime").val();
                    vc.component.feeReceiptManageInfo.conditions.qendTime = value ;
                });
            },
            _listFeeReceipts: function (_page, _rows) {
                vc.component._initDate();
                vc.component.feeReceiptManageInfo.conditions.page = _page;
                vc.component.feeReceiptManageInfo.conditions.row = _rows;

                var param = {
                    params: vc.component.feeReceiptManageInfo.conditions
                };
                // console.log(param);
                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceipt',
                    param,
                    function (json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        vc.component.feeReceiptManageInfo.total = _feeReceiptManageInfo.total;
                        vc.component.feeReceiptManageInfo.records = _feeReceiptManageInfo.records;
                        vc.component.feeReceiptManageInfo.feeReceipts = _feeReceiptManageInfo.data;
                        var storeName = "";
                        for (var i = 0; i < vc.component.feeReceiptManageInfo.feeReceipts.length; i++) {
                            storeName = vc.component.feeReceiptManageInfo.feeReceipts[i].storeName;
                        }
                        vc.component.feeReceiptManageInfo.conditions.storeName = storeName;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeReceiptManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _queryFeeReceiptMethod: function () {
                vc.component._listFeeReceipts(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _printFeeReceipt: function (_receipt) {
                window.open("/print.html#/pages/property/printPayFee?receiptId=" + _receipt.receiptId);
            },
            _printFeeReceipts: function (_conditions) {
                // console.log(_conditions)
                if(_conditions.roomId==null|| _conditions.roomId ==""){
                    vc.toast("请填写收费对象",1000);
                    return;
                }
                if(_conditions.type==null|| _conditions.type ==""){
                    vc.toast("请选择打印类型",1000);
                    return;
                }
                // if(_conditions.month==null|| _conditions.month ==""){
                //     vc.toast("请选择费用月份",1000);
                //     return;
                // }
                if(_conditions.qstartTime==null|| _conditions.qstartTime ==""){
                    vc.toast("请选择开始时间",1000);
                    return;
                }
                if(_conditions.qendTime==null|| _conditions.qendTime ==""){
                    vc.toast("请选择结束时间",1000);
                    return;
                }
                // window.open("/print.html#/pages/property/printPayFees?roomName=" + _conditions.roomId+
                // "&type="+_conditions.type+"&month="+_conditions.month);
                window.open("/print.html#/pages/property/printPayFees?roomName=" + _conditions.roomId+
                "&type="+_conditions.type+"&qstartTime="+_conditions.qstartTime+"&qendTime="+_conditions.qendTime);
            },
            _moreCondition: function () {
                if (vc.component.feeReceiptManageInfo.moreCondition) {
                    vc.component.feeReceiptManageInfo.moreCondition = false;
                } else {
                    vc.component.feeReceiptManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
