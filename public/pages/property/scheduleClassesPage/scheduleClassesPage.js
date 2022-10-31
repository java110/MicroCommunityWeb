/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            scheduleClassesPageInfo: {
                staffs: [],
                scheduleClassess:[],
                maxDay:30,
                curMonth:'',
                curYear:'',
                total: 0,
                records: 1,
                moreCondition: false,
                states: '',
                conditions: {
                    staffNameLike: '',
                    scheduleId: '',
                    curDate: ''
                }
            }
        },
        _initMethod: function () {
            $that.initStaffDate();
            vc.component._listStaffScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);

        },
        _initEvent: function () {
            vc.on('scheduleClassesPage', 'listScheduleClasses', function (_param) {
                vc.component._listStaffScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listStaffScheduleClassess(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            initStaffDate: function() {
                let _date = new Date(new Date());
                $that.scheduleClassesPageInfo.curMonth = _date.getMonth() + 1
                $that.scheduleClassesPageInfo.curYear = _date.getFullYear();
                $that.scheduleClassesPageInfo.conditions.curDate = _date.getFullYear() + "-" + (_date.getMonth() + 1);
                $that.scheduleClassesPageInfo.maxDay = new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate();

                vc.initDateMonth('queryDate', function(_value) {
                    $that.scheduleClassesPageInfo.conditions.curDate = _value;
                    let _values = _value.split('-');
                    $that.scheduleClassesPageInfo.curYear = _values[0];

                    $that.scheduleClassesPageInfo.curMonth = _values[1];
                    vc.component._listStaffScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
                })
            },
            _listStaffScheduleClassess: function (_page, _rows) {
                vc.component.scheduleClassesPageInfo.conditions.page = _page;
                vc.component.scheduleClassesPageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.scheduleClassesPageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.staffMonthScheduleClasses',
                    param,
                    function (json, res) {
                        let _scheduleClassesPageInfo = JSON.parse(json);
                        vc.component.scheduleClassesPageInfo.total = _scheduleClassesPageInfo.total;
                        vc.component.scheduleClassesPageInfo.records = _scheduleClassesPageInfo.records;
                        vc.component.scheduleClassesPageInfo.staffs = _scheduleClassesPageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.scheduleClassesPageInfo.records,
                            dataCount: vc.component.scheduleClassesPageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            
            //查询
            _queryScheduleClassesMethod: function () {
                vc.component._listStaffScheduleClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
           
            _moreCondition: function () {
                if (vc.component.scheduleClassesPageInfo.moreCondition) {
                    vc.component.scheduleClassesPageInfo.moreCondition = false;
                } else {
                    vc.component.scheduleClassesPageInfo.moreCondition = true;
                }
            },
            _listScheduleClassess: function (_page, _rows) {
              
                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/scheduleClasses.listScheduleClasses',
                    param,
                    function (json, res) {
                        let _scheduleClassesInfo = JSON.parse(json);
                        $that.scheduleClassesPageInfo.scheduleClassess = _scheduleClassesInfo.data;
                        
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportScheduleClasses: function () {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeDetail&' + vc.objToGetParam($that.reportPayFeeDetailInfo.conditions));
                vc.component.scheduleClassesPageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.scheduleClassesPageInfo.conditions.pagePath = 'reportStaffMonthScheduleClasses';
                let param = {
                    params: vc.component.scheduleClassesPageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if(_json.code == 0){
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            }
            
        }
    });
})(window.vc);