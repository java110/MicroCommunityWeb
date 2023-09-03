(function (vc) {
    vc.extends({
        data: {
            updateStoreStateInfo: {
                storeId: '',
                state: '',
                stateName: ''
            }
        },
        _initEvent: function () {
            vc.on('updateStoreState', 'open', function (_storeInfo) {
                vc.copyObject(_storeInfo, $that.updateStoreStateInfo)
                $('#updateStoreStateModel').modal('show');
            });
        },
        methods: {
            closeDeleteStaffModel: function () {
                $that.updateStoreStateInfo = {
                    storeId: '',
                    state: '',
                    stateName: ''
                }
                $('#updateStoreStateModel').modal('hide');
            },
            _updateStoreState: function () {
                vc.http.apiPost(
                    '/storeApi/updateStoreState',
                    JSON.stringify($that.updateStoreStateInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        //关闭model
                        let _result = JSON.parse(json);
                        vc.toast(_result.msg);
                        $('#updateStoreStateModel').modal('hide');
                        vc.emit('listPropertyManage', 'listListProperty', {})
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.updateStoreStateInfo.errorInfo = errInfo;
                    });
            }
        }
    });
})(window.vc);