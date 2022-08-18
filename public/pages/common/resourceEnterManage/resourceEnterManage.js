/**
 *入库
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceEnterManageInfo: {
                resourceEnters: [],
                applyOrderId: '',
                taskId: '',
                resOrderType: '',
                purchaseApplyDetailVo: [],
                resourceSuppliers: [],
                selectResIds: [],
            }
        },
        _initMethod: function() {
            vc.component.resourceEnterManageInfo.applyOrderId = vc.getParam('applyOrderId');
            vc.component.resourceEnterManageInfo.resOrderType = vc.getParam('resOrderType');
            vc.component.resourceEnterManageInfo.taskId = vc.getParam('taskId');
            vc.component._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._loadResourceSuppliers();
        },
        _initEvent: function() {},
        methods: {
            _listPurchaseApply: function(_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyOrderId: vc.component.resourceEnterManageInfo.applyOrderId,
                        resOrderType: vc.component.resourceEnterManageInfo.resOrderType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.copyObject(_purchaseApply[0], vc.component.resourceEnterManageInfo);
                        $that.resourceEnterManageInfo.purchaseApplyDetailVo.forEach(function(item) {
                            item.purchaseQuantity = '';
                            item.price = '';
                            item.purchaseRemark = '';
                            item.rsId = '';
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadResourceSuppliers() {
                var param = {
                    params: { page: 1, row: 50 }
                };
                //发送get请求
                vc.http.apiGet('resourceSupplier.listResourceSuppliers',
                    param,
                    function(json, res) {
                        var _resourceSupplierManageInfo = JSON.parse(json);
                        vc.component.resourceEnterManageInfo.resourceSuppliers = _resourceSupplierManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDetailResourceEnterModel: function(_resourceEnter) {
                vc.jumpToPage("/#/pages/common/resourceEnterDetail?applyOrderId=" + _resourceEnter.applyOrderId + "&resOrderType=10000");
            },
            _openResourceEnterDetailManageModel: function(_resourceEnter) {
                vc.jumpToPage("/#/pages/common/resourceEnterDetailManage?applyOrderId=" + _resourceEnter.applyOrderId + "&resOrderType=10000");
            },
            _queryResourceEnterMethod: function() {
                vc.component._listResourceEnters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.resourceEnterManageInfo.moreCondition) {
                    vc.component.resourceEnterManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceEnterManageInfo.moreCondition = true;
                }
            },
            _queryInspectionPlanMethod: function() {
                vc.component._listResourceEnters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddResourceQuantityModel: function() {},
            _submit: function() {
                //校验 是否填写正确
                let msg = '';
                let _tmpPurchaseApplyDetailVo = [];
                $that.resourceEnterManageInfo.purchaseApplyDetailVo.forEach(function(item) {
                    $that.resourceEnterManageInfo.selectResIds.forEach(selectItem => {
                        if (item.resId == selectItem) {
                            _tmpPurchaseApplyDetailVo.push(item);
                        }
                    })
                });
                if (_tmpPurchaseApplyDetailVo.length < 1) {
                    vc.toast('请选择入库物品')
                    return;
                }
                _tmpPurchaseApplyDetailVo.forEach(function(item) {
                    console.log(item);
                    if (!item.hasOwnProperty("purchaseQuantity") || !item.purchaseQuantity || parseInt(item.purchaseQuantity) < 0) {
                        msg = '采购数量未填写';
                        return;
                    }
                    item.purchaseQuantity = parseInt(item.purchaseQuantity);
                    if (!item.hasOwnProperty("price") || !item.price || parseFloat(item.price) <= 0) {
                        msg = '单价未填写';
                        return;
                    }
                    item.price = parseFloat(item.price);
                });
                if (msg != '') {
                    vc.toast(msg);
                    return;
                }
                $that.resourceEnterManageInfo.purchaseApplyDetailVo = _tmpPurchaseApplyDetailVo;
                vc.http.apiPost(
                    '/purchase/resourceEnter',
                    JSON.stringify($that.resourceEnterManageInfo), {
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
                    taskId: $that.resourceEnterManageInfo.taskId,
                    applyOrderId: $that.resourceEnterManageInfo.applyOrderId,
                    state: '1100',
                    remark: '采购入库完成',
                    noticeState: '1002'
                };
                //发送get请求
                vc.http.apiPost('/purchaseApply.auditApplyOrder',
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
            checkAll: function(e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.resourceEnterManageInfo.selectResIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.resourceEnterManageInfo.selectResIds = [];
                }
            },
        }
    });
})(window.vc);