import { utils } from '../vendors/utils';
import { decodeChannel, urlParamsGetSectionId } from '../utils/channel';
import Clipboard from '../vendors/clipboard.min';

let proms;
/**
 * 根据页面地址生成
 *
 * @param {any} [route={}]
 * route 为对象时, 根据router的参数配置拉起地址
 * route 为String,且以pptvsports://开头时,直接以route为拉起地址
 * @returns { openApp, getDownloadLink }
 */

// huawei todo
// function showOpenBrowser() {
//   const { $ } = window;
//   const $ele = $(`
//     <div style="position:fixed;
//       top:0;bottom:0;left:0;right:0;
//       z-index:19999999;
//       background:#000;opacity:.7;">
//       <img src="">
//     </div>
//   `);
//   $ele.appendTo('body').click((event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     $ele.remove();
//   });
// }

function downloadFactory(route = {}) {
  const APP_DOWNLOAD_URLS = {
    DOWNLOADSIT: '//mspssit.ppsport.com/download_m.html',
    DOWNLOADPRD: '//m.ppsport.com/download_m.html',
    YINGYONGBAO: '//a.app.qq.com/o/simple.jsp?pkgname=com.pplive.androidphone.sport',
    IOS: 'https://itunes.apple.com/cn/app/id627781309?mt=8',
    BAIDUIOS: 'https://itunes.apple.com/app/apple-store/id627781309?pt=465985&ct=baidu&mt=8',
    SHOUGOUIOS: 'https://itunes.apple.com/app/apple-store/id627781309?pt=465985&ct=sogou&mt=8',
    SHENMAIOS: 'https://itunes.apple.com/app/apple-store/id627781309?pt=465985&ct=shenma&mt=8',
    ANDROID: {
      STATIC: 'http://download.pplive.com/aphone/pptv_sport_phone_s010.apk',
      REMOTE(channelId) {
        return `http://vfast.suning.com/mts-web/channelpack/queryChannelPack_2000_149_${channelId}_callbackChannel.html`;
      },
    },
    HUAWEI: 'http://download.pplive.com/aphone/waterdrop_SIT_0316_1930_1.0.apk',
    PPTV: 'https://app.aplus.pptv.com/minisite/download/',
  };

  // huawei todo
  // const appRootUrl = `pptvsports${utils.isHuaWeiPlatform() ? 'hw' : ''}://`;
  const appRootUrl = 'pptvsports://';

  const PAGE_TYPES = {
    DERBY: 'livederby',
    LIVE: 'live',
    ANIM_LIVE: 'animlive',
    NEWS: 'news',
    VIDEO: 'video',
    IMAGES: 'images',
    VIDEONEWS: 'videonews',
    SPORTS: 'sports',
    TOPIC: 'topic',
    SHORTVIDEONEWS: 'shortvideonews',
    // POST: 'post',
    DAILYSHARE: 'dailyshare',
    SHORTVIDEO: 'shortvideo',
    SGVSYF: 'cslMatchSport',
    SCHEDULE: 'schedule',
  };

  if (IsServer) {
    return {};
  }
  const win = window;
  const { $, navigator } = win;
  const params = utils.getLocationSearchObj();
  if (route.params) {
    Object.keys(route.params).forEach((p) => {
      params[p] = route.params[p];
    });
  }
  // console.info(`\n\n\n\n\n\n\nparams：\n${JSON.stringify(params)}\n\n\n\n\n\n\n`);
  // console.info(`\n\n\n\n\n\n\nparams：\n${route.name}\n\n\n\n\n\n\n`);
  const pageType = (params.pageType || route.name || '').toLowerCase();
  // ddl 用来配置只下载，不拉起
  // frompptv 用来配置跳转到pptv的下载页
  const { rcc_channel_id: rccChannelId, utm_source: utmSource, ddl, frompptv } = params;
  let appUrl;
  const AppUriHome = 'home/?1=1';
  const argIsSchemeUrl = typeof route === 'string' && /^pptvsports/.test(route);
  if (argIsSchemeUrl) {
    appUrl = route;
  } else {
    switch (pageType) {
      case PAGE_TYPES.SCHEDULE: {
        // appUrl = 'live/hot/?1=1';
        appUrl = AppUriHome;
        break;
      }
      case PAGE_TYPES.SGVSYF: {
        const sectionId = 139674;
        appUrl = sectionId ?
          `live/detail/?section_id=${sectionId || ''}` : AppUriHome;
        break;
      }
      case PAGE_TYPES.DERBY: {
        const sectionId = 137403;
        appUrl = sectionId ?
          `live/detail/?section_id=${sectionId || ''}` : AppUriHome;
        break;
      }
      case PAGE_TYPES.LIVE: {
        const sectionId = decodeChannel(urlParamsGetSectionId(params['0'])).channelId;
        appUrl = sectionId ?
          `live/detail/?section_id=${sectionId || ''}` : AppUriHome;
        break;
      }
      case PAGE_TYPES.ANIM_LIVE: {
        const matchId = urlParamsGetSectionId(params['0']);
        appUrl = matchId ?
          `live/matchdetail/?match_id=${matchId || ''}` : AppUriHome;
        break;
      }
      case PAGE_TYPES.VIDEO: {
        const videoId = decodeChannel(urlParamsGetSectionId(params['0'])).channelId;
        appUrl = videoId ?
          `news/detail/?vid=${videoId || ''}&contenttype=4` : AppUriHome;
        break;
      }
      case PAGE_TYPES.NEWS: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/detail/?content_id=${contentId}&contenttype=1` : AppUriHome;
        break;
      }
      case PAGE_TYPES.IMAGES: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/atlas/?image_id=${contentId}` : AppUriHome;
        break;
      }
      case PAGE_TYPES.VIDEONEWS: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/detail/?content_id=${contentId}&contenttype=3` : AppUriHome;
        break;
      }
      case PAGE_TYPES.SHORTVIDEONEWS: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/video/?content_id=${contentId}` : AppUriHome;
        break;
      }
      case PAGE_TYPES.TOPIC: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/subject/?channel_id=${contentId}` : AppUriHome;
        break;
      }
      // case PAGE_TYPES.POST: {
      //   const postCid = params.cid;
      //   const postId = params.id;
      //   const postVideoId = localStorage.getItem('postVideoId');
      //   if (postVideoId) {
      //     appUrl = postId
      //      ? `videopost/detail/show/?clubId=${postCid}&id=${postId}&videoId=${postVideoId}`
      //      : AppUriHome;
      //   } else {
      //     appUrl = postId ? `post/show/?clubId=${postCid}&id=${postId}` : AppUriHome;
      //   }
      //   break;
      // }
      case PAGE_TYPES.DAILYSHARE: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/detail/?content_id=${contentId}&contenttype=6` : AppUriHome;
        break;
      }
      case PAGE_TYPES.SHORTVIDEO: {
        const contentId = urlParamsGetSectionId(params['0']);
        appUrl = contentId ?
          `news/detail/?vid=${contentId}&contenttype=4` : AppUriHome;
        break;
      }
      default:
        appUrl = AppUriHome;
        break;
    }

    // 配置utm_source和from参数,作为app应用拉起来源的埋点参数
    appUrl = `${appUrl}&utm_source=${utmSource || 's010'}&from=${utils.isWechat() ? 'MWechat' : 'MOther'}`;
    appUrl = `${appRootUrl}page/${appUrl}`;
  }

  let platform;
  if (utils.isWechat()) {
    platform = 'wechat';
  } else if (utils.isWeibo()) {
    platform = 'weibo';
  } else if (utils.isIos()) {
    platform = 'ios';
  } else {
    platform = 'android';
  }

  proms = proms || new Promise((resolve) => {
    if (frompptv) {
      resolve(APP_DOWNLOAD_URLS.PPTV);
      return;
    }
    switch (platform) {
      case 'wechat': {
        if (utils.isIos()) {
          resolve(APP_DOWNLOAD_URLS.YINGYONGBAO);
        } else {
          const openurl = `openurl=${encodeURIComponent(appUrl)}`;
          let downloadUrl;
          if (location.hostname.indexOf('m.ppsport.com') > -1) {
            downloadUrl = `${APP_DOWNLOAD_URLS.DOWNLOADPRD}?${openurl}`;
          } else if (location.hostname.indexOf('mspssit.ppsport.com') > -1) {
            downloadUrl = `${APP_DOWNLOAD_URLS.DOWNLOADSIT}?${openurl}`;
          } else {
            downloadUrl = `${APP_DOWNLOAD_URLS.DOWNLOADPRD}?${openurl}`;
          }
          resolve(downloadUrl);
        }
        break;
      }
      case 'weibo': {
        const openurl = `openurl=${encodeURIComponent(appUrl)}`;
        let downloadUrl;
        if (location.hostname.indexOf('m.ppsport.com') > -1) {
          downloadUrl = `${APP_DOWNLOAD_URLS.DOWNLOADPRD}?${openurl}`;
        } else if (location.hostname.indexOf('mspssit.ppsport.com') > -1) {
          downloadUrl = `${APP_DOWNLOAD_URLS.DOWNLOADSIT}?${openurl}`;
        } else {
          downloadUrl = `${APP_DOWNLOAD_URLS.DOWNLOADPRD}?${openurl}`;
        }
        resolve(downloadUrl);
        break;
      }
      case 'ios': {
        if (utmSource === 's215') {
          resolve(APP_DOWNLOAD_URLS.BAIDUIOS);
        } else if (utmSource === 's216') {
          resolve(APP_DOWNLOAD_URLS.SHOUGOUIOS);
        } else if (utmSource === 's217') {
          resolve(APP_DOWNLOAD_URLS.SHENMAIOS);
        } else {
          resolve(APP_DOWNLOAD_URLS.IOS);
        }
        break;
      }
      // huawei todo
      // case 'huawei': {
      //   resolve(APP_DOWNLOAD_URLS.HUAWEI);
      //   break;
      // }
      case 'android':
      default: {
        const channelId = utmSource || rccChannelId;
        if (channelId && channelId !== -1) {
          $.ajax({
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            jsonp: '_callback',
            jsonpCallback: 'callbackChannel',
            url: APP_DOWNLOAD_URLS.ANDROID.REMOTE(channelId),
            success: (res) => {
              if (res.data) {
                resolve(res.data);
              } else {
                resolve(APP_DOWNLOAD_URLS.ANDROID.STATIC);
              }
            },
          });
        } else {
          resolve(APP_DOWNLOAD_URLS.ANDROID.STATIC);
        }
        break;
      }
    }
  });

  function download() {
    proms.then((downloadLink) => {
      win.location.href = downloadLink;
    });
  }

  function openApp() {
    // 如果是配置的来自于pptv，则直接跳转到pptv的下载页
    if (frompptv) {
      download();
      return;
    }
    const regexp = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    const uapc = navigator.userAgent;
    if (!regexp.test(uapc)) { // pc端直接跳下载页面
      window.location.href = '//m.ppsport.com/static/extensionPage/extension.html';
      return;
    }
    if (ddl === '1') {
      download();
    } else if (utils.isWechat() || utils.isWeibo()) {
      // 复制内容到剪贴板
      const fakeEl = document.createElement('button');
      const clipboard = new Clipboard(fakeEl, {
        text: () => `￥openurl￥${appUrl}￥${Date.now()}￥`,
        action: () => 'copy',
      });
      clipboard.on('success', () => {
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        clipboard.destroy();
      });
      fakeEl.click();
      download();
    } else if (utils.isIos()) {
      const ua = navigator.userAgent;
      const chromeV = /Chrome\//.test(ua) && !/Version\/4/.test(ua);
      if (/Chrome/i.test(ua) && chromeV) {
        const chromeVer = /Chrome\/(\d{2})/i.exec(ua);
        if (chromeVer && parseInt(chromeVer[1], 10) < 35) {
          win.location.href = appUrl;
        } else {
          const openTab = win.open(appUrl);
          setTimeout(() => openTab && openTab.close(), 1000);
        }
        download();
      } else {
        window.location.href = appUrl;
        window.setTimeout(() => {
          if (document.visibilityState !== 'hidden' && !utils.isPPTVSports()) {
            download();
          }
        }, 1500);
      }
    } else {
      let downloadDelay = 1500;
      // 三星手机采用win.open方式拉起app
      if (utils.isSamsung()) {
        const openTab = win.open(appUrl);
        setTimeout(() => openTab && openTab.close(), 1500);
      }
      // 华为手机采用location方式拉起app
      if (utils.isHuaWeiPlatform()) {
        // 华为手机win.open会有新tab切换动效，导致1500后close操作必须与下面的判断操作更早。
        // 所以这里后置判断设置为1800
        downloadDelay = 1800;
        window.location.href = appUrl;
      }
      window.setTimeout(() => {
        const child = document.querySelector('#openappiframe');
        document.getElementsByTagName('body')[0].removeChild(child);
        if (document.visibilityState !== 'hidden' && !utils.isPPTVSports()) {
          download();
        }
      }, downloadDelay);
      const f = document.createElement('iframe');
      f.setAttribute('id', 'openappiframe');
      f.setAttribute('style', 'display:none');
      f.setAttribute('src', appUrl);
      document.getElementsByTagName('body')[0].appendChild(f);
    }
  }

  function getDownloadLink() {
    return proms;
  }

  return { openApp, getDownloadLink };
}

export default downloadFactory;
