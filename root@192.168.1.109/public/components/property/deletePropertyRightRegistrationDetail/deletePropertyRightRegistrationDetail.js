(function (vc, vm) {
    vc.extends({
        data: {
            deletePropertyRightRegistrationDetailInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deletePropertyRightRegistrationDetail', 'openDeletePropertyRightRegistrationDetailModal', function (_params) {
                vc.component.deletePropertyRightRegistrationDetailInfo = _params;
                $('#deletePropertyRightRegistrationDetailModel').modal('show');
            });
        },
        methods: {
            deletePropertyRightRegistrationDetail: function () {
                vc.component.deletePropertyRightRegistrationDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'propertyRightRegistrationDetail.deletePropertyRightRegistrationDetail',
                    JSON.stringify(vc.component.deletePropertyRightRegistrationDetailInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePropertyRightRegistrationDetailModel').modal('hide');
                            vc.emit('listPropertyRightRegistrationDetail', 'listPropertyRightRegistrationDetails', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeletePropertyRightRegistrationDetailModel: function () {
                $('#deletePropertyRightRegistrationDetailModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
