(function (vc, vm) {
    vc.extends({
        data: {
            bindOwnerShopsInfo: {
                roomId: '',
                roomNum: '',
                shopsName: '',
                ownerId: '',
                ownerName: '',
                tel: '',
                startTime: '',
                endTime: '',
                remark: '',
                communityId: '',
                shopsState: '2006'
            }
        },
        _initMethod: function () {
            vc.initDate('hireStartTime', function (_startTime) {
                $that.bindOwnerShopsInfo.startTime = _startTime;
            });
            vc.initDate('hireEndTime', function (_endTime) {
                $that.bindOwnerShopsInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.bindOwnerShopsInfo.startTime))
                let end = Date.parse(new Date($that.bindOwnerShopsInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.bindOwnerShopsInfo.endTime = '';
                }
            });
        },
        _initEvent: function () {
            vc.on('bindOwnerShops', 'bindOwnerShopsModel', function (_params) {
                $that.refreshAddShopsInfo();
                $that.bindOwnerShopsInfo.roomId = _params.roomId;
                $that.bindOwnerShopsInfo.shopsState = _params.shopsState;
                if (_params.shopsState == '2007') {
                    $that.bindOwnerShopsInfo.startTime = vc.dateFormat(new Date());
                    $that.bindOwnerShopsInfo.endTime = '2037-01-01';
                }
                $that.bindOwnerShopsInfo.shopsName = _params.floorNum + '-' + _params.roomNum;
                $('#bindOwnerShopsModel').modal('show');
                $that.bindOwnerShopsInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            bindOwnerShopsValidate: function () {
                return vc.validate.validate({
                    bindOwnerShopsInfo: $that.bindOwnerShopsInfo
                }, {
                    'bindOwnerShopsInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商铺不能为空"
                        }
                    ],
                    'bindOwnerShopsInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "手机号格式错误"
                        }
                    ],
                    'bindOwnerShopsInfo.ownerName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租户名称不能为空"
                        }
                    ],
                    'bindOwnerShopsInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "起租时间不能为空"
                        }
                    ],
                    'bindOwnerShopsInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "截租时间不能为空"
                        }
                    ],
                    'bindOwnerShopsInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            bindOwnerShops: function () {
                if (!$that.bindOwnerShopsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/room.saveOwnerShops',
                    JSON.stringify($that.bindOwnerShopsInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#bindOwnerShopsModel').modal('hide');
                            vc.emit('shops', 'loadData', {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _shopsLoadOwnerInfo: function () {
                if ($that.bindOwnerShopsInfo.tel == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerTypeCd: 1001,
                        link: $that.bindOwnerShopsInfo.tel
                    }
                }
                //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function (json, res) {
                        let listOwnerData = JSON.parse(json);
                        let owners = listOwnerData.owners;
                        if (listOwnerData.total > 0) {
                            $that.bindOwnerShopsInfo.ownerId = owners[0].ownerId;
                            $that.bindOwnerShopsInfo.ownerName = owners[0].name;
                        } else {
                            $that.bindOwnerShopsInfo.ownerId = '';
                            $that.bindOwnerShopsInfo.ownerName = '';
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshAddShopsInfo: function () {
                $that.bindOwnerShopsInfo = {
                    roomId: '',
                    roomNum: '',
                    shopsName: '',
                    ownerId: '',
                    ownerName: '',
                    tel: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    communityId: '',
                    shopsState: '2006'
                }
            }
        }
    });
})(window.vc, window.$that);