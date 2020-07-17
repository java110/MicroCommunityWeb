(function(vc){
    vc.extends({
        propTypes: {
           emitChooseWechatSmsTemplate:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseWechatSmsTemplateInfo:{
                wechatSmsTemplates:[],
                _currentWechatSmsTemplateName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseWechatSmsTemplate','openChooseWechatSmsTemplateModel',function(_param){
                $('#chooseWechatSmsTemplateModel').modal('show');
                vc.component._refreshChooseWechatSmsTemplateInfo();
                vc.component._loadAllWechatSmsTemplateInfo(1,10,'');
            });
        },
        methods:{
            _loadAllWechatSmsTemplateInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('wechatSmsTemplate.listWechatSmsTemplates',
                             param,
                             function(json){
                                var _wechatSmsTemplateInfo = JSON.parse(json);
                                vc.component.chooseWechatSmsTemplateInfo.wechatSmsTemplates = _wechatSmsTemplateInfo.wechatSmsTemplates;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseWechatSmsTemplate:function(_wechatSmsTemplate){
                if(_wechatSmsTemplate.hasOwnProperty('name')){
                     _wechatSmsTemplate.wechatSmsTemplateName = _wechatSmsTemplate.name;
                }
                vc.emit($props.emitChooseWechatSmsTemplate,'chooseWechatSmsTemplate',_wechatSmsTemplate);
                vc.emit($props.emitLoadData,'listWechatSmsTemplateData',{
                    wechatSmsTemplateId:_wechatSmsTemplate.wechatSmsTemplateId
                });
                $('#chooseWechatSmsTemplateModel').modal('hide');
            },
            queryWechatSmsTemplates:function(){
                vc.component._loadAllWechatSmsTemplateInfo(1,10,vc.component.chooseWechatSmsTemplateInfo._currentWechatSmsTemplateName);
            },
            _refreshChooseWechatSmsTemplateInfo:function(){
                vc.component.chooseWechatSmsTemplateInfo._currentWechatSmsTemplateName = "";
            }
        }

    });
})(window.vc);
