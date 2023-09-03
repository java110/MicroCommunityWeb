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
            $that.resourceOutManageInfo.applyOrderId = vc.getParam('applyOrderId');
            $that.resourceOutManageInfo.resOrderType = vc.getParam('resOrderType');
            $that.resourceOutManageInfo.taskId = vc.getParam('taskId');
            $that._listPurchaseApply(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {},
        methods: {
            _listPurchaseApply: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        applyOrderId: $that.resourceOutManageInfo.applyOrderId,
                        resOrderType: $that.resourceOutManageInfo.resOrderType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function(json, res) {
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.copyObject(_purchaseApply[0], $that.resourceOutManageInfo);
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
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
        }
    });
})(window.vc);