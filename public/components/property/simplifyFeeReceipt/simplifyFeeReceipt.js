/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 50;
    vc.extends({
        data: {
            simplifyFeeReceiptInfo: {
                feeReceipts: [],
                objType: '3333',
                objId: '',
                payObjId: '',
                roomId: '',
                carId: '',
                receiptCode:'',
                total: '',
                records: '',
                ownerId: '',
                ownerCars: [],
                ownerContracts: [],
                selectReceipts: [],
                ownerFlag: 'F',
                contractId: '',
                quan: false,
                printUrl: '/print.html#/pages/property/printPayFee',
            }
        },
        watch: { // 监视双向绑定的数据数组
            simplifyFeeReceiptInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.simplifyFeeReceiptInfo.selectReceipts.length == $that.simplifyFeeReceiptInfo.feeReceipts.length) {
                        $that.simplifyFeeReceiptInfo.quan = true;
                    } else {
                        $that.simplifyFeeReceiptInfo.quan = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyFeeReceipt', 'switch', function(_param) {
                if (_param.roomId == '') {
                    return;
                }
                $that.clearSimplifyFeeReceiptInfo();
                $that._listFeePrintPages();
                vc.copyObject(_param, $that.simplifyFeeReceiptInfo);
                $that.simplifyFeeReceiptInfo.objId = _param.roomId;
                $that.simplifyFeeReceiptInfo.payObjId = _param.ownerId;
                $that._listSimplifyFeeReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyFeeReceipt', 'notify', function() {
                $that._listSimplifyFeeReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyFeeReceipt', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listSimplifyFeeReceipt(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyFeeReceipt: function(_page, _rows) {
                $that.simplifyFeeReceiptInfo.selectReceipts = [];
                $that.simplifyFeeReceiptInfo.quan = false;
                let _objId = '';
                if ($that.simplifyFeeReceiptInfo.objType == '3333') {
                    _objId = $that.simplifyFeeReceiptInfo.roomId
                } else if ($that.simplifyFeeReceiptInfo.objType == '6666') {
                    _objId = $that.simplifyFeeReceiptInfo.carId
                } else {
                    _objId = $that.simplifyFeeReceiptInfo.contractId
                }
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        objType: $that.simplifyFeeReceiptInfo.objType,
                        objId: _objId,
                        receiptCode:$that.simplifyFeeReceiptInfo.receiptCode,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //根据业主去查询
                if ($that.simplifyFeeReceiptInfo.ownerFlag == 'T') {
                    param.params.objId = '';
                    param.params.payObjId = $that.simplifyFeeReceiptInfo.payObjId;
                }
                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceipt',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        vc.component.simplifyFeeReceiptInfo.total = _feeReceiptManageInfo.total;
                        vc.component.simplifyFeeReceiptInfo.records = _feeReceiptManageInfo.records;
                        vc.component.simplifyFeeReceiptInfo.feeReceipts = _feeReceiptManageInfo.data;
                        vc.emit('simplifyFeeReceipt', 'paginationPlus', 'init', {
                            total: vc.component.simplifyFeeReceiptInfo.records,
                            dataCount: vc.component.simplifyFeeReceiptInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryFeeReceiptMethod: function() {
                vc.component._listSimplifyFeeReceipt(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _printFeeReceipt: function(_receipt) {
                if ($that.simplifyFeeReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择打印收据');
                    return;
                }
                let receiptids = '';
                $that.simplifyFeeReceiptInfo.selectReceipts.forEach(item => {
                    receiptids += (item + ',');
                })
                if (receiptids.endsWith(',')) {
                    receiptids = receiptids.substring(0, receiptids.length - 1);
                }
                window.open($that.simplifyFeeReceiptInfo.printUrl + "?receiptIds=" + receiptids + "&apply=N");
            },

            _printApplyFeeReceipt: function(_receipt) {
                if ($that.simplifyFeeReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择');
                    return;
                }
                let receiptids = '';
                $that.simplifyFeeReceiptInfo.selectReceipts.forEach(item => {
                    receiptids += (item + ',');
                })
                if (receiptids.endsWith(',')) {
                    receiptids = receiptids.substring(0, receiptids.length - 1);
                }
                window.open("/print.html#/pages/property/printPayFee?receiptIds=" + receiptids + "&apply=Y");
            },

            _printFeeSmallReceipt: function() {
                if ($that.simplifyFeeReceiptInfo.selectReceipts.length < 1) {
                    vc.toast('请选择打印收据');
                    return;
                }
                let receiptids = '';
                $that.simplifyFeeReceiptInfo.selectReceipts.forEach(item => {
                    receiptids += (item + ',');
                })
                if (receiptids.endsWith(',')) {
                    receiptids = receiptids.substring(0, receiptids.length - 1);
                }
                window.open("/smallPrint.html#/pages/property/printSmallPayFee?receiptIds=" + receiptids);
            },
            clearSimplifyFeeReceiptInfo: function() {
                $that.simplifyFeeReceiptInfo = {
                    feeReceipts: [],
                    objType: '3333',
                    objId: '',
                    roomId: '',
                    carId: '',
                    receiptCode:'',
                    total: '',
                    records: '',
                    ownerId: '',
                    ownerCars: [],
                    ownerContracts: [],
                    selectReceipts: [],
                    ownerFlag: 'F',
                    contractId: '',
                    quan: false,
                    printUrl: '/print.html#/pages/property/printPayFee',
                }
            },
            _changeSimplifyFeeReceiptFeeTypeCd: function(_feeTypeCd) {
                if ($that.simplifyFeeReceiptInfo.objType == '3333') {
                    vc.emit('simplifyFeeReceipt', 'notify', {});
                } else if ($that.simplifyFeeReceiptInfo.objType == '6666') {
                    $that._listSimplifyFeeReceiptOwnerCar()
                        .then((data) => {
                            vc.emit('simplifyFeeReceipt', 'notify', {});
                        }, (err) => {
                            //vc.toast(err);
                        })
                } else {
                    $that._listSimplifyFeeReceiptOwnerContract()
                        .then((data) => {
                            vc.emit('simplifyFeeReceipt', 'notify', {});
                        }, (err) => {
                            //vc.toast(err);
                        })
                }
            },
            changeSimplifyFeeReceiptCar: function() {
                $that._changeSimplifyFeeReceiptFeeTypeCd();
            },
            _listSimplifyFeeReceiptOwnerCar: function() {
                return new Promise((resolve, reject) => {
                    let param = {
                            params: {
                                page: 1,
                                row: 50,
                                ownerId: $that.simplifyFeeReceiptInfo.ownerId,
                                carTypeCd: '1001',
                                communityId: vc.getCurrentCommunity().communityId
                            }
                        }
                        //发送get请求
                    vc.http.apiGet('owner.queryOwnerCars',
                        param,
                        function(json, res) {
                            let _json = JSON.parse(json);
                            $that.simplifyFeeReceiptInfo.ownerCars = _json.data;
                            if (_json.data.length > 0) {
                                $that.simplifyFeeReceiptInfo.carId = _json.data[0].carId;
                                resolve(_json.data);
                                return;
                            }
                            reject("没有车位");
                        },
                        function(errInfo, error) {
                            reject(errInfo);
                        }
                    );
                })
            },
            _listSimplifyFeeReceiptOwnerContract: function() {
                return new Promise((resolve, reject) => {
                    let param = {
                            params: {
                                page: 1,
                                row: 50,
                                objId: $that.simplifyFeeReceiptInfo.ownerId,
                                communityId: vc.getCurrentCommunity().communityId
                            }
                        }
                        //发送get请求
                    vc.http.apiGet('/contract/queryContract',
                        param,
                        function(json, res) {
                            let _json = JSON.parse(json);
                            $that.simplifyFeeReceiptInfo.ownerContracts = _json.data;
                            if (_json.data.length > 0) {
                                $that.simplifyFeeReceiptInfo.contractId = _json.data[0].contractId;
                                resolve(_json.data);
                                return;
                            }
                            reject("没有车位");
                        },
                        function(errInfo, error) {
                            reject(errInfo);
                        }
                    );
                })
            },
            checkAllReceipt: function(e) {
                let checkObj = document.querySelectorAll('.checReceiptItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.simplifyFeeReceiptInfo.selectReceipts.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.simplifyFeeReceiptInfo.selectReceipts = [];
                }
            },
            _getFeeObjName: function(_feeTypeCd) {
                if (_feeTypeCd == '3333') {
                    return '房屋';
                } else if (_feeTypeCd == '6666') {
                    return '车位';
                } else {
                    return '合同';
                }
            },
            _listFeePrintPages: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        state: 'T',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feePrintPage.listFeePrintPage',
                    param,
                    function(json, res) {
                        var _feePrintPageManageInfo = JSON.parse(json);
                        let feePrintPages = _feePrintPageManageInfo.data;
                        if (feePrintPages && feePrintPages.length > 0) {
                            $that.simplifyFeeReceiptInfo.printUrl = feePrintPages[0].url;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);