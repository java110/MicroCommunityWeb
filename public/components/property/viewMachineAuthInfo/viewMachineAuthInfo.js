/**
    员工门禁授权 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMachineAuthInfo:{
                index:0,
                flowComponent:'viewMachineAuthInfo',
                machineId:'',
personId:'',
startTime:'',
endTime:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMachineAuthInfoData();
        },
        _initEvent:function(){
            vc.on('viewMachineAuthInfo','chooseMachineAuth',function(_app){
                vc.copyObject(_app, vc.component.viewMachineAuthInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMachineAuthInfo);
            });

            vc.on('viewMachineAuthInfo', 'onIndex', function(_index){
                vc.component.viewMachineAuthInfo.index = _index;
            });

        },
        methods:{

            _openSelectMachineAuthInfoModel(){
                vc.emit('chooseMachineAuth','openChooseMachineAuthModel',{});
            },
            _openAddMachineAuthInfoModel(){
                vc.emit('addMachineAuth','openAddMachineAuthModal',{});
            },
            _loadMachineAuthInfoData:function(){

            }
        }
    });

})(window.vc);
