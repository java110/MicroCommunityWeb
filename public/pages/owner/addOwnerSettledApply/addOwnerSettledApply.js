(function (vc) {

    vc.extends({
        data: {
            addOwnerSettledApplyInfo: {
                applyId: '',
                ownerId: '',
                ownerName:'',
                remark: '',
                rooms: [],
                audit: {
                    assignee:'',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
            }
        },
        _initMethod: function () {
            $that._listOwnerSettledSettings();

        },
        _initEvent: function () {
            vc.on('addOwnerSettledApply', 'openAddOwnerSettledApplyModal', function () {
                $('#addOwnerSettledApplyModel').modal('show');
            });
            vc.on('addOwnerSettledApply', 'selectRoom', function(param) {
                $that.listRoom(param.roomId);
            });
            vc.on('addOwnerSettledApply', 'chooseOwner', function(param) {
                $that.addOwnerSettledApplyInfo.ownerName = param.name+"("+param.link+")";
                vc.copyObject(param,$that.addOwnerSettledApplyInfo);
            })
        },
        methods: {
            _selectOwner: function() {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            _selectRoom: function() {
                vc.emit('roomTree','openRoomTree',{
                    callName:'addOwnerSettledApply'
                })
            },
            _openDelRoomModel: function(_room) {
                let _tmpRooms = [];
                $that.addOwnerSettledApplyInfo.rooms.forEach(item => {
                    if (item.roomId != _room.roomId) {
                        _tmpRooms.push(item);
                    }
                });
                $that.addOwnerSettledApplyInfo.rooms = _tmpRooms;
            },
            listRoom: function(_roomId) {
                let param = {
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
                            vc.toast('房屋不是未销售状态');
                            return;
                        }
                        room.startTime='';
                        room.endTime='';
                        $that.addOwnerSettledApplyInfo.rooms.push(room);
                        setTimeout(function(){
                            vc.initDate('startTime_'+room.roomId,function(_value){
                                room.startTime = _value
                            });
                            vc.initDate('endTime_'+room.roomId,function(_value){
                                room.endTime = _value
                            });
                        },1000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            addOwnerSettledApplyValidate() {
                return vc.validate.validate({
                    addOwnerSettledApplyInfo: vc.component.addOwnerSettledApplyInfo
                }, {
                    'addOwnerSettledApplyInfo.ownerId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "业主不能超过30"
                        },
                    ],
                    'addOwnerSettledApplyInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明'不能超过200"
                        },
                    ],

                });
            },
            saveOwnerSettledApplyInfo: function () {
                if (!vc.component.addOwnerSettledApplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addOwnerSettledApplyInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/ownerSettled.saveOwnerSettledApply',
                    JSON.stringify(vc.component.addOwnerSettledApplyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadStaffOrg: function(_flowId) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryFirstAuditStaff',
                    param,
                    function(json, res) {
                        var _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data[0], $that.addOwnerSettledApplyInfo.audit);
                        if(!_data[0].assignee.startsWith('-')){
                            $that.addOwnerSettledApplyInfo.audit.staffId = $that.addOwnerSettledApplyInfo.audit.assignee;
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function() {
                //组件会冲突 手工 初始化下
                vc.emit('orgTreeShow','refreshTree',{});
                vc.emit('selectStaff', 'openStaff', $that.addOwnerSettledApplyInfo.audit);
            },
            _listOwnerSettledSettings: function (_page, _rows) {

                let param = {
                    params: {
                        page:1,
                        row:1,
                        communityId:vc.getCurrentCommunity().communityId,
                        auditWay:'Y'
                    }
                };

                //发送get请求
                vc.http.apiGet('/ownerSettled.listOwnerSettledSetting',
                    param,
                    function (json, res) {
                        let _data = JSON.parse(json);
              
                        if(_data.data && _data.data.length>0){
                            $that._loadStaffOrg(_data.data[0].flowId);
                        } ;
                      
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
