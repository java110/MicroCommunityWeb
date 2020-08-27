/**
    房源 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewRentingPoolInfo:{
                index:0,
                flowComponent:'viewRentingPoolInfo',
                rentingTitle:'',
price:'',
paymentType:'',
checkInDate:'',
rentingConfigId:'',
rentingDesc:'',
ownerName:'',
ownerTel:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadRentingPoolInfoData();
        },
        _initEvent:function(){
            vc.on('viewRentingPoolInfo','chooseRentingPool',function(_app){
                vc.copyObject(_app, vc.component.viewRentingPoolInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewRentingPoolInfo);
            });

            vc.on('viewRentingPoolInfo', 'onIndex', function(_index){
                vc.component.viewRentingPoolInfo.index = _index;
            });

        },
        methods:{

            _openSelectRentingPoolInfoModel(){
                vc.emit('chooseRentingPool','openChooseRentingPoolModel',{});
            },
            _openAddRentingPoolInfoModel(){
                vc.emit('addRentingPool','openAddRentingPoolModal',{});
            },
            _loadRentingPoolInfoData:function(){

            }
        }
    });

})(window.vc);
