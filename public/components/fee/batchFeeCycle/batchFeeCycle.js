(function (vc) {
    vc.extends({

        data: {
            batchFeeCycleInfo: {
                cycles: '',
                tempCycle: '',
                custEndTime: '',
                receivedAmount:'',
                fee: {}
            }
        },
        _initMethod: function () {
            //与字典表支付方式关联

        },
        _initEvent: function () {
            vc.on('batchFeeCycle', 'openBatchCycle', function (fee) {
                $that.batchFeeCycleInfo.cycles = fee.cycles;
                $that.batchFeeCycleInfo.tempCycle = fee.tempCycle;
                $that.batchFeeCycleInfo.receivedAmount = fee.receivedAmount;
                $that.batchFeeCycleInfo.fee = fee;
                $("#batchFeeCycleModal").modal('show');
            });
        },
        methods: {
            _closeBatchFeeCycleModal: function () {
                $("#batchFeeCycleModal").modal('hide');
            },
            changeTempCycle: function () {
                let _tempCycle = $that.batchFeeCycleInfo.tempCycle+"";
                if(_tempCycle != '-100'){
                    $that.batchFeeCycleInfo.cycles = "1";
                }

                if ($that.batchFeeCycleInfo.tempCycle != '-103') {
                    return;
                }
                setTimeout(function () {
                    vc.initDate('cust-endTime', function (_value) {
                        $that.batchFeeCycleInfo.custEndTime = _value;
                    })
                }, 500);
            },
            _doSubmitFeeCycle:function(){
                $that.batchFeeCycleInfo.fee.tempCycle = $that.batchFeeCycleInfo.tempCycle;
                $that.batchFeeCycleInfo.fee.cycles = $that.batchFeeCycleInfo.cycles;
                $that.batchFeeCycleInfo.fee.custEndTime = $that.batchFeeCycleInfo.custEndTime;
                $that.batchFeeCycleInfo.fee.receivedAmount = $that.batchFeeCycleInfo.receivedAmount;
                $that._closeBatchFeeCycleModal();

                vc.emit('batchPayFeeOrder','changeMonth',$that.batchFeeCycleInfo.fee);
                //$that.$forceUpdate();
             
            }
        }
    });
})(window.vc);
