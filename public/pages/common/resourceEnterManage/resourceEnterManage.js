/**
    //入库
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceEnterManageInfo: {
                resourceEnters: [],
                applyOrderId: '',
                taskId:'',
                resOrderType: '',
                purchaseApplyDetailVo: [],
            }
        },
        _initMethod: function () {
            vc.component.resourceEnterManageInfo.applyOrderId = vc.getParam('applyOrderId');
            vc.component.resourceEnterManageInfo.resOrderType = vc.getParam('resOrderType');
            vc.component.resourceEnterManageInfo.taskId = vc.getParam('taskId');
            vc.component._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

        },
        methods: {
            _listPurchaseApply: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyOrderId: vc.component.resourceEnterManageInfo.applyOrderId,
                        resOrderType: vc.component.resourceEnterManageInfo.resOrderType,
                    }
                };

                //发送get请求
                vc.http.get('purchaseApplyManage',
                    'list',
                    param,
                    function (json, res) {
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.copyObject(_purchaseApply[0], vc.component.resourceEnterManageInfo);
                        $that.resourceEnterManageInfo.purchaseApplyDetailVo.forEach(function (item) {
                            item.purchaseQuantity = '';
                            item.price = '';
                            item.purchaseRemark = '';

                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDetailResourceEnterModel: function (_resourceEnter) {
                vc.jumpToPage("/admin.html#/pages/common/resourceEnterDetail?applyOrderId=" + _resourceEnter.applyOrderId + "&resOrderType=10000");
            },
            _openResourceEnterDetailManageModel: function (_resourceEnter) {
                vc.jumpToPage("/admin.html#/pages/common/resourceEnterDetailManage?applyOrderId=" + _resourceEnter.applyOrderId + "&resOrderType=10000");
            },
            _queryResourceEnterMethod: function () {
                vc.component._listResourceEnters(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.resourceEnterManageInfo.moreCondition) {
                    vc.component.resourceEnterManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceEnterManageInfo.moreCondition = true;
                }
            },
            _queryInspectionPlanMethod: function () {
                vc.component._listResourceEnters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddResourceQuantityModel: function () {

            },
            _submit: function () {
                //校验 是否填写正确
                $that.resourceEnterManageInfo.purchaseApplyDetailVo.forEach(function (item) {

                    if (!vc.notNull(item.purchaseQuantity)) {
                        vc.toast('采购数量未填写')
                        return;
                    }
                    if (!vc.notNull(item.price)) {
                        vc.toast('单价未填写')
                        return;
                    }
                });

                vc.http.apiPost(
                    '/purchase/resourceEnter',
                    JSON.stringify($that.resourceEnterManageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //处理审核通过
                            $that._finishAuditOrder();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            _finishAuditOrder:function(){
                let _auditInfo = {
                    taskId: $that.resourceEnterManageInfo.taskId,
                    applyOrderId: $that.resourceEnterManageInfo.applyOrderId,
                    state:'1100',
                    remark:'采购入库完成'
                };
                //发送get请求
                vc.http.post('myAuditOrders',
                    'audit',
                    JSON.stringify(_auditInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        vc.toast("处理成功");
                        vc.goBack();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },


        }
    });
})(window.vc);
