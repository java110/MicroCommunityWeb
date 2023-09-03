(function (vc, vm) {
    vc.extends({
        data: {
            deleteAdvertInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAdvert', 'openDeleteAdvertModal', function (_params) {
                vc.component.deleteAdvertInfo = _params;
                $('#deleteAdvertModel').modal('show');
            });
        },
        methods: {
            deleteAdvert: function () {
                vc.http.apiPost(
                    '/advert.deleteAdvert',
                    JSON.stringify(vc.component.deleteAdvertInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteAdvertModel').modal('hide');
                            vc.emit('advertManage', 'listAdvert', {});
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteAdvertModel: function () {
                $('#deleteAdvertModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
