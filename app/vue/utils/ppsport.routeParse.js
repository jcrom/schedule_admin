!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.routeParse=e():(t.ppsport=t.ppsport||{},t.ppsport.routeParse=e())}(window,function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],o=!0,r=!1,c=void 0;try{for(var a,i=t[Symbol.iterator]();!(o=(a=i.next()).done)&&(n.push(a.value),!e||n.length!==e);o=!0);}catch(t){r=!0,c=t}finally{try{o||null==i.return||i.return()}finally{if(r)throw c}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function r(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var c="m.ppsport.com",a="pptvsports:",i="m.ppsport.com",p="pptvsports://page/home",u="/pages/index/index",d="sports.pptv.com",s=n(1),f=s.encodeChannel,l=s.decodeChannel,m=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.url=h(e),function(t){"string"==typeof t&&(t=h(t));var e,n=t,o=n.protocol,r=n.host;o===a?e="app":o||"pages"!==r?/^m(sps.*?)?\.ppsport\.com/.test(r)?e="m":/(.*?)\.pptv\.com/.test(r)&&(e="pc"):e="mp";if(!e)return;t.platform=e}(this.url),function(t){var e=t.platform,n=t.pathname,o=[{pageType:"index",mp:"/index/index",m:function(t){return!t.pathname||"/"==t.pathname},pc:function(t){return!t.pathname||"/"==t.pathname},app:"/home"},{pageType:"livelist",mp:"/livelist/livelist",m:"/livelist",pc:"/list/sports_program/index.html",app:"/live/hot"},{pageType:"shortvideolist",mp:"/shortvideolist/shortvideolist",m:"/shortvideolist",pc:function(t){return/^\/sports$/.test(t.pathname)&&52==t.query.fb},app:function(t){return!1}},{pageType:"matchdata",mp:"/matchdata/matchdata",m:/^\/matchdata(\/\d+)?/,pc:function(t){return!1},app:"/dataChannel/scoreboard"},{pageType:"live",mp:"/live/live",m:function(t){return v(t,/^\/live\//,/^\/live\/([^\.\/]{15,18})/,"sectionId")},pc:"/sportslive",app:"/live/detail"},{pageType:"sportstv",mp:function(t){return!1},m:function(t){return v(t,/^\/sports\//,/^\/sports\/([^\.\/]{15,18})/,"sectionId")},pc:function(t){return!1},app:function(t){return!1}},{pageType:"news",mp:"/news/news",m:function(t){return v(t,/^\/news\//,/^\/news\/(\d+)/,"contentId")},pc:function(t){return"/article/pg_detail"===t.pathname&&"article"===t.query.type},app:function(t){return"/news/detail/"===t.pathname&&1==t.query.contenttype}},{pageType:"videonews",mp:"/videonews/videonews",m:function(t){return v(t,/^\/videonews\//,/^\/videonews\/([^\.\/]{4,18})/,"contentId")},pc:function(t){return!1},app:function(t){return"/news/detail/"===t.pathname&&3==t.query.contenttype}},{pageType:"video",mp:"/video/video",m:function(t){return v(t,/^\/video\//,/^\/video\/([^\.\/]{15,18})/,"videoId")},pc:function(t){return v(t,/^\/show\//,/^\/show\/([^\.\/]{15,18})/,"videoId")},app:function(t){return"/news/detail/"===t.pathname&&4==t.query.contenttype}},{pageType:"shortvideo",mp:"/shortvideo/shortvideo",m:function(t){return v(t,/^\/shortvideo\//,/^\/shortvideo\/([^\.\/]{4,18})/,"videoId")},pc:function(t){return!1},app:"/news/video/"},{pageType:"images",mp:"/imggroup/imggroup",m:function(t){return v(t,/^\/images\//,/^\/images\/([^\.\/]{4,18})/,"contentId")},pc:function(t){return"/article/pg_detail"===t.pathname&&"photos"===t.query.type},app:"/news/atlas/"},{pageType:"dailyshare",mp:"/daily/daily",m:function(t){return v(t,/^\/dailyshare\//,/^\/dailyshare\/([^\.\/]{4,18})/,"contentId")},pc:function(t){return!1},app:function(t){return"/news/detail/"==t.pathname&&6==t.query.contenttype}},{pageType:"post",mp:"/post/post",m:/^\/post(\.html)?$/,pc:function(t){return!1},app:"/post/show/"},{pageType:"matchvideo",mp:"/matchvideo/matchvideo",m:function(t){return v(t,/^\/matchvideo\//,/^\/matchvideo\/([^\.\/]{4,18})/,"videoId")},pc:function(t){return!1},app:function(t){return"/news/detail/"==t.pathname&&t.query.match_id&&t.query.vid}},{pageType:"topic",mp:"/topic/topic",m:function(t){return v(t,/^\/topic\//,/^\/topic\/([^\.\/]{1,18})/,"contentId")},pc:function(t){return"/topic"},app:"/news/subject/"}],r=o.find(function(o){var r=o[e];return"string"==typeof r?r==n:"function"==typeof r?r(t):r instanceof RegExp&&r.test(n)});r=r||o[0],t.pageType=r&&r.pageType}(this.url)}return function(t,e,n){e&&r(t.prototype,e),n&&r(t,n)}(t,[{key:"getUrl",value:function(t){var e=this,n={index:{mp:function(t){return u},m:function(t){return i},app:function(t){return p},pc:function(t){return d}},livelist:{mp:function(t){return"/pages/livelist/livelist"},m:function(t){return"".concat(c,"/livelist")},app:function(t){return"".concat(a,"//page/live/hot")},pc:function(t){return"zhibo.pptv.com/list/sports_program/index.html"}},shortvideolist:{mp:function(t){return"/pages/shortvideolist/shortvideolist"},m:function(t){return"".concat(c,"/shortvideolist")},app:function(t){return"".concat(p)},pc:function(t){return"top.pptv.com/sports?fb=52"}},matchdata:{mp:function(t){return"/pages/matchdata/matchdata"},m:function(t){return"".concat(c,"/matchdata")},app:function(t){return"".concat(a,"//page/dataChannel/scoreboard/")},pc:function(t){return"".concat(d)}},live:{sameParams:[["sectionId","sectionid","section_id"]],mp:function(t){return"/pages/live/live?sectionId=".concat(y(t.query.sectionId,"decode"))},m:function(t){return"".concat(c,"/live/").concat(y(t.query.sectionId,"encode"))},app:function(t){return"".concat(a,"//page/live/detail/?section_id=").concat(y(t.query.sectionId,"decode"))},pc:function(t){return"sports.pptv.com/sportslive?sectionid=".concat(y(t.query.sectionId,"decode"))}},sportstv:{mp:function(t){return u},m:function(t){return"".concat(c,"/sports/").concat(y(t.query.sectionId,"encode"))},app:function(t){return"".concat(a,"//page")},pc:function(t){return"v.pptv.com/show/".concat(y(t.query.sectionId,"encode"),".html")}},news:{sameParams:[["contentId","content_id","aid"]],mp:function(t){return"/pages/news/news?contentId=".concat(t.query.contentId)},m:function(t){return"".concat(c,"/news/").concat(t.query.contentId)},app:function(t){return"".concat(a,"//page/news/detail/?content_id=").concat(t.query.contentId,"&contenttype=1")},pc:function(t){return"sports.pptv.com/article/pg_detail?aid=".concat(t.query.aid,"&type=article")}},videonews:{sameParams:[["contentId","content_id","aid"]],mp:function(t){return"/pages/videonews/videonews?contentId=".concat(t.query.contentId)},m:function(t){return"".concat(c,"/videonews/").concat(t.query.contentId)},app:function(t){return"".concat(a,"//page/news/detail/?content_id=").concat(t.query.contentId,"&contenttype=3")},pc:function(t){return"sports.pptv.com/article/pg_detail?aid=".concat(t.query.aid,"&type=article")}},video:{sameParams:[["videoId","vid"]],mp:function(t){return"/pages/video/video?videoId=".concat(y(t.query.videoId,"decode"))},m:function(t){return"".concat(c,"/video/").concat(y(t.query.videoId,"encode"))},app:function(t){return"".concat(a,"//page/news/detail/?vid=").concat(y(t.query.videoId,"decode"),"&contenttype=4")},pc:function(t){return"v.pptv.com/show/".concat(y(t.query.videoId,"encode"),".html")}},shortvideo:{sameParams:[["videoId","content_id"]],mp:function(t){return"/pages/shortvideo/shortvideo?videoId=".concat(y(t.query.videoId,"decode"))},m:function(t){return"".concat(c,"/shortvideo/").concat(y(t.query.videoId,"decode"))},app:function(t){return"".concat(a,"//page/news/video/?content_id=").concat(y(t.query.videoId,"decode"))},pc:function(t){return"v.pptv.com/show/".concat(y(t.query.videoId,"encode"),".html")}},images:{sameParams:[["contentId","aid","image_id"]],mp:function(t){return"/pages/imggroup/imggroup?contentId=".concat(t.query.contentId)},m:function(t){return"".concat(c,"/images/").concat(t.query.contentId)},app:function(t){return"".concat(a,"//page/news/atlas/?image_id=").concat(t.query.contentId)},pc:function(t){return"sports.pptv.com/article/pg_detail?aid=".concat(t.query.aid,"&type=photos")}},dailyshare:{sameParams:[["contentId","content_id"]],mp:function(t){return"/pages/daily/daily?contentId=".concat(t.query.contentId)},m:function(t){return"".concat(c,"/dailyshare/").concat(t.query.contentId)},app:function(t){return"".concat(a,"//page/news/detail/?content_id=").concat(t.query.content_id,"&contenttype=6")},pc:function(t){return"".concat(d)}},post:{mp:function(t){return"/pages/post/post?id=".concat(t.query.id,"&cid=").concat(t.query.cid||"")},m:function(t){return"".concat(c,"/post?id=").concat(t.query.id,"&cid=").concat(t.query.cid||"")},app:function(t){return"".concat(a,"//page/post/show/?id=").concat(t.query.id,"&cid=").concat(t.query.cid||"")},pc:function(t){return"".concat(d)}},matchvideo:{sameParams:[["match_id","matchId"],["vid","videoId"]],mp:function(t){return"/pages/matchvideo/matchvideo?videoId=".concat(y(t.query.videoId,"decode"),"&matchId=").concat(t.query.matchId||"")},m:function(t){return"".concat(c,"/matchvideo/").concat(y(t.query.videoId,"encode"),"?match_id=").concat(t.query.match_id)},app:function(t){return"".concat(a,"//page/news/detail/?match_id=").concat(t.query.match_id,"&vid=").concat(y(t.query.videoId,"decode"))},pc:function(t){return"v.pptv.com/show/".concat(y(t.query.videoId,"encode"),".html")}},topic:{sameParams:[["contentId","channel_id","aid"]],mp:function(t){return"/pages/topic/topic?contentId=".concat(t.query.contentId)},m:function(t){return"".concat(c,"/topic/").concat(t.query.contentId)},app:function(t){return"".concat(a,"//page/news/subject/?channel_id=").concat(t.query.channel_id)},pc:function(t){return"sports.pptv.com/topic?aid=".concat(t.query.aid)}}}[this.url.pageType];if(n&&n[t]){var o=n.sameParams;return o&&o.forEach(function(t){var n=t.find(function(t){return e.url.query[t]});n=e.url.query[n],t.forEach(function(t){return e.url.query[t]=n})}),n[t](this.url)}}}]),t}();function h(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n={protocol:/(.*?):\/\/(.*)/,hash:/(.*?)#(.*)/,search:/(.*?)\?(.*)/,path:/(.*?)\/(.*)/,port:/(.*?):(\d+)/},r={href:e,query:{}},c=n.protocol.exec(e);c?(r.protocol="".concat(c[1],":"),t=c[2]):t=e;var a=n.hash.exec(t);a&&(r.hash=a[2],t=a[1]);var i=n.search.exec(t);i&&(r.search="?".concat(i[2]),i[2].split("&").forEach(function(t){var e=o(t.split("="),2),n=e[0],c=e[1];r.query[decodeURIComponent(n)]=decodeURIComponent(c)}),t=i[1]);var p=n.path.exec(t);p&&(r.pathname="/".concat(p[2]),r.path="/".concat(p[2]).concat(r.search||""),t=p[1]);var u=n.port.exec(t);return u&&(r.port=u[2],t=u[1]),r.host=t,r}function v(t,e){if(e.test(t.pathname)){for(var n=arguments.length,r=new Array(n>2?n-2:0),c=2;c<n;c++)r[c-2]=arguments[c];for(;r&&r.length>0;){var a=o(r.splice(0,2),2),i=a[0],p=a[1];if(i&&p){var u=i.exec(t.pathname);u&&(t.query[p]=u[1])}}return!0}return!1}function y(t,e){var n;return/^\d{6,8}$/.test(t)?n="decode":/^\w{15,18}$/.test(t)&&(n="encode"),e==n?t:"encode"==e?f(t):"decode"==e?l(t).channelId:void 0}e.transSid=y,e.RouteParse=m},function(t,e,n){var o=n(2),r=o.encode,c=o.decode,a="p>c~hf".split("").map(function(t){return t.charCodeAt(0)});t.exports={encodeChannel:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,c=e>65535?13:11,i=new ArrayBuffer(c),p=new DataView(i);p.setInt32(0,t,!0),p.setInt32(4,n,!0),11===c?p.setInt16(8,e,!0):p.setInt32(8,e,!0),p.setInt8(c-1,o);var u=new Uint8Array(p.buffer);if(u.forEach)u.forEach(function(t,e){0!==e&&(u[e]=(t^u[e-1])+a[e%a.length],u[e]&=255)});else for(var d=0;d<u.length;d++){var s=u[d];0!==d&&(u[d]=(s^u[d-1])+a[d%a.length],u[d]&=255)}var f=r(String.fromCharCode.apply(null,u));return f=f.replace(/i/g,"ia").replace(/\+/g,"ib").replace(/\//g,"ic").replace(/=/g,"")},decodeChannel:function(t){if(t){var e=t.replace(/ic/g,"/").replace(/ib/g,"+").replace(/ia/g,"i"),n=e.length%4;if(n>0)switch(n=4-n){case 1:e+="=";break;case 2:e+="==";break;case 3:e+="==="}for(var o=c(e),r=new Uint8Array(o.split("").map(function(t){return t.charCodeAt(0)})),i=r.length;--i>0;)r[i]-=a[i%a.length],r[i]^=r[i-1];var p=new DataView(r.buffer),u=p.getUint32(0,!0),d=p.getUint32(4,!0),s=0,f=0;return 11===r.length?(s=p.getUint16(8,!0),f=p.getUint8(10,!0)):r.length>11&&(s=p.getUint32(8,!0),f=p.getUint8(12,!0)),{channelId:u,setId:d,cateId:s,source:f}}},urlParamsGetSectionId:function(t){return t.indexOf(".")>0?t.substring(0,t.indexOf(".")):t.substring(0,t.length)}}},function(t,e){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=/<%= spaceCharacters %>/g;t.exports={encode:function(t){t=String(t),/[^\0-\xFF]/.test(t)&&error("The string to be encoded contains characters outside of the Latin1 range.");for(var e,o=t.length%3,r="",c=-1,a=t.length-o;++c<a;)e=(t.charCodeAt(c)<<16)+(t.charCodeAt(++c)<<8)+t.charCodeAt(++c),r+=n.charAt(e>>18&63)+n.charAt(e>>12&63)+n.charAt(e>>6&63)+n.charAt(63&e);return 2==o?(e=(t.charCodeAt(c)<<8)+t.charCodeAt(++c),r+=n.charAt(e>>10)+n.charAt(e>>4&63)+n.charAt(e<<2&63)+"="):1==o&&(e=t.charCodeAt(c),r+=n.charAt(e>>2)+n.charAt(e<<4&63)+"=="),r},decode:function(t){var e=(t=String(t).replace(o,"")).length;e%4==0&&(e=(t=t.replace(/==?$/,"")).length),(e%4==1||/[^+a-zA-Z0-9/]/.test(t))&&error("Invalid character: the string to be decoded is not correctly encoded.");for(var r,c,a=0,i="",p=-1;++p<e;)c=n.indexOf(t.charAt(p)),r=a%4?64*r+c:c,a++%4&&(i+=String.fromCharCode(255&r>>(-2*a&6)));return i}}}])});