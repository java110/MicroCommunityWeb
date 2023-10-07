(function (vc) {
    vc.extends({
        data: {
            addOweFeeCallableInfo: {
                callableWay: '',
                remark: '',
                floorId: '',
                communityId: vc.getCurrentCommunity().communityId,
                configIds: [],
                roomId: '',
                roomIds: [],
                rooms: [],
                feeConfigs: [],
                floors: []
            }
        },
        watch: {
            'addOweFeeCallableInfo.roomIds': {
                deep: true,
                handler: function() {
                    let checkObj = document.querySelectorAll('.all-check'); // 获取所有checkbox项
                    if($that.addOweFeeCallableInfo.roomIds.length < $that.addOweFeeCallableInfo.rooms.length){
                        checkObj[0].checked = false;
                    }else{
                        checkObj[0].checked = true;
                    }
                }
            }
        },
        _initMethod: function () {
           // vc.emit('selectRooms', 'refreshTree', {});
            let _callableWay = vc.getParam('callableWay');
            if(_callableWay){
                $that.addOweFeeCallableInfo.callableWay = _callableWay;
            }
            $that._listFeeConfigs();
            $that._loadOweFeeFloors();
        },
        _initEvent: function () {

            vc.on('addOweFeeCallable', 'notifySelectRooms', function (_selectRooms) {
                let _roomIds = [];
                _selectRooms.forEach(item => {
                    _roomIds.push(item.roomId);
                })
                $that.addOweFeeCallableInfo.roomIds = _roomIds;
            })

        },
        methods: {
            addOweFeeCallableValidate() {
                return vc.validate.validate({
                    addOweFeeCallableInfo: $that.addOweFeeCallableInfo
                }, {
                    'addOweFeeCallableInfo.callableWay': [{
                        limit: "required",
                        param: "",
                        errInfo: "催缴方式不能为空"
                    },],
                });
            },
            _saveOweFeeCallable: function () {
                if (!$that.addOweFeeCallableValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/oweFeeCallable.saveOweFeeCallable',
                    JSON.stringify($that.addOweFeeCallableInfo),
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
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _exportCollectionLetterExcel: function() {
                let param = {
                    params: {
                        communityId:vc.getCurrentCommunity().communityId,
                        pagePath:'dataFeeManualCollection',
                        configIds:$that.addOweFeeCallableInfo.configIds.join(','),
                        roomIds:$that.addOweFeeCallableInfo.roomIds.join(',')
                    }
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _listFeeConfigs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        isDefault: 'F'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.addOweFeeCallableInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _loadOweFeeFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                }
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addOweFeeCallableInfo.floors = _json.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadOweFeeRooms:function(){
                $that.addOweFeeCallableInfo.rooms = [];
                $that.addOweFeeCallableInfo.roomIds = [];
                if(!$that.addOweFeeCallableInfo.floorId){
                    return;
                }

                let _configIds = $that.addOweFeeCallableInfo.configIds;
                if(!_configIds || _configIds.length< 1){
                    return;
                }

                let _tempConfigIds = "";
                _configIds.forEach(item => {
                    _tempConfigIds += (item + ',')
                })
                if (_tempConfigIds.endsWith(',')) {
                    _tempConfigIds = _tempConfigIds.substring(0, _tempConfigIds.length - 1);
                }
                let param = {
                    params: {
                        page:1,
                        row:500,
                        configIds:_tempConfigIds,
                        communityId:vc.getCurrentCommunity().communityId,
                        floorId:$that.addOweFeeCallableInfo.floorId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportOweFee/queryReportOweFee',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.addOweFeeCallableInfo.rooms = _feeConfigInfo.data;
                        if(_feeConfigInfo.data && _feeConfigInfo.data.length >0){
                            _feeConfigInfo.data.forEach(_fee =>{
                                $that.addOweFeeCallableInfo.roomIds.push(_fee.payerObjId);
                            })
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            checkAll:function(e){
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                $that.addOweFeeCallableInfo.roomIds = [];
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                            $that.addOweFeeCallableInfo.roomIds.push(checkObj[i].value);
                    }
                }
            }
        }
    });
})(window.vc);