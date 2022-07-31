(function (vc) {

    vc.extends({
        data: {
            ownerExitRoomInfo: {
                name: '',
                link: '',
                ownerId: '',
                idCard: '',
                rooms: [],
                selectRooms: [],
                batchFees: [],
                fees: [],
                quan: false
            }
        },
        watch: { // 监视双向绑定的数据数组
            'ownerExitRoomInfo.selectRooms': {
                handler() { // 数据数组有变化将触发此函数
                    if (vc.component.ownerExitRoomInfo.rooms.length == vc.component.ownerExitRoomInfo.selectRooms.length) {
                        vc.component.ownerExitRoomInfo.quan = true;
                    } else {
                        vc.component.ownerExitRoomInfo.quan = false;
                    }
                    $that._dealFees();
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

            vc.on('ownerExitRoom', 'chooseOwner', function (param) {
                vc.copyObject(param, $that.ownerExitRoomInfo);
                $that.listRoom();
            })

            vc.on('ownerExitRoom', 'notifyFeeConfig', function (fee) {
                $that.ownerExitRoomInfo.fees.push(fee);
            })
        },
        methods: {
            ownerExitRoomValidate() {
                return vc.validate.validate({
                    ownerExitRoomInfo: vc.component.ownerExitRoomInfo
                }, {
                    'ownerExitRoomInfo.ownerId': [{
                        limit: "required",
                        param: "",
                        errInfo: "业主不能为空"
                    }
                    ],
                });
            },
            saveOwnerExitRoomInfo: function () {
                if (!vc.component.ownerExitRoomValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                let _selectRoom = $that.ownerExitRoomInfo.selectRooms;
                if(!_selectRoom || _selectRoom.length <1){
                    vc.toast('未选择房屋');
                    return ;
                }

                let _fees = $that.ownerExitRoomInfo.fees;
                let _feeFlag = false;
                _fees.forEach(_feeItem =>{
                    if(_feeItem.state == '2008001'){
                        _feeFlag = true;
                    }
                });
                if(_feeFlag){
                    vc.toast('房屋还存在费用，请先在业务受理处理费用');
                    return ;
                }

                vc.component.ownerExitRoomInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/owner.ownerExitRoom',
                    JSON.stringify(vc.component.ownerExitRoomInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that._goBack();
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddHandoverInfo: function () {
                vc.component.ownerExitRoomInfo = {
                    name: '',
                    link: '',
                    remark: '',
                    ownerId: '',
                    idCard: '',
                    rooms: [],
                    fees: [],
                    quan: false
                };
            },
            _goBack: function () {
                vc.goBack();
            },
            _selectOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            listRoom: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        ownerId: $that.ownerExitRoomInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        $that.ownerExitRoomInfo.rooms = listRoomData.rooms;
                        listRoomData.rooms.forEach(_room =>{
                            $that.ownerExitRoomInfo.selectRooms.push(_room.roomId);
                        })
                        $that._loadBatchFees();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _createFeeOrder: function () {
                vc.emit('selectFeeConfig', 'openSelectFeeConfigModal', {
                    call: 'ownerExitRoom'
                })
            },
            _openDelFeeModel: function (_room) {
                let _tmpFees = [];
                $that.ownerExitRoomInfo.fees.forEach(item => {
                    if (item.configId != _room.configId) {
                        _tmpFees.push(item);
                    }
                });
                $that.ownerExitRoomInfo.fees = _tmpFees;
            },
            _loadBatchFees: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerExitRoomInfo.ownerId,
                        payerObjType: '3333',
                        state: '2008001'
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        let _fees = _json.fees;
                        if (!_fees || _fees.length < 1) {
                            return;
                        }
                        $that.ownerExitRoomInfo.batchFees = _fees;
                        $that._dealFees();
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _dealFees: function () {
                let _selectRooms = $that.ownerExitRoomInfo.selectRooms;
                let _batchFees = $that.ownerExitRoomInfo.batchFees;
                $that.ownerExitRoomInfo.fees = [];
                _selectRooms.forEach(item => {
                    _batchFees.forEach(itemFee => {
                        if (item == itemFee.payerObjId) {
                            $that.ownerExitRoomInfo.fees.push(itemFee);
                        }
                    })
                })
            },
            checkAll: function (e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.ownerExitRoomInfo.selectRooms.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.ownerExitRoomInfo.selectRooms = [];
                }
                $that._dealFees()
            }
        }
    });

})(window.vc);