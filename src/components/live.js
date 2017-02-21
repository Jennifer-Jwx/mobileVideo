require('../components/check');
require('../css/common.css');
require('../css/live.css');
require('../css/review.css');
require('../components/transform');

var utils = require('../components/utils');

var React = require('react');
var InputBox = require('../components/live_input');
var PlayWrap = require('../components/live_playWrap');
var CommentList = require('../components/live_commentList');

var playstate = 1;
var videoInfo = {
	viewNum: 123,
	vpic: 'http://d.ifengimg.com/w220_h125_q100/p3.ifengimg.com/cmpp/2017/02/17/6bfe46580c3db1ddd1dd1b45d844fed8_size32_w168_h120.jpg',
	name: '我是标题我是标题',
	videoLive: 'http://ips.ifeng.com/video19.ifeng.com/video09/2017/02/14/4520238-280-098-0811.mp4'
};

var LiveWrap = React.createClass({  //页面主体
    getInitialState: function(){
        this.ua = window.navigator.userAgent.toLowerCase();
        this.uastate = this.ua.indexOf('ipad') > -1 ? 'controlwrap ipadwrap' : 'controlwrap';
        this.fullTimer = null;
        this.playState = playstate == 0 ? 'live' : 'review';
        return {
            viewNum: videoInfo.viewNum,   //当前观看人数
            vpic: videoInfo.vpic,   //宣传图
            name: videoInfo.name,   //标题
            videoLive: videoInfo.videoLive,   //视频地址
            classname: 'wrap exitwrap',   //最外层div的class
            scale: '',   //video标签的class，适应比例大小
            inputstate: 'inputbox blur',   //输入框的状态，聚焦或失去焦点
            sharestate: 'sharecon',   // share框中的内容class
            readyclass: 'playwrap live',   //播放区class，区分回放还是直播
            videoclass: 'playwrap review playing',   //playwrap的class， 用于回放时video的播放暂停等样式显示
            playclass: 'play',   //回放时中间的大播放暂停的显隐
            _duration: '00:00',   //回放时总时长
            _currenttime: '00:00'   //播放时currentTime
        }
    },
    setScale: function(){      //全屏时，video的比例显示
        var _w = document.documentElement.clientWidth;
        var _h = document.documentElement.clientHeight;
        var _scale = _w / _h < 16 / 9 ? 'ltscale' : 'gtscale';
        this.setState({
            scale: _scale
        });
    },
    listener: function(){   //监听屏幕是否翻转
        var self = this;
        var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        var _rotate = window.orientation;
        _rotate = _rotate == undefined ? 0 : _rotate;
        if(_rotate != 0){ //初始非0为横屏状态
            self.exitfullScreen(0);
            self.setState({
                classname: 'wrap fullwrap rotated'
            });
            self.rotateState = 1;
        }
        window.addEventListener(evt, function() {
            if(playstate == 2)return;
            self.exitfullScreen(0);  //无论横屏还是竖屏，都要先退出全屏的强制翻转
            if (window.orientation != 0) { //横屏状态
                document.getElementsByTagName('body')[0].style.backgroundColor = '#000';
                self.setState({
                    classname: 'wrap fullwrap rotated'
                });
                self.rotateState = 1;
            } else { //竖屏状态
                self.setState({
                    classname: 'wrap exitwrap'
                });
                self.rotateState = 0;
            }
        }, false);
    },
    scaleMove: function(e){
        clearTimeout(this._display);
        if(this.state.classname == "wrap fullwrap" && this.rotateState != 1){
            var thisY = e.changedTouches[0].clientY;
            var to = Math.min(this.max, Math.max(0, this.l + (thisY - this.y)));
        }
        else{
            var thisX = e.changedTouches[0].clientX;
            var to = Math.min(this.max, Math.max(0, this.l + (thisX - this.x)));
        }

        this.wrap.style.left = to + "px";
        this.ondrag(Math.round(Math.max(0, to / this.max) * 100), to);
        document.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    init: function() {   //进度条相关
        var f = this;
        this.wrap.addEventListener('touchstart', function(e){
            clearTimeout(f._display);
            f.x = e.changedTouches[0].clientX;
            f.y = e.changedTouches[0].clientY;
            f.l = this.offsetLeft;
            f._l = this.offsetTop;
            f.max = f.bar.offsetWidth - this.offsetWidth;

            document.getElementById('control_schedulewrap').addEventListener('touchmove', function(e){
                f.scaleMove(e);
            });
            document.onmouseup = new Function("this.onmousemove=null");
        });

        this.bar.addEventListener('touchend', function(e){
            document.getElementById('playwrap').removeEventListener('touchmove', function(e){
                f.scaleMove(e)
            });
            f._video.play();
            f._toplay();
            if(playstate == 1 && !f._video.paused){
                f._display = setTimeout(function(){
                    f.controlwrapHide();
                }, 3000);
            }
            e.preventDefault();
            e.stopPropagation();
        });
    },
    ondrag: function(pox, x) {   //进度条相关
        this.step.style.width = Math.max(0, x) + "px";
        this._video.currentTime = this.totalTime * (pox / 100);
    },
    _scalefunction: function(btn, bar, step, mytype, wrap) {   //进度条相关
        this.btn = document.getElementById(btn);
        this.bar = document.getElementById(bar);
        this.step = document.getElementById(step);
        this.wrap = document.getElementById(wrap)
        this._circleWidth = parseInt(utils.getStyle('circle').width);
        this.mytype = mytype;
        this.init();
    },
    setSchedule: function(_current) {   //进度条相关
        var _schedulewidth = parseInt(utils.getStyle('control_schedulewrap').width);

        var _cur = (_current / this.totalTime) * _schedulewidth - this._circleWidth;
        _cur = _cur < 0 ? 0 : _cur;
        document.getElementById("schedule").style.width = _cur + "px";

        document.getElementById("circlewrap").style.left = _cur >= _schedulewidth ? _cur + "px" : _cur + "px";
        return _cur;
    },
    fullScreen: function(_touch){   //全屏方法
        var _self = this;
        _self.controlwrapShow();
        var conW = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
        var conH = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
        var ele = document.getElementsByTagName('body')[0];

        if(_self.rotateState == 1 && _touch){   //横屏状态下退出全屏
            transform(ele, {rotate: '0', translatex: 0, translatey: 0}, '0', 'linear', function(){
                if(playstate == 1){
                    _self.setSchedule(_self._currentT);
                }
                else utils.setScroll();
            }, 0);
            ele.style.width = '100%';
            ele.style.height = '100%';
        }
        else{ //屏幕未发生旋转的状态下，正常退出全屏
            transform(ele, {rotate: '90deg', translatex: (conH - conW) / 2 + 'px', translatey: (conH - conW) / 2 + 'px'}, '0', 'linear', function(){
                if(playstate == 1){
                    _self.setSchedule(_self._currentT);
                }
                else utils.setScroll();
            }, 0);
            ele.style.width = conH + 'px';
            ele.style.height = conW + 'px';
        }

        ele.style.transformOrigin = 'center center';
        ele.style.webkitTransformOrigin = 'center center';
        ele.style.backgroundColor = '#000';
        this.setScale();
    },
    _full: function(e){   //触发全屏
        if(window.orientation == 0){
            this.setState({
                classname: 'wrap fullwrap'
            });
        }
        else{
            this.setState({
                classname: 'wrap fullwrap rotated'
            });
        }
        
        this.fullScreen(1);

    },
    exitfullScreen: function(_touch){   //退出全屏方法
        var ele = document.getElementsByTagName('body')[0];
        var _self = this;

        if(this.state.classname.indexOf('exitwrap') < 0)document.getElementById('commentbox').style.zIndex = 0;
        else document.getElementById('commentbox').style.zIndex = -1;

        ele.style.transformOrigin = '';
        ele.style.webkitTransformOrigin = '';
        ele.style.backgroundColor = '#ececec';

        if(_self.rotateState == 1 && _touch){   //横屏状态下退出全屏
            this.setState({
                classname: 'wrap exitwrap rotated'
            });
            var conW = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
            var conH = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;

            ele.style.width = conH + 'px';
            ele.style.height = conW + 'px';

            transform(ele, {rotate: '-90deg', translatex: (conW - conH) / 2 + 'px', translatey: (conW - conH) / 2 + 'px'}, '0', 'linear', function(){
                if(playstate == 1){
                    _self.setSchedule(_self._currentT);
                }
                else utils.setScroll();
            }, 0);
            
        }
        else{    //屏幕未发生旋转的状态下，正常退出全屏
            this.setState({
                classname: 'wrap exitwrap'
            });
            ele.style.width = '100%';
            ele.style.height = '100%';


            transform(ele, {rotate: '0deg', translatex: 0, translatey: 0}, '0', 'linear', function(){
                _self.setScale();
                if(playstate == 1){ 
                    _self.setSchedule(_self._currentT);
                }
                else utils.setScroll();
            }, 0);
            
        }
        
        this.setScale();

        if(playstate == 0){
            transform(document.getElementById('inputbox'), {rotate: '0'}, '0', 'linear');
            document.getElementById('inputbox').style.width = '100%';
        }
        
    },
    _exitfull: function(e){   //触发推出全屏
        this.exitfullScreen(1);
        e.preventDefault();
        e.stopPropagation();
    },
    _share: function(e){     //点击分享按钮，显示分享box
        document.getElementById('sharebox').style.display = 'block';

        e.preventDefault();
        e.stopPropagation();
    },
    _sharecon: function(e){   //点击分享con阻止冒泡
        e.preventDefault();
        e.stopPropagation();
    },
    _hide: function(e, from){   //点击非分享con隐藏分享框
        console.log(e.target);
        document.getElementById('sharebox').style.display = 'none';
        document.getElementById('sharewxWrap').style.display = 'none';
        this.setState({sharestate: 'sharecon'});
        if(playstate == 1 && from + '' != 'comment'){     //回放时调用
            this.videoFunction(e);
        }
        if(playstate == 0){
            var myinput = document.getElementById('text');
            if(e.target != myinput){
                if(myinput == document.activeElement){
                    myinput.blur();
                }
                e.preventDefault();
            }
        }
        
    },
    _edit: function(e){   //点击输入评论
        this.setState({inputstate: 'inputbox focus inputfocus'}, function(){
            var _input = document.getElementById('text');
            if(_input == document.activeElement){   //文本框聚焦
                _input.blur('edit');
            }
            else{
                _input.focus();
            }
        });
        var conW = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
        var conH = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
        var _inputbox = document.getElementById('inputbox');

        if(!this.rotateState){   //全屏，未翻转屏幕
            _inputbox.style.width = conW + 'px';

            var _width = parseInt(utils.getStyle('inputbox').width);
            var _height = parseInt(utils.getStyle('inputbox').height);

            transform(_inputbox, {rotate: '-90deg', translatex:  (_width - _height) / 2 + 'px', translatey: conH - (_width + _height) / 2 + 'px'}, '0', 'linear');
        }
        else{     //全屏，翻转屏幕
            _inputbox.style.width = '100%';
            transform(_inputbox, {rotate: '0'}, '0', 'linear');
        }

        e.preventDefault();
        e.stopPropagation();
    },
    _focus: function(e){   //文本框聚焦，分享变为发送
        if(this.ua.indexOf('ipad') > -1){
            this.setState({inputstate: 'inputbox focus inputfocus ipad'});
        }
        else{this.setState({inputstate: 'inputbox focus inputfocus'});

        }
        
        if (!window.IS_LOGIN()) {
            var url = window.location.href;
            window.location = 'http://id.ifeng.com/muser/login?cb=' + url;
        }
        e.preventDefault();
        e.stopPropagation();
    },
    _blur: function(e){    //文本框失去焦点，发送变为分享
        if(document.getElementById('text').value == ''){
            this.setState({inputstate: 'inputbox blur'});
        }
        
        e.preventDefault();
        e.stopPropagation();
    },
    _login: function(e){   //点击文本框时，未登录用户需要登录
        e.preventDefault();
        e.stopPropagation();
    },
    _shareto: function(e){   //分享到qqzone or weibo
        if(this.ua.match(/MicroMessenger/i) == 'micromessenger'){
            document.getElementById('sharewxWrap').style.display = 'block';
        }else{
            this.setState({sharestate: 'sharecon shared'});
        }
        e.preventDefault();
        e.stopPropagation();
    },
    _sharetowb: function(e){      //分享到微博
        shareFunction('sinaWeibo');   
        e.preventDefault();
        e.stopPropagation();
    },
    _sharetozone: function(e){      //分享到qq空间
        shareFunction('QZone');
        e.preventDefault();
        e.stopPropagation();
    },
    _toplay: function(){   //播放方法
        document.removeEventListener('touchstart', this._toplay);
        var _self = this;
        if(playstate == 1){
            _self.setState({videoclass: 'playwrap review pause'});
            setTimeout(function(){
                _self.setState({playclass: 'play display'});
            }, 1000);
        }
        return document.getElementById('video').play();
    },
    _topause: function(){   //暂停方法
        this._video.pause();

        if(playstate == 1){
            this.setState({videoclass: 'playwrap review'});
        }
    },
    _play: function(e){   //点击暂停播放按钮
        var _self = this;
        clearTimeout(this._display);

        if(playstate == 1){
            if(this._video.paused && this.state._currentTime != this.state._duration){    //video现在为暂停状态,需要播放
                this._toplay();

                this._display = setTimeout(function(){
                    _self.controlwrapHide();
                }, 3000);
            }
            else{  //video现在为播放状态，需要暂停
                this._topause();
            }
        }
        else if(playstate == 0){
            if(this.ua.match(/MicroMessenger/i) == 'micromessenger'){   //微信
                clearTimeout(this.fullTimer);

                var _height = parseInt(utils.getStyle('full').height) + parseInt(utils.getStyle('full').marginBottom);
                var _top = (document.getElementById('full').style.transform || document.getElementById('full').style.WebkitTransform).replace('translateY(', '').replace('px)', '');

                _top = _top == '' ? 0 : parseInt(_top);

                if(_top != 0){
                    transform(document.getElementById('full'), {translatey:  + 0 + 'px'}, '.1s', 'ease-out');
                    this.fullTimer = setTimeout(function(){
                        transform(document.getElementById('full'), {translatey:  + _height + 'px'}, '.1s', 'ease-out');
                    }, 5000);
                }
                else{
                    transform(document.getElementById('full'), {translatey:  + _height + 'px'}, '.1s', 'ease-out');
                }
            }
            else{   //其他浏览器
                this._toplay();
            }
        }

        e.preventDefault();
        e.stopPropagation();
    },
    controlwrapHide: function(){
        this._height = parseInt(utils.getStyle('controlwrap').height);
        transform(document.getElementById('controlwrap'), {translatey:  + this._height + 'px'}, '.1s', 'ease-out');
        this.setState({videoclass: 'playwrap review pause controlhide'});
        document.getElementById('commentbox').style.zIndex = 0;
        
    },
    controlwrapShow: function(){
        transform(document.getElementById('controlwrap'), {translatey:  + 0 + 'px'}, '.1s', 'ease-out');
        if(this.state.classname.indexOf('fullwrap') > 0)document.getElementById('commentbox').style.zIndex = -1;

        if(this._video.paused){
            this.setState({videoclass: 'playwrap review'});
        }
        else{
            this.setState({videoclass: 'playwrap review pause'});
        }
    },
    videoFunction: function(e){   //播放区中控制条区域的动作
        this.curTop = (document.getElementById('controlwrap').style.transform || document.getElementById('controlwrap').style.WebkitTransform).replace('translateY(', '').replace('px)', '');
        this._height = parseInt(utils.getStyle('controlwrap').height);

        clearTimeout(this._display);

        var _self = this;

        if(!_self._video.paused){
            if(_self.curTop == 0){
                _self.controlwrapHide();
            }
            else{
                if(_self.curTop != 0 && _self.curTop != ''){
                    _self.controlwrapShow();
                }

                this._display = setTimeout(function(){
                    _self.controlwrapHide();
                }, 3000);
            }
        }
        e.preventDefault();
        e.stopPropagation();
    },
    send: function(comment){
        reqwest({
            url: 'http://ichat.3g.ifeng.com//interface/add?lr_id=' + roomId + '&uid=' + comment.uid + '&host_name=' + comment.host_name + '&type=*&host_avatar=' + comment.host_avatar + '&content=' + comment.content,
            type: 'jsonp',
            error: function(err){
                alert('请求失败，请刷新重试');
            }
        });
        document.getElementById('text').blur('send');

    },
    getpersonalInfo: function(_sid, _content){
        var _self = this;
        var myInfo;
        var personalInfo = reqwest({
            url: 'https://id.ifeng.com/api/getuserinfo?sid=' + _sid,
            type: 'jsonp',
            success: function(){
                personalInfo.then(function(res){
                    myInfo = res.data;
                    _self._host_name = myInfo.nickname || myInfo.username || 'user' + myInfo.guid;
                    _self._host_avatar = myInfo.image || '';
                    _self._uid = myInfo.guid || '';
                    myuid = _self._uid;
                    _self.onCommentSubmit({host_name: _self._host_name, content: _content, host_avatar: _self._host_avatar, isown: 'own', host_type: '3', uid:_self. _uid});
                });
            },
            error: function(err){
                alert('请求失败，请刷新重试');
            }
        });

       document.getElementById('text').value = ''; 
    },
    onCommentSubmit: function(comment) {   //提交评论自动更新评论data
        setTimeout(function(){
            commentList.push(comment);
            _this.setState({data: commentList});
            utils.setScroll();
        }, 700);
        this.send(comment);
    },
    handleSubmit: function(e) {  //点击提交
        var content = document.getElementById('text').value.trim();
        if(!content) return;
        this.setState({inputstate: 'inputbox blur'});
        this.getpersonalInfo(utils.getCookie('sid'), content);
    },
    componentDidMount: function(){   //关于视频
        this._video = document.getElementById('video');
        this._video.addEventListener('error', function(){
            // playstate = 2;
            // renderDom(playstate);
        });
        this.listener();
        this._display = null;

        var _self = this;
        _self._video.setAttribute('webkit-playsinline', 'true');
        _self._video.setAttribute('proload', 'meta');
        _self._video.setAttribute('type', 'application/vnd.apple.mpegurl');

        if(playstate == 0){   //直播
            _self._video.play();
            document.addEventListener("WeixinJSBridgeReady", function () {
                _self._video.play();
            });

            _self._video.addEventListener('playing', function(){
                _self.setState({readyclass: 'playwrap live ready'});
                _self.fullTimer = setTimeout(function(){
                    var _height = parseInt(utils.getStyle('full').height) + parseInt(utils.getStyle('full').marginBottom);
                    transform(document.getElementById('full'), {translatey:  + _height + 'px'}, '.1s', 'ease-out');
                }, 5000);
            });

            _self._video.addEventListener('paused', function(){
                clearTimeout(_self.fullTimer);
                transform(document.getElementById('full'), {translatey:  + 0 + 'px'}, '.1s', 'ease-out');
            });

            document.addEventListener('touchstart', _self._toplay);
        }
        else if(playstate == 1){    //回放
            _self._video.addEventListener('loadedmetadata', function(){
                _self.totalTime = _self._video.duration;
                _self.setState({_duration: utils.formatVideoTime(parseInt(_self.totalTime))});
            });

            _self._video.addEventListener('timeupdate', function(){
                _self._currentT = _self._video.currentTime;                
                _self.setState({_currenttime: utils.formatVideoTime(parseInt(_self._currentT))});
                _self.setSchedule(_self._currentT);
                //播放完毕后，显示控制区域
                if(_self.state._currenttime == _self.state._duration){
                    _self.setState({playclass: 'play'});
                    _self.setState({videoclass: 'playwrap review playing'});
                    _self.controlwrapShow();
                    clearTimeout(_self._display);
                }
            });

            _self._video.addEventListener('pause', function(){
                if(playstate == 1){
                    _self.setState({videoclass: 'playwrap review'});
                    clearTimeout(_self._display);
                    _self.controlwrapShow();
                }
            });
            this._scalefunction("circle", "control_schedulewrap", "schedule", "video", "circlewrap");
        }
        
    },
    render: function(){
        var self = this;
        var _state = self.state;
        self.viewtext = playstate == 0 ? '人正在观看' : '人看过';
        var fixNodes = function(){
            return (
                <div className='fix' id='fix'>
                    <PlayWrap uastate={self.uastate} readyclass={_state.readyclass} _play={self._play} videoclass={_state.videoclass} vpic={_state.vpic} playclass={_state.playclass} _duration={_state._duration} _currenttime={_state._currenttime} setSchedule={self.setSchedule} videoLive={_state.videoLive} full={self._full} exitfull={self._exitfull} scale={self.state.scale}></PlayWrap>
                    <img src={_state.vpic} className='shareImg'/>
                    <div className='anchor'>
                        <div className='header float_left'><div className='img' id='vpic' style={{backgroundImage:'url(' + _state.vpic + ')'}}></div></div>
                        <div className='title float_left'>
                            <div className='con color_444 size_48' id='title'>{_state.name}</div>
                            <div className='num color_fa200 size_36'><span id='view_num'>{self.props.viewNum}</span>{self.viewtext}</div>
                        </div>
                    </div>
                </div>
            );
        };
        var commentNodes = function(){
            return (
                <CommentList rotateState={self.rotateState} _hide={self._hide} classname={_state.classname}/>
            );
        };
        var operateNodes = function(){
            if(playstate == 0){
                return (
                    <div className='operate'>
                        <div className='share icon' id='fullshare' onTouchEnd={self._share}></div>
                        <div className='edit icon' id='edit' onTouchEnd={self._edit}></div>
                        <div className='exitfull icon' id='exitfull' onTouchEnd={self._exitfull}></div>
                    </div>
                );
            }
        };
        var inputboxNodes = function(){
            return (
                <InputBox share={self._share} _focus={self._focus} _blur={self._blur} inputstate={_state.inputstate} login={this._login} handleSubmit={self.handleSubmit}/>
            );
        };
        var shareboxNodes = function(){
            return (
                <div className='sharebox' id='sharebox'>
                    <div className={self.state.sharestate} id='sharecon' onTouchEnd={self._sharecon}>
                        <div className='app float_left' onTouchEnd={self._shareto}>
                            <div className='appicon wechat'></div>
                            <div className='appname size_36 color_6e6e6e'>微信</div>
                        </div>
                        <div className='app float_left' onTouchEnd={self._shareto}>
                            <div className='appicon friend'></div>
                            <div className='appname size_36 color_6e6e6e'>朋友圈</div>
                        </div>
                        <div className='app float_left' data-app="sinaWeibo" onTouchEnd={self._sharetowb}>
                            <div className='appicon weibo'></div>
                            <div className='appname size_36 color_6e6e6e'>微博</div>
                        </div>
                        <div className='app float_left' onTouchEnd={self._shareto}>
                            <div className='appicon qq'></div>
                            <div className='appname size_36 color_6e6e6e'>QQ好友</div>
                        </div>
                        <div className='app float_left nomargin' data-app="QZone" onTouchEnd={self._sharetozone}>
                            <div className='appicon zone'></div>
                            <div className='appname size_36 color_6e6e6e'>QQ空间</div>
                        </div>
                        <div className='please size_44 color_6e6e6e'>
                            <span className='icon'></span>
                            <span className='pleasetext'>请用浏览器的分享功能进行分享</span>
                        </div>
                    </div>
                </div>
            );
        };
        var sharewxNodes = function(){
            return (
                <div className='sharewxWrap' id='sharewxWrap'>
                    <div className='sharewx'></div>
                </div>
            );
        };
        return (
            <div className={this.state.classname} onTouchEnd={this._hide} id={this.playState}>
                {fixNodes()}
                {commentNodes()}
                {operateNodes()}
                {inputboxNodes()}
                {shareboxNodes()}
                {sharewxNodes()}
            </div>

        );
    }
});

module.exports = LiveWrap;