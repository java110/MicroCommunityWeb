(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMarketSms:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMarketSmsInfo:{
                marketSmss:[],
                _currentMarketSmsName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMarketSms','openChooseMarketSmsModel',function(_param){
                $('#chooseMarketSmsModel').modal('show');
                vc.component._refreshChooseMarketSmsInfo();
                vc.component._loadAllMarketSmsInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMarketSmsInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('marketSms.listMarketSmss',
                             param,
                             function(json){
                                var _marketSmsInfo = JSON.parse(json);
                                vc.component.chooseMarketSmsInfo.marketSmss = _marketSmsInfo.marketSmss;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMarketSms:function(_marketSms){
                if(_marketSms.hasOwnProperty('name')){
                     _marketSms.marketSmsName = _marketSms.name;
                }
                vc.emit($props.emitChooseMarketSms,'chooseMarketSms',_marketSms);
                vc.emit($props.emitLoadData,'listMarketSmsData',{
                    marketSmsId:_marketSms.marketSmsId
                });
                $('#chooseMarketSmsModel').modal('hide');
            },
            queryMarketSmss:function(){
                vc.component._loadAllMarketSmsInfo(1,10,vc.component.chooseMarketSmsInfo._currentMarketSmsName);
            },
            _refreshChooseMarketSmsInfo:function(){
                vc.component.chooseMarketSmsInfo._currentMarketSmsName = "";
            }
        }

    });
})(window.vc);
