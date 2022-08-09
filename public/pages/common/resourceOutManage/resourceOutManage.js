/**
 //入库
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceOutManageInfo: {
                resourceOuts: [],
                applyOrderId: '',
                taskId: '',
                resOrderType: '',
                purchaseApplyDetailVo: [],
            }
        },
        _initMethod: function() {
            vc.component.resourceOutManageInfo.applyOrderId = vc.getParam('applyOrderId');
            vc.component.resourceOutManageInfo.resOrderType = vc.getParam('resOrderType');
            vc.component.resourceOutManageInfo.taskId = vc.getParam('taskId');
            vc.component._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {},
        methods: {
            _listPurchaseApply: function(_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyOrderId: vc.component.resourceOutManageInfo.applyOrderId,
                        resOrderType: vc.component.resourceOutManageInfo.resOrderType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.copyObject(_purchaseApply[0], vc.component.resourceOutManageInfo);
                        $that.resourceOutManageInfo.purchaseApplyDetailVo.forEach(function(item) {
                            item.purchaseQuantity = '';
                            item.price = '';
                            item.purchaseRemark = '';
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDetailResourceEnterModel: function(_resourceOut) {
                vc.jumpToPage("/#/pages/common/resourceOutDetail?applyOrderId=" + _resourceOut.applyOrderId + "&resOrderType=10000");
            },
            _openResourceEnterDetailManageModel: function(_resourceOut) {
                vc.jumpToPage("/#/pages/common/resourceOutDetailManage?applyOrderId=" + _resourceOut.applyOrderId + "&resOrderType=10000");
            },
            _queryResourceEnterMethod: function() {
                vc.component._listResourceEnters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.resourceOutManageInfo.moreCondition) {
                    vc.component.resourceOutManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceOutManageInfo.moreCondition = true;
                }
            },
            _queryInspectionPlanMethod: function() {
                vc.component._listResourceEnters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddResourceQuantityModel: function() {},
            _submit: function() {
                let _flag = true;
                //校验 是否填写正确
                $that.resourceOutManageInfo.purchaseApplyDetailVo.forEach(function(item) {
                    if (!item.hasOwnProperty("purchaseQuantity") || parseInt(item.purchaseQuantity) <= 0) {
                        vc.toast('采购数量未填写')
                        return;
                    }
                    item.purchaseQuantity = parseInt(item.purchaseQuantity);
                    if (item.purchaseQuantity > parseInt(item._stock)) {
                        vc.toast('库存不足');
                        _flag = false;
                        return;
                    }
                });
                if (_flag == false) {
                    return;
                }
                vc.http.apiPost(
                    '/collection/resourceOut',
                    JSON.stringify($that.resourceOutManageInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //处理审核通过
                            $that._finishAuditOrder();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _finishAuditOrder: function() {
                let _auditInfo = {
                    taskId: $that.resourceOutManageInfo.taskId,
                    applyOrderId: $that.resourceOutManageInfo.applyOrderId,
                    state: '1100',
                    remark: '出库完成',
                    noticeState: '1002'
                };
                //发送get请求
                vc.http.apiPost('/complaint.auditComplaint',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        vc.toast("处理成功");
                        vc.goBack();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
        }
    });
})(window.vc);