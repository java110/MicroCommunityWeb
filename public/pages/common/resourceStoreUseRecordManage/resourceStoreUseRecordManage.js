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
                states: [],
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
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('resource_store_use_record', "state", function (_data) {
                $that.resourceStoreUseRecordManageInfo.states = _data;
            });
            $that._initDate();
            $that._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('resourceStoreUseRecordManage', 'listResourceStoreUseRecord', function (_param) {
                $that._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listResourceStoreUseRecords(_currentPage, DEFAULT_ROWS);
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
                        $that.resourceStoreUseRecordManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        $that.resourceStoreUseRecordManageInfo.conditions.endTime = value;
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
                $that.resourceStoreUseRecordManageInfo.conditions.page = _page;
                $that.resourceStoreUseRecordManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.resourceStoreUseRecordManageInfo.conditions
                };
                param.params.rsurId = param.params.rsurId.trim();
                param.params.repairId = param.params.repairId.trim();
                param.params.resId = param.params.resId.trim();
                param.params.createUserId = param.params.createUserId.trim();
                param.params.createUserName = param.params.createUserName.trim();
                param.params.resName = param.params.resName.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreUseRecords',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        $that.resourceStoreUseRecordManageInfo.total = _resourceStoreUseRecordManageInfo.total;
                        $that.resourceStoreUseRecordManageInfo.records = _resourceStoreUseRecordManageInfo.records;
                        $that.resourceStoreUseRecordManageInfo.resourceStoreUseRecords = _resourceStoreUseRecordManageInfo.data;
                        $that.resourceStoreUseRecordManageInfo.resourceStoreUseRecords.forEach((item) => {
                            if (item.resId == '666666') {
                                item.rstName = item.specName = '自定义';
                            }
                        })
                        vc.emit('pagination', 'init', {
                            total: $that.resourceStoreUseRecordManageInfo.records,
                            dataCount: $that.resourceStoreUseRecordManageInfo.total,
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
                $that._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreUseRecordMethod: function () {
                $that.resourceStoreUseRecordManageInfo.conditions.rsurId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.repairId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.resId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.resName = "";
                $that.resourceStoreUseRecordManageInfo.conditions.createUserId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.createUserName = "";
                $that.resourceStoreUseRecordManageInfo.conditions.parentRstId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.rstId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.rssId = "";
                $that.resourceStoreUseRecordManageInfo.conditions.startTime = "";
                $that.resourceStoreUseRecordManageInfo.conditions.endTime = "";
                $that.resourceStoreUseRecordManageInfo.resourceStoreSonTypes = [];
                $that.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = [];
                $that.resourceStoreUseRecordManageInfo.conditions.state = "";
                $that._listResourceStoreUseRecords(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listResourceStoreTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId:'0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.resourceStoreUseRecordManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function () {
                $that.resourceStoreUseRecordManageInfo.conditions.rstId = '';
                $that.resourceStoreUseRecordManageInfo.resourceStoreSonTypes = [];
                if ($that.resourceStoreUseRecordManageInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.resourceStoreUseRecordManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.resourceStoreUseRecordManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                $that.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = [];
                $that.resourceStoreUseRecordManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.resourceStoreUseRecordManageInfo.conditions.rstId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _resourceStoreUseRecordManageInfo = JSON.parse(json);
                        $that.resourceStoreUseRecordManageInfo.resourceStoreSpecifications = _resourceStoreUseRecordManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.resourceStoreUseRecordManageInfo.moreCondition) {
                    $that.resourceStoreUseRecordManageInfo.moreCondition = false;
                } else {
                    $that.resourceStoreUseRecordManageInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=resourceStoreUseRecordManage&' + vc.objToGetParam($that.resourceStoreUseRecordManageInfo.conditions));
            }
        }
    });
})(window.vc);