(function (vc) {
    vc.extends({
        data: {
            viewVisitInfo: {
                index: 0,
                flowComponent: 'visit',
                needShowAddAppButton: 'true',
                vName: '',
                visitGender: '',
                phoneNumber: '',
                visitTime: '',
                departureTime: '',
                carNum: '',
                entourage: '',
                paId: '',
                psId: '',
                num: '',
                parkingSpaceNum: ''
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadAppInfoData();
        },
        _initEvent: function () {
            vc.on('viewVisitInfo', 'addNewVisit', function (_app) {
                vc.component._clearVisitInfo();
                vc.copyObject(_app, vc.component.viewVisitInfo);
                vc.emit('addVisitSpace', 'notify', vc.component.viewVisitInfo);
            });
            vc.on('viewVisitInfo', 'onIndex', function (_index) {
                vc.component.viewAppInfo.index = _index;
            });
            vc.on('viewVisitInfo', 'clearInfo', function () {
                vc.component._clearVisitInfo();
            });
        },
        methods: {
            _openSelectAppInfoModel() {
                alert("打开查询访客模态框");
                // vc.emit('chooseApp','openChooseAppModel',{});
            },
            _openAddVisitInfoModel() {
                vc.emit('addVisit', 'openAddVisitAppModal', {});
                // $("#addNewVisitModel").model("show");
            },
            _loadAppInfoData: function () {
            },
            _clearVisitInfo: function () {
                vc.component.viewVisitInfo.vName = '';
                vc.component.viewVisitInfo.visitGender = '';
                vc.component.viewVisitInfo.phoneNumber = '';
                vc.component.viewVisitInfo.visitTime = '';
                vc.component.viewVisitInfo.departureTime = '';
                vc.component.viewVisitInfo.carNum = '';
                vc.component.viewVisitInfo.entourage = '';
                vc.component.viewVisitInfo.paId = '';
                vc.component.viewVisitInfo.psId = '';
                vc.component.viewVisitInfo.num = '';
                vc.component.viewVisitInfo.parkingSpaceNum = '';
            }
        }
    });
})(window.vc);