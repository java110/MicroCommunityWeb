/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportProficientRoomFeeInfo: {
                fees: [],
                roomId: '',
                roomName: '',
                name: '',
                roomName: '',
                floorNum: '',
                unitNum: '',
                roomNum: '',
                configId: '',
                feeTypeCds: [],
                feeTypeCd: '',
                state: '2008001'
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('reportProficientRoomFee', 'switch', function (_param) {
                if (_param.roomId == '') {
                    return;
                }
                $that.clearSimplifyRoomFeeInfo();
                vc.copyObject(_param, $that.reportProficientRoomFeeInfo)
                $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);

                vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                    $that.reportProficientRoomFeeInfo.feeTypeCds = _data;
                });
            });

            vc.on('reportProficientRoomFee', 'notify', function () {
                $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });


            vc.on('reportProficientRoomFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listSimplifyRoomFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyRoomFee: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.reportProficientRoomFeeInfo.roomId,
                        configId: $that.reportProficientRoomFeeInfo.configId,
                        state: $that.reportProficientRoomFeeInfo.state,
                        feeTypeCd: $that.reportProficientRoomFeeInfo.feeTypeCd
                    }
                };

                //发送get请求
                vc.http.get('listRoomFee',
                    'list',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportProficientRoomFeeInfo.total = _feeConfigInfo.total;
                        vc.component.reportProficientRoomFeeInfo.records = _feeConfigInfo.records;
                        vc.component.reportProficientRoomFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('reportProficientRoomFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _toOwnerPayFee: function () {
                vc.jumpToPage('/admin.html#/pages/property/owePayFeeOrder?payObjId=' + $that.reportProficientRoomFeeInfo.roomId + "&payObjType=3333&roomName=" + $that.reportProficientRoomFeeInfo.roomName);
            },
            _openRoomCreateFeeAddModal: function () {
                $that.reportProficientRoomFeeInfo.ownerName = $that.reportProficientRoomFeeInfo.name;
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: false,
                    room: $that.reportProficientRoomFeeInfo,
                    ownerName: $that.reportProficientRoomFeeInfo.name
                });
            },
            _openAddMeterWaterModal: function () {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.reportProficientRoomFeeInfo.roomId,
                    roomName: $that.reportProficientRoomFeeInfo.roomName,
                    ownerName: $that.reportProficientRoomFeeInfo.name

                });
            },
            _getAttrValue: function (_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });

                return _value;
            },
            _getDeadlineTime: function (_fee) {

                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }

                if (_fee.state == '2009001') {
                    return "-";
                }
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime,_fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
            _openProxyFeeModal: function () { //创建代收费用
                vc.emit('addProxyFee', 'openAddProxyFeeModal', {
                    roomId: $that.reportProficientRoomFeeInfo.roomId,
                    roomName: $that.reportProficientRoomFeeInfo.roomName,
                    ownerName: $that.reportProficientRoomFeeInfo.name
                });
            },
            _payFee: function (_fee) {
                _fee.roomName = $that.reportProficientRoomFeeInfo.roomName;
                _fee.builtUpArea = $that.reportProficientRoomFeeInfo.builtUpArea;
                //vc.jumpToPage('/admin.html#/pages/property/payFeeOrder?'+vc.objToGetParam(_fee));
                vc.jumpToPage('/admin.html#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editFee: function (_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function (_fee) {
                _fee.builtUpArea = $that.reportProficientRoomFeeInfo.builtUpArea;
                vc.jumpToPage('/admin.html#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function (_fee) {

                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _openTempImportRoomFeeModal:function(){
                vc.emit('tempImportRoomFee', 'openImportRoomFeeModal',{
                    roomId: $that.reportProficientRoomFeeInfo.roomId,
                    roomName: $that.reportProficientRoomFeeInfo.roomName,
                    ownerName: $that.reportProficientRoomFeeInfo.name
                })
            },
            clearSimplifyRoomFeeInfo: function () {
                let _feeConfigs = $that.roomCreateFeeAddInfo.feeTypeCds;
                $that.reportProficientRoomFeeInfo = {
                    fees: [],
                    roomId: '',
                    roomName: '',
                    name: '',
                    roomName: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    feeConfigs: _feeConfigs,
                    feeTypeCd: '',
                    configId: '',
                    state: '2008001'
                }
            },
            _changeSimplifyRoomFeeFeeTypeCd: function (_feeTypeCd) {
                $that.reportProficientRoomFeeInfo.configId = '';
                vc.emit('reportProficientRoomFee', 'notify', {});
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: '',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.reportProficientRoomFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _changeSimplifyRoomConfigId: function () {
                vc.emit('reportProficientRoomFee', 'notify', {});
            },
            _simplifyRoomGetFeeOwnerInfo: function (attrs) {

                let ownerName = $that._getAttrValue(attrs, '390008');
                let ownerLink = $that._getAttrValue(attrs, '390009');

                return '业主：'+ownerName + ',电话：' + ownerLink;
            }


        }
    });
})(window.vc);
