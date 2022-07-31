/**
    问卷题目 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewQuestionAnswerTitleInfo:{
                index:0,
                flowComponent:'viewQuestionAnswerTitleInfo',
                titleType:'',
qaTitle:'',
seq:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadQuestionAnswerTitleInfoData();
        },
        _initEvent:function(){
            vc.on('viewQuestionAnswerTitleInfo','chooseQuestionAnswerTitle',function(_app){
                vc.copyObject(_app, vc.component.viewQuestionAnswerTitleInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewQuestionAnswerTitleInfo);
            });

            vc.on('viewQuestionAnswerTitleInfo', 'onIndex', function(_index){
                vc.component.viewQuestionAnswerTitleInfo.index = _index;
            });

        },
        methods:{

            _openSelectQuestionAnswerTitleInfoModel(){
                vc.emit('chooseQuestionAnswerTitle','openChooseQuestionAnswerTitleModel',{});
            },
            _openAddQuestionAnswerTitleInfoModel(){
                vc.emit('addQuestionAnswerTitle','openAddQuestionAnswerTitleModal',{});
            },
            _loadQuestionAnswerTitleInfoData:function(){

            }
        }
    });

})(window.vc);
