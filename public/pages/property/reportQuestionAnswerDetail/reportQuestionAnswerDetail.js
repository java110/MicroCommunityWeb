/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportQuestionAnswerDetailInfo: {
                questions: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    qaType: '',
                    floorName: '',
                    configId: '',
                    questionName: '',
                    roomNum: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listQuestionAnswers(_currentPage, DEFAULT_ROWS);
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
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.reportQuestionAnswerDetailInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportQuestionAnswerDetailInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportQuestionAnswerDetailInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportQuestionAnswerDetailInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportQuestionAnswerDetailInfo.conditions.endTime = '';
                        }
                    });
            },
            _queryMethod: function () {
                vc.component._listQuestionAnswers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listQuestionAnswers: function (_page, _rows) {
                vc.component.reportQuestionAnswerDetailInfo.conditions.page = _page;
                vc.component.reportQuestionAnswerDetailInfo.conditions.row = _rows;
                vc.component.reportQuestionAnswerDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportQuestionAnswerDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportQuestionAnswer/queryUserQuestionAnswerValue',
                    param,
                    function (json, res) {
                        var _reportQuestionAnswerDetailInfo = JSON.parse(json);
                        vc.component.reportQuestionAnswerDetailInfo.total = _reportQuestionAnswerDetailInfo.total;
                        vc.component.reportQuestionAnswerDetailInfo.records = _reportQuestionAnswerDetailInfo.records;
                        vc.component.reportQuestionAnswerDetailInfo.questions = _reportQuestionAnswerDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportQuestionAnswerDetailInfo.records,
                            dataCount: vc.component.reportQuestionAnswerDetailInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.reportQuestionAnswerDetailInfo.moreCondition) {
                    vc.component.reportQuestionAnswerDetailInfo.moreCondition = false;
                } else {
                    vc.component.reportQuestionAnswerDetailInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportQuestionAnswerDetail&' + vc.objToGetParam($that.reportQuestionAnswerDetailInfo.conditions));
            }
        }
    });
})(window.vc);
