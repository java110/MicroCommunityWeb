(function (vc, vm) {
    vc.extends({
        data: {
            deleteVisitInfo: {}
        },
        _initEvent: function() {
            vc.on('deleteVisit', 'openVisitModel', function(_visitInfo) {
                vc.component.deleteVisitInfo = _visitInfo;
                $('#deleteVisitModel').modal('show');
            });
        },
        methods: {
            closeDeleteVisitModel: function() {
                $('#deleteVisitModel').modal('hide');
            },
            deleteVisit: function() {

                vc.component.deleteVisitInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/visit.deleteVisit',
                    JSON.stringify(vc.component.deleteVisitInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteVisitModel').modal('hide');
                            vc.emit('appManage', 'listApp', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);