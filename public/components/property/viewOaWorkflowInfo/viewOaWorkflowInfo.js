/**
    流程实例 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewOaWorkflowInfo:{
                index:0,
                flowComponent:'viewOaWorkflowInfo',
                flowName:'',
flowType:'',
describle:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadOaWorkflowInfoData();
        },
        _initEvent:function(){
            vc.on('viewOaWorkflowInfo','chooseOaWorkflow',function(_app){
                vc.copyObject(_app, vc.component.viewOaWorkflowInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewOaWorkflowInfo);
            });

            vc.on('viewOaWorkflowInfo', 'onIndex', function(_index){
                vc.component.viewOaWorkflowInfo.index = _index;
            });

        },
        methods:{

            _openSelectOaWorkflowInfoModel(){
                vc.emit('chooseOaWorkflow','openChooseOaWorkflowModel',{});
            },
            _openAddOaWorkflowInfoModel(){
                vc.emit('addOaWorkflow','openAddOaWorkflowModal',{});
            },
            _loadOaWorkflowInfoData:function(){

            }
        }
    });

})(window.vc);
