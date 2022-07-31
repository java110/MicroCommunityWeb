(function(vc){
    vc.extends({
        propTypes: {
           emitChooseQuestionAnswer:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseQuestionAnswerInfo:{
                questionAnswers:[],
                _currentQuestionAnswerName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseQuestionAnswer','openChooseQuestionAnswerModel',function(_param){
                $('#chooseQuestionAnswerModel').modal('show');
                vc.component._refreshChooseQuestionAnswerInfo();
                vc.component._loadAllQuestionAnswerInfo(1,10,'');
            });
        },
        methods:{
            _loadAllQuestionAnswerInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('questionAnswer.listQuestionAnswers',
                             param,
                             function(json){
                                var _questionAnswerInfo = JSON.parse(json);
                                vc.component.chooseQuestionAnswerInfo.questionAnswers = _questionAnswerInfo.questionAnswers;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseQuestionAnswer:function(_questionAnswer){
                if(_questionAnswer.hasOwnProperty('name')){
                     _questionAnswer.questionAnswerName = _questionAnswer.name;
                }
                vc.emit($props.emitChooseQuestionAnswer,'chooseQuestionAnswer',_questionAnswer);
                vc.emit($props.emitLoadData,'listQuestionAnswerData',{
                    questionAnswerId:_questionAnswer.questionAnswerId
                });
                $('#chooseQuestionAnswerModel').modal('hide');
            },
            queryQuestionAnswers:function(){
                vc.component._loadAllQuestionAnswerInfo(1,10,vc.component.chooseQuestionAnswerInfo._currentQuestionAnswerName);
            },
            _refreshChooseQuestionAnswerInfo:function(){
                vc.component.chooseQuestionAnswerInfo._currentQuestionAnswerName = "";
            }
        }

    });
})(window.vc);
