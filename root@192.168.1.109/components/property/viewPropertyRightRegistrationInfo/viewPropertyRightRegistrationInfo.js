/**
 房屋产权 组件
 **/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            viewPropertyRightRegistrationInfo: {
                index: 0,
                flowComponent: 'viewPropertyRightRegistrationInfo',
                roomId: '',
                name: '',
                link: '',
                idCard: '',
                address: '',

            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadPropertyRightRegistrationInfoData();
        },
        _initEvent: function () {
            vc.on('viewPropertyRightRegistrationInfo', 'choosePropertyRightRegistration', function (_app) {
                vc.copyObject(_app, vc.component.viewPropertyRightRegistrationInfo);
                vc.emit($props.callBackListener, $props.callBackFunction, vc.component.viewPropertyRightRegistrationInfo);
            });

            vc.on('viewPropertyRightRegistrationInfo', 'onIndex', function (_index) {
                vc.component.viewPropertyRightRegistrationInfo.index = _index;
            });

        },
        methods: {

            _openSelectPropertyRightRegistrationInfoModel() {
                vc.emit('choosePropertyRightRegistration', 'openChoosePropertyRightRegistrationModel', {});
            },
            _openAddPropertyRightRegistrationInfoModel() {
                vc.emit('addPropertyRightRegistration', 'openAddPropertyRightRegistrationModal', {});
            },
            _loadPropertyRightRegistrationInfoData: function () {

            }
        }
    });

})(window.vc);
