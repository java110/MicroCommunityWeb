(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseContract: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            contractChangeAssetsInfo: {
                rooms: [],
                contractId: '',
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
        },
        _initEvent: function () {
            vc.on('contractChangeAssets', 'contractInfo', function (param) {
                $that.contractChangeAssetsInfo.contractId = param.contractId;
                $that._loadContractRooms();
            })
            vc.on('contractChangeAssets', 'chooseRoom', function (param) {
                $that.contractChangeAssetsInfo.rooms.push(param);
            })
        },
        methods: {
            clearcontractChangeAssetsInfo: function () {
                vc.component.contractChangeAssetsInfo = {
                    rooms: [],
                };
            },
            _selectRoom: function () {
                vc.emit('searchRoom', 'openSearchRoomModel', {})
            },
            _openDelRoomModel: function (_room) {
                let _tmpRooms = [];
                $that.contractChangeAssetsInfo.rooms.forEach(item => {
                    if (item.roomId != _room.roomId) {
                        _tmpRooms.push(item);
                    }
                });
                $that.contractChangeAssetsInfo.rooms = _tmpRooms;
            },
            _loadContractRooms: function () {
                let param = {
                    params: {
                        contractId: vc.component.contractChangeAssetsInfo.contractId,
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractRoom',
                    param,
                    function (json, res) {
                        var _contractTFile = JSON.parse(json);
                        vc.component.contractChangeAssetsInfo.rooms = _contractTFile.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);
