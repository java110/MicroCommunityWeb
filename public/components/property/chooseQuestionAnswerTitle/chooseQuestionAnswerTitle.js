(function(vc){
    vc.extends({
        propTypes: {
           emitChooseQuestionAnswerTitle:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseQuestionAnswerTitleInfo:{
                questionAnswerTitles:[],
                _currentQuestionAnswerTitleName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseQuestionAnswerTitle','openChooseQuestionAnswerTitleModel',function(_param){
                $('#chooseQuestionAnswerTitleModel').modal('show');
                vc.component._refreshChooseQuestionAnswerTitleInfo();
                vc.component._loadAllQuestionAnswerTitleInfo(1,10,'');
            });
        },
        methods:{
            _loadAllQuestionAnswerTitleInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('questionAnswerTitle.listQuestionAnswerTitles',
                             param,
                             function(json){
                                var _questionAnswerTitleInfo = JSON.parse(json);
                                vc.component.chooseQuestionAnswerTitleInfo.questionAnswerTitles = _questionAnswerTitleInfo.questionAnswerTitles;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseQuestionAnswerTitle:function(_questionAnswerTitle){
                if(_questionAnswerTitle.hasOwnProperty('name')){
                     _questionAnswerTitle.questionAnswerTitleName = _questionAnswerTitle.name;
                }
                vc.emit($props.emitChooseQuestionAnswerTitle,'chooseQuestionAnswerTitle',_questionAnswerTitle);
                vc.emit($props.emitLoadData,'listQuestionAnswerTitleData',{
                    questionAnswerTitleId:_questionAnswerTitle.questionAnswerTitleId
                });
                $('#chooseQuestionAnswerTitleModel').modal('hide');
            },
            queryQuestionAnswerTitles:function(){
                vc.component._loadAllQuestionAnswerTitleInfo(1,10,vc.component.chooseQuestionAnswerTitleInfo._currentQuestionAnswerTitleName);
            },
            _refreshChooseQuestionAnswerTitleInfo:function(){
                vc.component.chooseQuestionAnswerTitleInfo._currentQuestionAnswerTitleName = "";
            }
        }

    });
})(window.vc);
