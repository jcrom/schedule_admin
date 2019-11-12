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


function showOpenBrowser() {
  const { $ } = window;
  const $ele = $(`
    <div style="position:fixed; top:0;bottom:0;left:0;right:0;z-index:19999999;background:#000;opacity:.7;">
      <img src="/static/images/download/fenxiang_img.png" style="position: absolute;top:0;right:0;width:3.32rem;">
    </div>
  `);
  $ele.appendTo('body').click((event) => {
    event.preventDefault();
    event.stopPropagation();
    $ele.remove();
  });
}

function downloadFactory(route = {}) {
  const APP_DOWNLOAD_URLS = {
    WX: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.pplive.androidphone.sport',
    IOS: 'itms-apps://itunes.apple.com/cn/app/id627781309?mt=8',
    ANDROID: {
      STATIC: 'http://download.pplive.com/aphone/pptv_sport_phone_s010.apk',
      REMOTE(channelId) {
        return `http://vfast.suning.com/mts-web/channelpack/queryChannelPack_2000_149_${channelId}_callbackChannel.html`;
      },
    },
    HUAWEI: 'http://download.pplive.com/aphone/waterdrop_SIT_0316_1930_1.0.apk',
  };

  const appRootUrl = `pptvsports${utils.isHuaWeiPlatform() ? 'hw' : ''}://`;

  const PAGE_TYPES = {
    DERBY: 'livederby',
    LIVE: 'live',
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
  const params = Object.assign({}, utils.getLocationSearchObj(), route.params);
  // console.info(`\n\n\n\n\n\n\nparams：\n${JSON.stringify(params)}\n\n\n\n\n\n\n`);
  const pageType = (params.pageType || route.name || '').toLowerCase();
  const { rcc_channel_id: rccChannelId, utm_source: utmSource, ddl } = params;
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
      //     appUrl = postId ? `videopost/detail/show/?clubId=${postCid}&id=${postId}&videoId=${postVideoId}` : AppUriHome;
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
        `news/video/?content_id==${contentId}` : AppUriHome;
        break;
      }
      default:
        appUrl = AppUriHome;
        break;
    }

    // 配置from参数,作为app应用拉起来源的埋点参数
    appUrl = `${appUrl}&from=${utils.isWechat() ? 'MWechat' : 'MOther'}`;
    appUrl = `${appRootUrl}page/${appUrl}`;
  }

  let platform;
  if (utils.isWechat()) {
    platform = 'wechat';
  } else if (utils.isIos()) {
    platform = 'ios';
  } else if (utils.isHuaWeiPlatform()) {
    platform = 'huawei';
  } else {
    platform = 'android';
  }

  proms = proms || new Promise((resovle) => {
    switch (platform) {
      case 'wechat': {
        resovle(APP_DOWNLOAD_URLS.WX);
        break;
      }
      case 'ios': {
        resovle(APP_DOWNLOAD_URLS.IOS);
        break;
      }
      case 'huawei': {
        resovle(APP_DOWNLOAD_URLS.HUAWEI);
        break;
      }
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
                resovle(res.data);
              } else {
                resovle(APP_DOWNLOAD_URLS.ANDROID.STATIC);
              }
            },
          });
        } else {
          resovle(APP_DOWNLOAD_URLS.ANDROID.STATIC);
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
    if (ddl === '1') {
      download();
    } else if (utils.isWechat()) {
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
      if (utils.isHuaWeiPlatform()) {
        showOpenBrowser();
      } else {
        download();
      }
    } else if (utils.isIos()) {
      const ua = navigator.userAgent;
      const chromeV = /Chrome\//.test(ua) && !/Version\/4/.test(ua);
      if (/Chrome/i.test(ua) && chromeV) {
        const chromeVer = /Chrome\/(\d{2})/i.exec(ua);
        if (chromeVer && parseInt(chromeVer[1], 10) < 35) {
          win.location.href = appUrl;
        } else {
          const openTab = win.open(appUrl);
          setTimeout(() => openTab.close(), 1000);
        }
        download();
      } else {
        window.location.href = appUrl;
        window.setTimeout(() => {
          if (document.visibilityState !== 'hidden') {
            download();
          }
        }, 1500);
      }
    } else {
      const f = document.createElement('iframe');
      f.setAttribute('id', 'openappiframe');
      f.setAttribute('style', 'display:none');
      f.setAttribute('src', appUrl);
      document.getElementsByTagName('body')[0].appendChild(f);
      window.setTimeout(() => {
        const child = document.querySelector('#openappiframe');
        document.getElementsByTagName('body')[0].removeChild(child);
        if (document.visibilityState !== 'hidden') {
          download();
        }
      }, 1500);
    }
  }

  function getDownloadLink() {
    return proms;
  }

  return { openApp, getDownloadLink };
}

export default downloadFactory;
