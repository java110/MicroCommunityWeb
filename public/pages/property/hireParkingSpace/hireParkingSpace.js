/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            hireParkingSpaceInfo: {
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                remark: "",
                startTime: '',
                endTime: '',
                leaseType: 'H',
                carAttrs: '',
                attrs: [],
                value: '',
                ownerId: '',
                ownerName: '',
                psId: '',
                psName: '',
                carTypes: [
                    {
                        key: '9901',
                        value: '家用小汽车'
                    },
                    {
                        key: '9902',
                        value: '客车'
                    },
                    {
                        key: '9903',
                        value: '货车'
                    }
                ]
            }
        },
        _initMethod: function () {
            let _ownerId = vc.getParam('ownerId');
            if (_ownerId) {
                $that.hireParkingSpaceInfo.ownerId = _ownerId;
                $that.hireParkingSpaceInfo.ownerName = vc.getParam('ownerName');
            }
            vc.getDict('owner_car', "car_type", function (_data) {
                vc.component.hireParkingSpaceInfo.carTypes = _data;
            });
            vc.initDate('addStartTime', function (_value) {
                $that.hireParkingSpaceInfo.startTime = _value;
            });
            vc.initDate('addEndTime', function (_value) {
                $that.hireParkingSpaceInfo.endTime = _value;
            });
            $that._loadCarAttrSpec();
        },
        _initEvent: function () {
            vc.on('hireParkingSpace', 'chooseOwner', function (_owner) {
                $that.hireParkingSpaceInfo.ownerName = _owner.name;
                $that.hireParkingSpaceInfo.ownerId = _owner.ownerId;
            });
            vc.on('hireParkingSpace', 'chooseParkingSpace', function (_parkingSpace) {
                vc.copyObject(_parkingSpace, vc.component.hireParkingSpaceInfo);
                $that.hireParkingSpaceInfo.psName = _parkingSpace.areaNum + "-" + _parkingSpace.num;
            });
        },
        methods: {
            addCarValidate: function () {
                return vc.validate.validate({
                    hireParkingSpaceInfo: vc.component.hireParkingSpaceInfo
                }, {
                    'hireParkingSpaceInfo.carNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,12",
                            errInfo: "车牌号不正确"
                        }
                    ],
                    'hireParkingSpaceInfo.carBrand': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "车品牌超出限制"
                        }
                    ],
                    'hireParkingSpaceInfo.carType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车类型不能为空"
                        }
                    ],
                    'hireParkingSpaceInfo.carColor': [
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车颜色超出限制"
                        }
                    ]
                });
            },
            _loadCarAttrSpec: function () {
                $that.hireParkingSpaceInfo.attrs = [];
                vc.getAttrSpec('owner_car_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.hireParkingSpaceInfo.attrs.push(item);
                        }
                        console.log('attrs : ', $that.hireParkingSpaceInfo.attrs);
                    });
                });
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                });
            },
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            openSearchParkingSpaceModel() {
                vc.emit('searchParkingSpace', 'openSearchParkingSpaceModel', {});
            },
            _changeLeaseType: function () {
                $that.hireParkingSpaceInfo.startTime = '';
                $that.hireParkingSpaceInfo.endTime = '';
            },
            saveAddCarInfo: function () {
                // 验证attr必填项
                let msg = '';
                vc.component.hireParkingSpaceInfo.attrs.forEach((item) => {
                    if (item.required == 'Y' && item.value == "") {
                        msg = item.specHoldplace;
                    }
                })
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                if (!vc.component.addCarValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.hireParkingSpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/owner.saveOwnerCar',
                    JSON.stringify($that.hireParkingSpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        json = JSON.parse(json);
                        if (res.status == 200 && json.code == 0) {
                            vc.toast("请记得收费哦！");
                            //关闭model
                            //vc.jumpToPage("/#/pages/property/listOwnerCar");
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);