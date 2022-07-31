(function (vc, vm) {

    vc.extends({
        data: {
            reSubmitComplaintInfo: {
                msg: "",
                complaintId: '',
                taskId: '',
                state:'',
                remark:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('ReSubmitComplaint', 'openReSubmitComplaintModal', function (_params) {

                vc.copyObject(_params, vc.component.reSubmitComplaintInfo);
                $('#reSubmitComplaintModel').modal('show');

            });
        },
        methods: {
            reSubmitComplaint: function () {
                $that.reSubmitComplaintInfo.communityId = vc.getCurrentCommunity().communityId;
                //发送get请求
                vc.http.post('myAuditComplaints',
                    'audit',
                    JSON.stringify( $that.reSubmitComplaintInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        vc.toast("处理成功");
                        vc.emit('myAuditComplaints', 'list',{});
                        $('#reSubmitComplaintModel').modal('hide');
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            closeReSubmitComplaintModel: function () {
                $('#reSubmitComplaintModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
