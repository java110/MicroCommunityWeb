(function(vc, vm) {

    vc.extends({
        data: {
            editReserveParamsOpenTimeInfo: {
                openTimes: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editReserveParamsOpenTime', 'openEditReserveParamsModal', function(_params) {
                $that.editReserveParamsOpenTimeInfo.openTimes = _params.openTimes;
                $('#editReserveParamsOpenTimeModel').modal('show');
            });
        },
        methods: {
            _changeOpenTime: function(_item) {
               
                vc.http.apiPost(
                    '/reserve.updateReserveParamsOpenTime',
                    JSON.stringify(_item), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('reserveParamsManage', 'listReserveParams', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },

        }
    });

})(window.vc, window.vc.component);