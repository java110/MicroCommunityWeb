(function(vc) {

    vc.extends({
        data: {
            handoverInfo: {
                name: '',
                age: '',
                link: '',
                sex: '',
                ownerTypeCd: '',
                remark: '',
                ownerId: '',
                idCard: '',
                rooms: [],
                fees:[]
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('handover', 'selectRoom', function(param) {
                $that.listRoom(param.roomId);
            })

            vc.on('handover', 'chooseOwner', function(param) {
                vc.copyObject(param,$that.handoverInfo);
            })

            vc.on('handover','notifyFeeConfig',function(fee){
                $that.handoverInfo.fees.push(fee);
            })
        },
        methods: {
            handoverValidate() {
                return vc.validate.validate({
                    handoverInfo: vc.component.handoverInfo
                }, {
                    'handoverInfo.name': [{
                        limit: "required",
                        param: "",
                        errInfo: "姓名不能为空"
                    },
                    {
                        limit: "maxin",
                        param: "2,64",
                        errInfo: "姓名长度必须在2位至64位"
                    },
                ],
                'handoverInfo.age': [{
                        limit: "required",
                        param: "",
                        errInfo: "年龄不能为空"
                    },
                    {
                        limit: "num",
                        param: "",
                        errInfo: "年龄不是有效的数字"
                    },
                ],
                'handoverInfo.sex': [{
                    limit: "required",
                    param: "",
                    errInfo: "性别不能为空"
                }],
                'handoverInfo.link': [{
                    limit: "required",
                    param: "",
                    errInfo: "手机号不能为空"
                }],
                'handoverInfo.idCard': [{
                    limit: "idCard",
                    param: "",
                    errInfo: "身份证格式错误"
                }],
                });
            },
            saveHandoverInfo: function() {
                if (!vc.component.handoverValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.handoverInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/owner.saveHandover',
                    JSON.stringify(vc.component.handoverInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that._goBack();
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddHandoverInfo: function() {
                vc.component.handoverInfo = {
                    name: '',
                    age: '',
                    link: '',
                    sex: '',
                    ownerTypeCd: '',
                    remark: '',
                    ownerId: '',
                    idCard: '',
                    rooms: [],
                    fees:[]
                };
            },
            _goBack: function() {
                vc.goBack();
            },
            _selectRoom: function() {
                vc.emit('roomTree','openRoomTree',{
                    callName:'handover'
                })
            },
            _openDelRoomModel: function(_room) {
                let _tmpRooms = [];
                $that.handoverInfo.rooms.forEach(item => {
                    if (item.roomId != _room.roomId) {
                        _tmpRooms.push(item);
                    }
                });
                $that.handoverInfo.rooms = _tmpRooms;
            },
            _openDelFeeModel:function(){

            },
            _selectOwner: function() {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            listRoom: function(_roomId) {
                var param = {
                    params: {
                        page:1,
                        row:1,
                        roomId:_roomId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        let room = listRoomData.rooms[0];
                        if(room.state != '2002'){
                            vc.toast('房屋不是未销售状态，请先退房');
                            return;
                        }
                        $that.handoverInfo.rooms.push(room);
                        
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _createFeeOrder:function(){
                vc.emit('selectFeeConfig', 'openSelectFeeConfigModal',{
                    call:'handover'
                })
            },
            _openDelFeeModel: function(_room) {
                let _tmpFees = [];
                $that.handoverInfo.fees.forEach(item => {
                    if (item.configId != _room.configId) {
                        _tmpFees.push(item);
                    }
                });
                $that.handoverInfo.fees = _tmpFees;
            },
        }
    });

})(window.vc);