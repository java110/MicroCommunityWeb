(function(vc){
    vc.extends({
        propTypes: {
           emitChooseConvenienceMenus:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseConvenienceMenusInfo:{
                convenienceMenuss:[],
                _currentConvenienceMenusName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseConvenienceMenus','openChooseConvenienceMenusModel',function(_param){
                $('#chooseConvenienceMenusModel').modal('show');
                vc.component._refreshChooseConvenienceMenusInfo();
                vc.component._loadAllConvenienceMenusInfo(1,10,'');
            });
        },
        methods:{
            _loadAllConvenienceMenusInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('convenienceMenus.listConvenienceMenuss',
                             param,
                             function(json){
                                var _convenienceMenusInfo = JSON.parse(json);
                                vc.component.chooseConvenienceMenusInfo.convenienceMenuss = _convenienceMenusInfo.convenienceMenuss;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseConvenienceMenus:function(_convenienceMenus){
                if(_convenienceMenus.hasOwnProperty('name')){
                     _convenienceMenus.convenienceMenusName = _convenienceMenus.name;
                }
                vc.emit($props.emitChooseConvenienceMenus,'chooseConvenienceMenus',_convenienceMenus);
                vc.emit($props.emitLoadData,'listConvenienceMenusData',{
                    convenienceMenusId:_convenienceMenus.convenienceMenusId
                });
                $('#chooseConvenienceMenusModel').modal('hide');
            },
            queryConvenienceMenuss:function(){
                vc.component._loadAllConvenienceMenusInfo(1,10,vc.component.chooseConvenienceMenusInfo._currentConvenienceMenusName);
            },
            _refreshChooseConvenienceMenusInfo:function(){
                vc.component.chooseConvenienceMenusInfo._currentConvenienceMenusName = "";
            }
        }

    });
})(window.vc);
