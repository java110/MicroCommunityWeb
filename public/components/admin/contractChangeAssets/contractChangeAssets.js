(function (vc) {

    vc.extends({
        propTypes: {
            emitChooseContract: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            contractChangeAssetsInfo: {
                allNum: '',
                ownerName: '',
                link:'',
                roomId:'',
                objType:'',
                objId:'',
                planType: '3003'
            }
        },
        watch: {
            contractChangeAssetsInfo: {
                deep: true,
                handler: function () {
                    vc.emit($props.emitChooseContract, $props.emitLoadData, $that.contractChangeAssetsInfo);
                }
            }
        },
        _initMethod: function () {
            vc.initDateTime('changeStartTime', function (_value) {
                $that.contractChangeAssetsInfo.startTime = _value;
            });
            vc.initDateTime('changeEndTime', function (_value) {
                $that.contractChangeAssetsInfo.endTime = _value;
            });

        },
        _initEvent: function () {

        },
        methods: {
            clearcontractChangeAssetsInfo: function () {
                vc.component.contractChangeAssetsInfo = {
                    allNum: '',
                    ownerName: '',
                    link:'',
                    roomId:'',
                    objType:'',
                    objId:'',
                    planType: '3003'
                };
            },
            _queryRoom: function () {
                let _allNum = $that.contractChangeAssetsInfo.allNum;
                if (_allNum == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                if (_allNum.split('-').length == 3) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                } else {
                    vc.toast('房屋填写格式错误，请填写 楼栋-单元-房屋格式')
                    return;
                }

                //发送get请求
                vc.http.get('roomCreateFee',
                    'listRoom',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        let _rooms = listRoomData.rooms;

                        if (_rooms.length < 1) {
                            vc.toast('未找到房屋');
                            $that.contractChangeAssetsInfo.allNum = '';
                            return;
                        }

                        $that.contractChangeAssetsInfo.roomId = _rooms[0].roomId;
                        $that.contractChangeAssetsInfo.ownerName = _rooms[0].ownerName;
                        $that.contractChangeAssetsInfo.link = _rooms[0].link;
                        $that.contractChangeAssetsInfo.objType = '3333';
                        $that.contractChangeAssetsInfo.objId = _rooms[0].roomId;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
