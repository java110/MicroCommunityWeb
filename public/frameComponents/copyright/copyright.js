/**
 版权 处理
 **/
(function (vc) {
    var vm = new Vue({
        el: '#copyright',
        data: {
            copyrightInfo: {
                logo: 'HC',
                company: 'java110官方团队',
                date: '2017-2019',
                openSource: '代码 https://github.com/java110/MicroCommunity'
            },
            screenHeight: document.body.clientHeight
        },
        mounted: function () {
            this._initSysInfo();
            //this.getUserInfo();

            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenHeight = document.body.clientHeight
                    that.screenHeight = window.screenHeight
                })()
            }
        },
        watch: {
            screenHeight(val) {
                if (!this.timer) {
                    this.screenHeight = val
                    this.timer = true
                    let that = this
                    setTimeout(function () {
                        let vcPage = document.getElementById('vc-page');
                        
                        that.timer = false;
                        if(vcPage == undefined || vcPage == null || vcPage ==''){
                            return ;
                        }
                        vcPage.style.minHeight = that.screenHeight;
                    }, 400)
                }
            }

        },
        methods: {
            _initSysInfo: function () {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    this.copyrightInfo.logo = "HC";
                    return;
                }
                this.copyrightInfo.logo = sysInfo.logo;
            }
        }
    });


})(window.vc)