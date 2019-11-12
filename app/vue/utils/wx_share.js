
import { utils } from '../vendors/utils';

const sKey = '__ssav';

/** 获取cookie */
function getItem() {
  return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')) || null;
}

/** 获取VisitorId */
function getVisitorId() {
  const ssavStr = getItem();
  if (ssavStr) {
    return ssavStr.split('|')[0];
  }
  return '';
}

/** 微信转发url处理 */
function handleUrl(initUrl) {
  let res = '';
  let params = {};
  if (initUrl.indexOf('?') !== -1) {
    params = utils.getLocationSearchObj(`?${initUrl.split('?')[1]}`);
  }
  params.uid = getVisitorId();
  params.wxshare_count = params.wxshare_count ? parseInt(params.wxshare_count, 0) + 1 : 1;
  Object.keys(params).forEach((k) => {
    res += `&${k}=${params[k]}`;
  });
  res = `${initUrl.split('?')[0]}?${res.substr(1)}`;
  return res;
}

export { getVisitorId, handleUrl };
