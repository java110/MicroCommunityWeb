/**
    菜单 处理
**/
(function(vc){
    var vm = new Vue({
       el:'#breadcrumb',
       data:{
                breadCrumbs:[]
       },
       mounted:function(){
           //this._freshBreadCrumbByUrl();
           // 监听事件
           document.addEventListener('initVcFrameworkFinish', function (e) {
                // e.target matches elem
                vm.breadCrumbs = [];
                vm._freshBreadCrumbByUrl();
            }, false);
       },
       methods:{
           _freshBreadCrumbByUrl:function(){

                let tabs = vc.getTabFromLocal();

                let _tmpMenus = vc.getMenus();

                if(_tmpMenus == null || _tmpMenus == undefined){
                    return ;
                }

                tabs.forEach(item => {
                    let _path = item;
                    if(_path.indexOf('?') != -1){
                        _path = _path.substring(0,_path.indexOf('?'));
                    }
                    let _url = vc.getUrl()+_path;
                   
                    _tmpMenus.forEach(_menu =>{
                        _menu.childs.forEach(child=>{
                            console.log(_url,child.href)
                            if(_url == child.href){
                                _tmpBreadCrumbInf = {
                                    href: child.href,
                                    pageName: child.name,
                                    active:'0'
                                };
                               this.breadCrumbs.push(_tmpBreadCrumbInf);
                            }
                        })
                    })

                });
           },

            _getRealUrl:function(_url){
                if(_url.indexOf('?') != -1){
                    return _url.substring(0, _url.indexOf('?'));
                }
                return _url;
            },
            _changeSmallTab:function(){

            }
       },

    });

})(window.vc)