/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            parkingAreaControlCarInoutInfo: {
                inImg: '/img/carInout.jpg',
                outImg: '/img/carInout.jpg'

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('parkingAreaControlCarInout', 'notify', function(_param) {
                let _parkingAreaControl = _param.parkingAreaControl;
                let _data = _param.data;
                if (_data.action != 'IN_OUT') {
                    return;
                }
                if (_parkingAreaControl.inMachineId == _data.extMachineId) {
                    //$that.parkingAreaControlCarInoutInfo.inImg = _data.img;
                    setTimeout(function() {
                        $that.parkingAreaControlCarInoutInfo.inImg = _data.img;
                    }, 1500)
                }

                if (_parkingAreaControl.outMachineId == _data.extMachineId) {
                    //$that.parkingAreaControlCarInoutInfo.outImg = _data.img;
                    setTimeout(function() {
                        $that.parkingAreaControlCarInoutInfo.outImg = _data.img;
                    }, 1500)
                }

            })
        },
        methods: {
            imgOnErrorIn: function() {
                //let _img = $that.parkingAreaControlCarInoutInfo.inImg

            },
            imgOnErrorOut: function() {
                //let _img = $that.parkingAreaControlCarInoutInfo.outImg

            }
        }
    });
})(window.vc);