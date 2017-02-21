var React = require('react');
var Comment = require('../components/live_comment');
var utils = require('../components/utils');

var playstate = 1;

var CommentList = React.createClass({
    getInitialState: function(){
        _this = this;
        this.commentTimer = null;
        this.getComment();
        return {data: []};
    },
    point: {
        startpoint: 0,
        movepoint: 0
    },
    _start: function(e) {
        if(playstate == 0){
            clearTimeout(this.commentTimer);
            if(this.props.classname == "wrap fullwrap" && this.props.rotateState != 1){   //全屏&&屏幕未旋转
                this.point.startpoint = e.changedTouches[0].clientX;
            }
            else{
                this.point.startpoint = e.changedTouches[0].clientY;
            }
            e.preventDefault();
        }
       
        e.stopPropagation();
    },
    _moveFunction: function(curTop, list){
        var _self = this;
        list.style.transform = 'translateY('+ curTop + 'px)';
    },
    _move: function(e) { //手指滑动评论区
        // if(playstate == 0){
            if(parseInt(utils.getStyle('commentList').height) <= parseInt(utils.getStyle('commentbox').height))return;
        
            var list = document.getElementById('commentList');
            var curTop = (list.style.transform || list.style.WebkitTransform).replace('translateY(', '').replace('px)', '');

            curTop = curTop == '' ? 0 : parseInt(curTop);

            if(this.props.classname == "wrap fullwrap" && this.props.rotateState != 1){   //全屏&&屏幕未旋转
                this.point.movepoint = e.changedTouches[0].clientX;
                if(this.point.startpoint > this.point.movepoint){ //手指向下滑动，评论区向下滚动
                    curTop = curTop >= 0 ? 0 : curTop + this.point.startpoint - this.point.movepoint;
                }
                else{   //手指向上滑动，评论区向上滚动
                    curTop = curTop - (this.point.movepoint - this.point.startpoint);
                    if(parseInt(utils.getStyle('commentbox').height) - curTop >= parseInt(utils.getStyle('commentList').height)){
                        curTop = parseInt(utils.getStyle('commentbox').height) - parseInt(utils.getStyle('commentList').height);
                    }
                }
            }
            else{
                this.point.movepoint = e.changedTouches[0].clientY;

                if(this.point.startpoint > this.point.movepoint){ //手指向上滑动，评论区向下滚动
                    curTop -= (this.point.startpoint - this.point.movepoint);
                    if(parseInt(utils.getStyle('commentbox').height) - curTop >= parseInt(utils.getStyle('commentList').height)){
                        curTop = parseInt(utils.getStyle('commentbox').height) - parseInt(utils.getStyle('commentList').height);
                        
                    }
                }
                else{   //手指向下滑动，评论区向上滚动
                    curTop = curTop >= 0 ? 0 : curTop + (this.point.movepoint - this.point.startpoint);
                }
            }
            this.point.startpoint = this.point.movepoint;
            this.moveFlag = 0;

            console.log(curTop)

            this._moveFunction(curTop, list);
            e.preventDefault();  
        // }
        
        e.stopPropagation();
    },
    _end: function(e){
        if(playstate == 0){
            this.commentTimer = setTimeout(function(){
                utils.setScroll();
            }, 5000);
        }
        if(utils.getStyle('sharebox').display != 'none')this.props._hide(e, 'comment');
        e.stopPropagation();
       
    },
    getComment: function(){
        var _this = this;
        setTimeout(function(){
            var commentList = [{
                host_name: '测试用户1',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论我是评论我是评论我是评论我是评论我是评论'
            },{
                host_name: '测试用户2',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论我是评论我是评论我是评论我是评论我是评论'
            },{
                host_name: '测试用户3',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论我是评论我是评论我是评论我是评论我是评论'
            },{
                host_name: '测试用户4',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论'
            },{
                host_name: '测试用户5',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论我是评论'
            },{
                host_name: '测试用户6',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论我是评论我是评论我是评论'
            },{
                host_name: '测试用户7',
                host_avatar: '',
                host_type: 0,
                isown: '',
                id: '',
                content: '我是评论'
            }];

            var _conLen = commentList.length;
            var timer = 3000 / _conLen;
            var ind = 0;

            var myTimer = setInterval(function(){  
                if(ind == _conLen - 1){
                    clearInterval(myTimer);
                }
                if(commentList[_conLen - (++ind)].content + '' != ''){
                    commentList.push(commentList[_conLen - ind]);
                    _this.setState({data: commentList});
                    lastId = commentList[_conLen - ind].id;
                }
            }, timer);

        }, 100);
        
    },
    componentDidMount: function(){
        var _self = this;
        _self.commentDom = document.getElementById('commentList');
        _self.commentDom.addEventListener('touchmove', function(e){
            _self._move(e);
        }); 
    },
    render: function() {
        var commentNodes = this.state.data.map(function(comment) {
            console.log('123')
            // this.host_avatar = comment.host_avatar == '' ? '' : comment.host_avatar.indexOf('ifengimg.com') > -1 && comment.host_avatar.indexOf('d.ifengimg.com') < 0 ? 'http://d.ifengimg.com/w150_h150/' + comment.host_avatar.replace('http://', '') : comment.host_avatar;
            return (
                <Comment host_name={comment.host_name} host_avatar={this.host_avatar} host_type={comment.host_type} isown={comment.isown} conid={comment.id}>
                    {comment.content}
                </Comment>
            );
        });
        return (
            <div id='commentbox' className='comment'>
                <ul className='commentList' id='commentList' onTouchStart={this._start} onTouchEnd={this._end}>
                   {commentNodes}
                </ul>
            </div>
        );
    }
});

module.exports = CommentList;