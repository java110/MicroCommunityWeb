/**
 采购组件
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            purchaseApplyManageInfo: {
                purchaseApplys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    state: '',
                    applyOrderId: '',
                    userName: '',
                    resOrderType: '10000',
                    resName: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('purchase_apply', "state", function (_data) {
                $that.purchaseApplyManageInfo.states = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.purchaseApplyManageInfo.states.push(item);
                });
            });
            vc.component._initDate();
        },
        _initEvent: function () {
            vc.on('purchaseApplyManage', 'listPurchaseApply', function (_param) {
                $that._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listPurchaseApplys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $('.startTime').datetimepicker({
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
                        vc.component.purchaseApplyManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.purchaseApplyManageInfo.conditions.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.purchaseApplyManageInfo.conditions.endTime = value;
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
            _listPurchaseApplys: function (_page, _rows) {
                $that.purchaseApplyManageInfo.conditions.page = _page;
                $that.purchaseApplyManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.purchaseApplyManageInfo.conditions
                };
                param.params.applyOrderId = param.params.applyOrderId.trim();
                param.params.state = param.params.state.trim();
                param.params.userName = param.params.userName.trim();
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function (json, res) {
                        let _purchaseApplyManageInfo = JSON.parse(json);
                        $that.purchaseApplyManageInfo.total = _purchaseApplyManageInfo.total;
                        $that.purchaseApplyManageInfo.records = _purchaseApplyManageInfo.records;
                        $that.purchaseApplyManageInfo.purchaseApplys = _purchaseApplyManageInfo.purchaseApplys;
                        vc.emit('pagination', 'init', {
                            total: $that.purchaseApplyManageInfo.records,
                            dataCount: $that.purchaseApplyManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //采购申请
            _openAddPurchaseApplyModal: function () {
                vc.emit('viewResourceStoreInfo2', 'setResourcesOut', "10000");
                vc.jumpToPage("/#/pages/common/addPurchaseApply?resOrderType=" + this.purchaseApplyManageInfo.conditions.resOrderType);
            },
            //紧急采购
            _openUrgentPurchaseApplyModal: function () {
                vc.emit('viewResourceStoreInfo4', 'setResourcesOut', "10000");
                vc.jumpToPage("/#/pages/common/urgentPurchaseApplyStep?resOrderType=" + this.purchaseApplyManageInfo.conditions.resOrderType);
            },
            _openDetailPurchaseApplyModel: function (_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=10000");
            },
            _openDeletePurchaseApplyModel: function (_purchaseApply) {
                vc.emit('deletePurchaseApply', 'openDeletePurchaseApplyModal', _purchaseApply);
            },
            //查询
            _queryPurchaseApplyMethod: function () {
                $that._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function () {
                $that.purchaseApplyManageInfo.conditions.applyOrderId = "";
                $that.purchaseApplyManageInfo.conditions.userName = "";
                $that.purchaseApplyManageInfo.conditions.resName = "";
                $that.purchaseApplyManageInfo.conditions.startTime = "";
                $that.purchaseApplyManageInfo.conditions.endTime = "";
                $that._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.purchaseApplyManageInfo.moreCondition) {
                    $that.purchaseApplyManageInfo.moreCondition = false;
                } else {
                    $that.purchaseApplyManageInfo.moreCondition = true;
                }
            },
            _openRunWorkflowImage: function (_purchaseApply) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _purchaseApply.applyOrderId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryInspectionPlanMethod: function () {
                $that._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=purchaseApplyManage&' + vc.objToGetParam($that.purchaseApplyManageInfo.conditions));
            },
            swatchState: function (_item) {
                $that.purchaseApplyManageInfo.conditions.state = _item.statusCd;
                $that._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);