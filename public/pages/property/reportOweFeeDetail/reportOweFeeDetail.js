/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportOweFeeDetailInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                communitys:[],
                totalPreferentialAmount: 0.0,
                allOweAmount: 0.0,
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    objName: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function () {
            $that._initDate();
            $that.reportOweFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
            $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadStaffCommunitys();

            $(".popover-show").mouseover(() => { $('.popover-show').popover('show'); })
            $(".popover-show").mouseleave(() => { $('.popover-show').popover('hide'); })
        },
        _initEvent: function () {
            vc.on('reportOweFeeDetail', 'chooseFloor', function (_param) {
                $that.reportOweFeeDetailInfo.conditions.floorId = _param.floorId;
                $that.reportOweFeeDetailInfo.conditions.floorName = _param.floorName;
                $that.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $(".endTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true,
                    clearBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        $that.reportOweFeeDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        $that.reportOweFeeDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportOweFeeDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportOweFeeDetailInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            //查询
            _queryMethod: function () {
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMethod: function () {
                $that._resetFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listFees: function (_page, _rows) {
                $that.reportOweFeeDetailInfo.conditions.page = _page;
                $that.reportOweFeeDetailInfo.conditions.row = _rows;
                //$that.reportOweFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportOweFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryOweFeeDetail',
                    param,
                    function (json, res) {
                        var _reportOweFeeDetailInfo = JSON.parse(json);
                        $that.reportOweFeeDetailInfo.total = _reportOweFeeDetailInfo.total;
                        $that.reportOweFeeDetailInfo.records = _reportOweFeeDetailInfo.records;
                        $that.reportOweFeeDetailInfo.fees = _reportOweFeeDetailInfo.data;
                        //计算小计
                        let _totalPreferentialAmount = 0.0;
                        _reportOweFeeDetailInfo.data.forEach(item => {
                            _totalPreferentialAmount += parseFloat(item.oweAmount);
                        });
                        $that.reportOweFeeDetailInfo.totalPreferentialAmount = _totalPreferentialAmount.toFixed(2);
                        if (_reportOweFeeDetailInfo.data.length > 0) {
                            $that.reportOweFeeDetailInfo.allOweAmount = _reportOweFeeDetailInfo.data[0].allOweAmount;
                        } else {
                            $that.reportOweFeeDetailInfo.allOweAmount = 0.0.toFixed(2);
                        }
                        vc.emit('pagination', 'init', {
                            total: $that.reportOweFeeDetailInfo.records,
                            dataCount: $that.reportOweFeeDetailInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetFees: function (_page, _rows) {
                $that.reportOweFeeDetailInfo.conditions.floorName = "";
                $that.reportOweFeeDetailInfo.conditions.floorId = "";
                $that.reportOweFeeDetailInfo.conditions.unitId = "";
                $that.reportOweFeeDetailInfo.conditions.objName = "";
                $that.reportOweFeeDetailInfo.conditions.startTime = "";
                $that.reportOweFeeDetailInfo.conditions.endTime = "";
                $that.reportOweFeeDetailInfo.roomUnits = [];
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            loadUnits: function (_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: $that.reportOweFeeDetailInfo.conditions.communityId
                    }
                }
                vc.http.apiGet(
                    '/unit.queryUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            $that.reportOweFeeDetailInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _moreCondition: function () {
                if ($that.reportOweFeeDetailInfo.moreCondition) {
                    $that.reportOweFeeDetailInfo.moreCondition = false;
                } else {
                    $that.reportOweFeeDetailInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportOweFeeDetail&' + vc.objToGetParam($that.reportOweFeeDetailInfo.conditions));
            },
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.reportOweFeeDetailInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity:function(){
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);
