(function (vc) {
    vc.extends({
        data: {
            operateDataLogInfo: {
                _currentTab: 'feeConfigDetailHis',
                moreCondition: false,
                conditions: {
                    logStartTime: '',
                    logEndTime: '',
                    staffNameLike: '',
                    feeNameLike: '',
                    payerObjName: '',
                    ownerNameLike: '',
                    roomName: '',
                    carNumLike: '',
                    contractCode: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initOperateDataLogDateInfo();
            $that.changeTab($that.operateDataLogInfo._currentTab);
        },
        _initEvent: function () {
        },
        methods: {
            _initOperateDataLogDateInfo: function () {
                $('.startDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startDate").val();
                        vc.component.operateDataLogInfo.conditions.logStartTime = value;
                    });
                $('.endDate').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endDate').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endDate").val();
                        var start = Date.parse(new Date(vc.component.operateDataLogInfo.conditions.logStartTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".endDate").val('')
                        } else {
                            vc.component.operateDataLogInfo.conditions.logEndTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startDate')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endDate")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            changeTab: function (_tab) {
                $that.operateDataLogInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.operateDataLogInfo.conditions)
            },
            //查询
            _queryDataMethod: function () {
                $that.changeTab($that.operateDataLogInfo._currentTab)
            },
            //重置
            _resetDataMethod: function () {
                vc.component.operateDataLogInfo.conditions.logStartTime = "";
                vc.component.operateDataLogInfo.conditions.logEndTime = "";
                vc.component.operateDataLogInfo.conditions.staffNameLike = "";
                vc.component.operateDataLogInfo.conditions.feeNameLike = "";
                vc.component.operateDataLogInfo.conditions.payerObjName = "";
                vc.component.operateDataLogInfo.conditions.ownerNameLike = "";
                vc.component.operateDataLogInfo.conditions.roomName = "";
                vc.component.operateDataLogInfo.conditions.carNumLike = "";
                vc.component.operateDataLogInfo.conditions.contractCode = "";
                $that.changeTab($that.operateDataLogInfo._currentTab)
            },
            _moreCondition: function () {
                if ($that.operateDataLogInfo.moreCondition) {
                    $that.operateDataLogInfo.moreCondition = false;
                } else {
                    $that.operateDataLogInfo.moreCondition = true;
                }
            }
        }
    })
})(window.vc);