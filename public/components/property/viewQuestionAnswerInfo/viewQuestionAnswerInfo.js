/**
    问卷信息 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewQuestionAnswerInfo:{
                index:0,
                flowComponent:'viewQuestionAnswerInfo',
                qaType:'',
qaName:'',
startTime:'',
endTime:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadQuestionAnswerInfoData();
        },
        _initEvent:function(){
            vc.on('viewQuestionAnswerInfo','chooseQuestionAnswer',function(_app){
                vc.copyObject(_app, vc.component.viewQuestionAnswerInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewQuestionAnswerInfo);
            });

            vc.on('viewQuestionAnswerInfo', 'onIndex', function(_index){
                vc.component.viewQuestionAnswerInfo.index = _index;
            });

        },
        methods:{

            _openSelectQuestionAnswerInfoModel(){
                vc.emit('chooseQuestionAnswer','openChooseQuestionAnswerModel',{});
            },
            _openAddQuestionAnswerInfoModel(){
                vc.emit('addQuestionAnswer','openAddQuestionAnswerModal',{});
            },
            _loadQuestionAnswerInfoData:function(){

            }
        }
    });

})(window.vc);
