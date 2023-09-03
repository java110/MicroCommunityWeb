/**
 *入库
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseEnterInfo: {
                resourceStores: [],
                applyId: '',
                taskId: '',
                resourceSuppliers: [],
                selectResIds: [],
            }
        },
        _initMethod: function () {
            $that.allocationStorehouseEnterInfo.applyId = vc.getParam('applyId');
            $that.allocationStorehouseEnterInfo.taskId = vc.getParam('taskId');
            $that._listAllocationStorehouseApply();
        },
        _initEvent: function () { },
        methods: {
            _listAllocationStorehouseApply: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        applyId: $that.allocationStorehouseEnterInfo.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let _resourceStores = _json.data;
                        $that.allocationStorehouseEnterInfo.resourceStores = _resourceStores;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _submit: function () {
                //校验 是否填写正确
                let msg = '';
                let _tmpResourceStores = [];
                $that.allocationStorehouseEnterInfo.resourceStores.forEach(function (item) {
                    $that.allocationStorehouseEnterInfo.selectResIds.forEach(selectItem => {
                        if (item.resId == selectItem) {
                            _tmpResourceStores.push(item);
                        }
                    })
                });
                if (_tmpResourceStores.length < 1) {
                    vc.toast('请选择调拨物品')
                    return;
                }
                _tmpResourceStores.forEach(function (item) {
                    if (!item.hasOwnProperty("quantity") || !item.quantity || parseInt(item.quantity) < 0) {
                        msg = '数量未填写';
                        return;
                    }
                    item.quantity = parseInt(item.quantity);
                });
                if (msg != '') {
                    vc.toast(msg);
                    return;
                }
                $that.allocationStorehouseEnterInfo.resourceStores = _tmpResourceStores;
                vc.http.apiPost(
                    '/resourceStore.allocationStoreEnter',
                    JSON.stringify($that.allocationStorehouseEnterInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //处理审核通过
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },

            checkAll: function (e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.allocationStorehouseEnterInfo.selectResIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.allocationStorehouseEnterInfo.selectResIds = [];
                }
            },
        }
    });
})(window.vc);