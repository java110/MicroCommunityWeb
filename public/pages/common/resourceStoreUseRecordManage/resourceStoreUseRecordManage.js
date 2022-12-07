/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceStoreUseRecordManageInfo: {
                resourceStoreUseRecords: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rsurId: '',
                conditions: {
                    rsurId: '',
                    repairId: '',
                    resId: '',
                    resName: '',
                    parentRstId: '',
                    rstId: '',
                    rssId: '',
                    createUserId: '',
                    createUserName: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('resourceStoreUseRecordManage', 'listResourceStoreUseRecord', function (_param) {
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listResourceStoreUseRecords(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.resourceStoreUseRecordManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.resourceStoreUseRecordManageInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.resourceStoreUseRecordManageInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.resourceStoreUseRecordManageInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.resourceStoreUseRecordManageInfo.conditions.endTime = '';
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
            _listResourceStoreUseRecords: function (_page, _rows) {
                vc.component.resourceStoreUseRecordManageInfo.conditions.page = _page;
                vc.component.resourceStoreUseRecordManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.resourceStoreUseRecordManageInfo.conditions
                };
                param.params.rsurId = param.params.rsurId.trim();
                param.params.repairId = param.params.repairId.trim();
                param.params.resId = param.params.resId.trim();
                param.params.createUserId = param.params.createUserId.trim();
                param.params.createUserName = param.params.createUserName.trim();
                param.params.resName = param.params.resName.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        vc.component.resourceStoreUseRecordManageInfo.total = _resourceStoreUseRecordManageInfo.total;
                        vc.component.resourceStoreUseRecordManageInfo.records = _resourceStoreUseRecordManageInfo.records;
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreUseRecords = _resourceStoreUseRecordManageInfo.data;
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreUseRecords.forEach((item) => {
                            if (item.resId == '666666') {
                                item.rstName = item.specName = '自定义';
                            }
                        })
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceStoreUseRecordManageInfo.records,
                            dataCount: vc.component.resourceStoreUseRecordManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddResourceStoreUseRecordModal: function () {
                vc.emit('addResourceStoreUseRecord', 'openAddResourceStoreUseRecordModal', {});
            },
            //查询
            _queryResourceStoreUseRecordMethod: function () {
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreUseRecordMethod: function () {
                vc.component.resourceStoreUseRecordManageInfo.conditions.rsurId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.repairId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.resId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.resName = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.createUserId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.createUserName = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.parentRstId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.rstId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.rssId = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.startTime = "";
                vc.component.resourceStoreUseRecordManageInfo.conditions.endTime = "";
                vc.component.resourceStoreUseRecordManageInfo.resourceStoreSonTypes = [];
                vc.component.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = [];
                vc.component._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listResourceStoreTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function () {
                vc.component.resourceStoreUseRecordManageInfo.conditions.rstId = '';
                vc.component.resourceStoreUseRecordManageInfo.resourceStoreSonTypes = [];
                if (vc.component.resourceStoreUseRecordManageInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: vc.component.resourceStoreUseRecordManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                vc.component.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = [];
                vc.component.resourceStoreUseRecordManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.resourceStoreUseRecordManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        vc.component.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = _resourceStoreUseRecordManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.resourceStoreUseRecordManageInfo.moreCondition) {
                    vc.component.resourceStoreUseRecordManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceStoreUseRecordManageInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=resourceStoreUseRecordManage&' + vc.objToGetParam($that.resourceStoreUseRecordManageInfo.conditions));
            }
        }
    });
})(window.vc);