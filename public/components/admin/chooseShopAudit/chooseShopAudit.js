(function(vc){
    vc.extends({
        propTypes: {
           emitChooseShopAudit:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseShopAuditInfo:{
                shopAudits:[],
                _currentShopAuditName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseShopAudit','openChooseShopAuditModel',function(_param){
                $('#chooseShopAuditModel').modal('show');
                vc.component._refreshChooseShopAuditInfo();
                vc.component._loadAllShopAuditInfo(1,10,'');
            });
        },
        methods:{
            _loadAllShopAuditInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        caId:vc.getCurrentCommunity().caId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('/shopAudit/queryShopAudit',
                             param,
                             function(json){
                                var _shopAuditInfo = JSON.parse(json);
                                vc.component.chooseShopAuditInfo.shopAudits = _shopAuditInfo.shopAudits;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseShopAudit:function(_shopAudit){
                if(_shopAudit.hasOwnProperty('name')){
                     _shopAudit.shopAuditName = _shopAudit.name;
                }
                vc.emit($props.emitChooseShopAudit,'chooseShopAudit',_shopAudit);
                vc.emit($props.emitLoadData,'listShopAuditData',{
                    shopAuditId:_shopAudit.shopAuditId
                });
                $('#chooseShopAuditModel').modal('hide');
            },
            queryShopAudits:function(){
                vc.component._loadAllShopAuditInfo(1,10,vc.component.chooseShopAuditInfo._currentShopAuditName);
            },
            _refreshChooseShopAuditInfo:function(){
                vc.component.chooseShopAuditInfo._currentShopAuditName = "";
            }
        }

    });
})(window.vc);
