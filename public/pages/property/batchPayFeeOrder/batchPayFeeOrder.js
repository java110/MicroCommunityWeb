var saveAs = saveAs || (function(view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
        doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        ,
        get_URL = function() {
            return view.URL || view.webkitURL || view;
        },
        save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        can_use_save_link = "download" in save_link,
        click = function(node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        },
        is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
        is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
        throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        },
        force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        ,
        arbitrary_revoke_timeout = 1000 * 40 // in ms
        ,
        revoke = function(file) {
            var revoker = function() {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        },
        dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        },
        auto_bom = function(blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
            }
            return blob;
        },
        FileSaver = function(blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var
                filesaver = this,
                type = blob.type,
                force = type === force_saveable_type,
                object_url, dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                ,
                fs_error = function() {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if (!popup) view.location.href = url;
                            url = undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (force) {
                        view.location.href = object_url;
                    } else {
                        var opened = view.open(object_url, "_blank");
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                };
            filesaver.readyState = filesaver.INIT;

            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setTimeout(function() {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                });
                return;
            }

            fs_error();
        },
        FS_proto = FileSaver.prototype,
        saveAs = function(blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        };
    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function(blob, name, no_auto_bom) {
            name = name || blob.name || "download";

            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }

    FS_proto.abort = function() {};
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
        null;

    return saveAs;
}(
    typeof self !== "undefined" && self ||
    typeof window !== "undefined" && window ||
    this.content
));

(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            batchPayFeeOrderInfo: {
                batchFees: [],
                allBatchFees: [],
                selectPayFeeIds: [],
                feePrices: 0.00,
                communityId: vc.getCurrentCommunity().communityId,
                ownerId: '',
                payerObjType: '',
                detailIds: '',
                remark: '',
                primeRate: '',
                primeRates: [],
                toFixedSign: 1, // 编码映射-应收款取值标识
                receivedAmountSwitch: '',
                offlinePayFeeSwitch: '1',
                payerObjNames: [],
                payObjs: []
            }
        },
        watch: {
            'batchPayFeeOrderInfo.selectPayFeeIds': {
                deep: true,
                handler: function() {
                    $that._doComputeTotalFee();
                }
            }
        },
        _initMethod: function() {
            let _ownerId = vc.getParam('ownerId');
            let _payerObjType = vc.getParam('payerObjType');
            if (!vc.notNull(_ownerId)) {
                vc.toast('非法操作');
                vc.getBack();
                return;
            }
            $that.batchPayFeeOrderInfo.ownerId = _ownerId;
            $that.batchPayFeeOrderInfo.payerObjType = _payerObjType;
            $that._loadBatchFees();
            //与字典表支付方式关联
            vc.getDict('pay_fee_detail', "prime_rate", function(_data) {
                vc.component.batchPayFeeOrderInfo.primeRates = _data;
            });
        },
        _initEvent: function() {},
        methods: {
            _loadBatchFees: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.batchPayFeeOrderInfo.ownerId,
                        payerObjType: $that.batchPayFeeOrderInfo.payerObjType,
                        state: '2008001'
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        let _fees = _json.fees;
                        if (!_fees || _fees.length < 1) {
                            return;
                        }
                        $that.batchPayFeeOrderInfo.batchFees = _fees.sort($that._batchRoomFeeCompare);
                        // 防止后台设置有误
                        let toFixedSign = _fees[0].val;
                        if (toFixedSign == 1 || toFixedSign == 2 || toFixedSign == 3 || toFixedSign == 4 || toFixedSign == 5) {
                            $that.batchPayFeeOrderInfo.toFixedSign = toFixedSign;
                        }
                        $that.batchPayFeeOrderInfo.selectPayFeeIds = [];
                        $that.batchPayFeeOrderInfo.batchFees.forEach(item => {
                            $that.batchPayFeeOrderInfo.selectPayFeeIds.push(item.feeId);
                            item.cycles = item.paymentCycle;
                            item.receivableAmount = $that._getFixedNum(item.feeTotalPrice);
                            item.receivedAmount = item.receivableAmount;
                        });
                        $that.batchPayFeeOrderInfo.allBatchFees = $that.batchPayFeeOrderInfo.batchFees;

                        $that._pushPayObjs();
                        $that._doComputeTotalFee();
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _batchRoomFeeCompare: function(a, b) {
                var val1 = a.payerObjName;
                var val2 = b.payerObjName;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
            _pushPayObjs: function() {
                let _allBatchFees = $that.batchPayFeeOrderInfo.allBatchFees;
                let _payObjs = $that.batchPayFeeOrderInfo.payObjs;
                let _payerObjNames = $that.batchPayFeeOrderInfo.payerObjNames;
                let _payerObjName = '';
                _allBatchFees.forEach(_fee => {
                    _payerObjName = '';
                    _fee.feeAttrs.forEach(item => {
                        if (item.specCd == '390012') {
                            _payerObjName = item.value;
                        }
                    })
                    if (_payerObjName && !$that._hasPayObjsIn(_payerObjName)) {
                        _payObjs.push(_payerObjName);
                        _payerObjNames.push(_payerObjName);
                    }
                });
            },
            _chanagePayerObjName: function() {
                let _allBatchFees = $that.batchPayFeeOrderInfo.allBatchFees;
                $that.batchPayFeeOrderInfo.batchFees = [];
                _allBatchFees.forEach(_fee => {
                    _payerObjName = '';
                    _fee.feeAttrs.forEach(item => {
                        if (item.specCd == '390012') {
                            _payerObjName = item.value;
                        }
                    })
                    if (_payerObjName && $that._hasPayObjNamesIn(_payerObjName)) {
                        $that.batchPayFeeOrderInfo.batchFees.push(_fee)
                    }
                });

                $that._doComputeTotalFee();
            },
            _hasPayObjsIn: function(_payerObjName) {
                let _payObjs = $that.batchPayFeeOrderInfo.payObjs;
                let _hasIn = false;
                _payObjs.forEach(item => {
                    if (item == _payerObjName) {
                        _hasIn = true;
                    }
                });

                return _hasIn;
            },
            _hasPayObjNamesIn: function(_payerObjName) {
                let _payObjs = $that.batchPayFeeOrderInfo.payerObjNames;
                let _hasIn = false;
                _payObjs.forEach(item => {
                    if (item == _payerObjName) {
                        _hasIn = true;
                    }
                });
                console.log(_payerObjName, _hasIn)
                return _hasIn;
            },
            _payFee: function() {
                if (vc.component.batchPayFeeOrderInfo.selectPayFeeIds.length <= 0) {
                    vc.toast('未选择费用');
                    return;
                }
                //打开model
                $("#doBatchPayFeeModal").modal('show');
            },
            _closeDoBatchPayFeeModal: function() {
                $("#doBatchPayFeeModal").modal('hide');
            },
            _doPayFee: function() {
                let _fees = [];
                let _printFees = [];
                if ($that.batchPayFeeOrderInfo.primeRate == '') {
                    vc.toast('请选择支付方式');
                    return;
                }
                $that.batchPayFeeOrderInfo.selectPayFeeIds.forEach(function(_item) {
                    $that.batchPayFeeOrderInfo.batchFees.forEach(function(_batchFeeItem) {
                        if (_item == _batchFeeItem.feeId) {
                            _batchFeeItem.primeRate = $that.batchPayFeeOrderInfo.primeRate;
                            _fees.push(_batchFeeItem);
                            _printFees.push({
                                feeId: _item,
                                squarePrice: _batchFeeItem.squarePrice,
                                additionalAmount: _batchFeeItem.additionalAmount,
                                feeName: _batchFeeItem.feeName,
                                amount: _batchFeeItem.feePrice,
                                roomName: $that.batchPayFeeOrderInfo.roomName,
                                primeRate: $that.batchPayFeeOrderInfo.primeRate
                            });
                        }
                    })
                })
                if (_fees.length < 1) {
                    vc.toast('未选中要缴费的项目');
                    return;
                }
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    fees: _fees
                }
                vc.http.apiPost(
                    '/fee.payBatchFee',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        $that._closeDoBatchPayFeeModal();
                        if (_json.code == 0) {
                            let _data = JSON.parse(json).data;
                            let detailIds = '';
                            _data.forEach(item => {
                                detailIds += (item + ',');
                            })
                            $that.batchPayFeeOrderInfo.detailIds = detailIds;
                            //vc.saveData('_feeInfo', _feeInfo);
                            //关闭model
                            $("#payFeeResult").modal({
                                backdrop: "static", //点击空白处不关闭对话框
                                show: true
                            });
                            vc.component.batchPayFeeOrderInfo.selectPayFeeIds = [];
                            $that._loadBatchFees();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        $that._closeDoBatchPayFeeModal();
                        vc.toast(errInfo);
                    });
            },
            _back: function() {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _printAndBack: function() {
                $('#payFeeResult').modal("hide");
                window.open("/print.html#/pages/property/printPayFee?detailIds=" + $that.batchPayFeeOrderInfo.detailIds)
            },
            _goBack: function() {
                vc.goBack();
            },
            _printOwnOrder: function() {
                vc.saveData('java110_printFee', {
                    fees: $that.batchPayFeeOrderInfo.batchFees,
                    roomName: $that.batchPayFeeOrderInfo.roomName
                });
                //打印催交单
                window.open('/print.html#/pages/property/printBatchFee?roomId=' + $that.batchPayFeeOrderInfo.payObjId)
            },
            _getDeadlineTime: function(_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },

            checkAll: function(e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.batchPayFeeOrderInfo.selectPayFeeIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.batchPayFeeOrderInfo.selectPayFeeIds = [];
                }
            },
            _getBatchPayFeeRoomName: function(fee) {
                let _feeName = ''
                fee.feeAttrs.forEach(item => {
                    if (item.specCd == '390012') {
                        _feeName = item.value;
                    }
                })

                return _feeName;
            },
            _getBatchPaymentCycles: function(fee) {
                let paymentCycles = [];
                for (let _index = 1; _index < 7; _index++) {
                    paymentCycles.push(_index * parseFloat(fee.paymentCycle))
                }

                return paymentCycles;
            },
            _doComputeTotalFee: function() {
                let _selectPayFeeIds = $that.batchPayFeeOrderInfo.selectPayFeeIds;
                let _batchFees = $that.batchPayFeeOrderInfo.batchFees;
                let _totalFee = 0;
                _selectPayFeeIds.forEach(selectItem => {
                    _batchFees.forEach(feeItem => {
                        if (selectItem == feeItem.feeId && feeItem.receivedAmount) {
                            _totalFee += parseFloat(feeItem.receivedAmount)
                        }
                    })
                })

                $that.batchPayFeeOrderInfo.feePrices = _totalFee.toFixed(2);

            },
            _changeMonth: function(_cycles, _fee) {
                if (_cycles == '') {
                    _cycles = _fee.cycles;
                }
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: _fee.feeId,
                        page: 1,
                        row: 1,
                        cycle: _cycles
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeApi/listFeeObj',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        _fee.receivableAmount = $that._getFixedNum(listRoomData.data.feeTotalPrice);
                        _fee.receivedAmount = _fee.receivableAmount;
                        $that._doComputeTotalFee();
                        $that.$forceUpdate();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            /**
             * 格式化数字
             */
            _getFixedNum: function(num) {
                if ($that.batchPayFeeOrderInfo.toFixedSign == 2) {
                    return $that._mathToFixed1(num);
                } else if ($that.batchPayFeeOrderInfo.toFixedSign == 3) {
                    return $that._mathCeil(num);
                } else if ($that.batchPayFeeOrderInfo.toFixedSign == 4) {
                    return $that._mathFloor(num);
                } else if ($that.batchPayFeeOrderInfo.toFixedSign == 5) {
                    return $that._mathRound(num);
                } else {
                    return $that._mathToFixed2(num);
                }
            },
            /**
             * 向上取整
             */
            _mathCeil: function(_price) {
                return Math.ceil(_price);
            },
            /**
             * 向下取整
             */
            _mathFloor: function(_price) {
                return Math.floor(_price);
            },
            /**
             * 四首五入取整
             */
            _mathRound: function(_price) {
                return Math.round(_price);
            },
            /**
             * 保留小数点后一位
             */
            _mathToFixed1: function(_price) {
                return parseFloat(_price).toFixed(1);
            },
            /**
             * 保留小数点后两位
             */
            _mathToFixed2: function(_price) {
                return parseFloat(_price).toFixed(2);
            },
            _exportExcel: function(type, fn, dl) {
                // 使用 XLSX.utils.aoa_to_sheet(excleData);
                let excleData = [
                    ['缴费申请单', null, null, null, null],
                    ['费用类型', '费用项目', '费用标识', '收费对象', '计费起始时间', '计费结束时间', '欠费金额', '缴费周期', '应收', '实收', '备注'],
                ];

                $that.batchPayFeeOrderInfo.selectPayFeeIds.forEach(function(_item) {
                    $that.batchPayFeeOrderInfo.batchFees.forEach(function(_batchFeeItem) {
                        if (_item == _batchFeeItem.feeId) {
                            _batchFeeItem.primeRate = $that.batchPayFeeOrderInfo.primeRate;
                            excleData.push([_batchFeeItem.feeTypeCdName, _batchFeeItem.feeName,
                                _batchFeeItem.feeFlagName,
                                $that._getBatchPayFeeRoomName(_batchFeeItem),
                                $that._getEndTime(_batchFeeItem),
                                $that._getDeadlineTime(_batchFeeItem),
                                _batchFeeItem.amountOwed,
                                _batchFeeItem.cycles,
                                _batchFeeItem.receivableAmount,
                                _batchFeeItem.receivedAmount,
                                _batchFeeItem.remark
                            ])
                        }
                    })
                });

                excleData.push(['',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '缴费金额',
                    $that.batchPayFeeOrderInfo.feePrices,
                    ''
                ])

                // 设置表格样式，!cols为列宽
                const options = {
                    '!cols': [
                        { wpx: 100 },
                        { wpx: 100 },
                        { wpx: 100 },
                        { wpx: 100 },
                        { wpx: 100 },
                    ]
                };
                const worksheet = XLSX.utils.aoa_to_sheet(excleData);
                worksheet['A1'].s = {
                    font: {
                        sz: 28,
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    }
                }

                worksheet['!cols'] = options['!cols']; // 设置每列的列宽，10代表10个字符，注意中文占2个字符
                console.log(worksheet)

                worksheet['!merges'] = [{ e: { c: 10, r: 0 }, s: { c: 0, r: 0 } }];


                // 新建一个工作簿
                // const workbook: XLSX.WorkBook = XLSX.utils.book_new();
                const workbook = XLSX.utils.book_new(); //创建虚拟workbook

                /* 将工作表添加到工作簿,生成xlsx文件(book,sheet数据,sheet命名)*/
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                /* 输出工作表， 由文件名决定的输出格式(book,xlsx文件名称)*/

                XSU.setCellStyle(workbook, 'Sheet1', 'A1', {
                    font: {
                        sz: 28,
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    }
                });

                // XLSX.writeFile(workbook, '申请单.xlsx');

                let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };

                let wbout = xlsxStyle.write(workbook, wopts)
                    // XLSX.writeFile(wbout, '申请单.xlsx');
                saveAs(new Blob([XSU.s2ab(wbout)], { type: "" }), '申请单.xlsx')

            }
        }
    });
})(window.vc);