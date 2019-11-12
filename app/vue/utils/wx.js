import wx from '../vendors/jweixin-1.2.0';
import { handleUrl } from './wx_share';

const { location, $ } = window;
const shareUrl = (location.href.includes('#')
  ? location.href.substr(0, location.href.indexOf('#'))
  : location.href);
let promise;

if (/pptv\.com/.test(location.hostname)) {
  const url = 'http://aplusapi.pptv.com/huodong/wxfx/';
  promise = new Promise((resolve, reject) => {
    $.ajax({
      url,
      type: 'GET',
      catch: true,
      dataType: 'jsonp',
      jsonp: 'cb',
      data: { url: shareUrl },
      success(res) {
        const { appId, timestamp, nonceStr, signature } = res;
        wx.config({
          debug: !1,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'updateAppMessageShareData',
            'updateTimelineShareData',
          ],
        });
        wx.ready(() => {
          resolve(wx);
        });
        wx.error((err) => {
          reject(err);
        });
      },
    });
  });
} else {
  const url = '/wx/utils/getJsSDKSign.htm';

  promise = new Promise((resolve, reject) => {
    $.ajax({
      url,
      catch: true,
      type: 'GET',
      dataType: 'json',
      data: { curUrl: shareUrl },
      success(res) {
        if (res.result) {
          const { nonceStr, timestamp, signature, appId } = res.data;
          wx.config({
            debug: !1,
            appId,
            nonceStr,
            timestamp,
            signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'updateAppMessageShareData', 'updateTimelineShareData'],
          });
          wx.ready(() => {
            resolve(wx);
          });
          wx.error((err) => {
            reject(err);
          });
        }
      },
    });
  });
}

function shareConfig(config) {
  promise.then((nwx) => {
    const imgUrl = `${location.origin}/static/images/logo.png`;
    const conf = {
      imgUrl: config.imgUrl || imgUrl,
      // appid: appId,
      title: config.title || '《PP体育》 体育赛事高清直播',
      // imgHeight: '65',
      // imgWidth: '65',
      desc: config.desc || '上PP体育，过足球瘾',
      link: handleUrl(decodeURIComponent(config.link)),
      // link: decodeURIComponent(config.link),
      success: () => {
      },
      cancel: () => {
      },
      // ...config,
    };
    if (nwx.updateAppMessageShareData || nwx.updateTimelineShareData) {
      nwx.updateAppMessageShareData(conf);
      nwx.updateTimelineShareData(conf);
    } else {
      nwx.onMenuShareTimeline(conf);
      nwx.onMenuShareAppMessage(conf);
      nwx.onMenuShareQQ(conf);
      nwx.onMenuShareWeibo(conf);
    }
  });
}

export { wx, shareConfig };
