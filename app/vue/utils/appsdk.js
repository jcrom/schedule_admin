'use strick';

import { utils } from '../vendors/utils';

const delay = {};
let promise;

export default () => {
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      delay.resolve = resolve;
      delay.reject = reject;
    });
    if (!utils.isPPTVSports()) {
      delay.reject();
    } else {
      let domains;
      let appkeys;
      // if (/mspssit.suning.com/g.test(location.hostname)) {
      //   domains = 'mspssit.suning.com';
      //   appkeys = '09e07c5be81d4ca3827392a5ea581106';
      // } else if (/mspssit.ppsport.com/g.test(location.hostname)) {
      //   domains = 'mspssit.ppsport.com';
      //   appkeys = 'ca616cddf1a14b6eb8e30aff7c4eda7b';
      // } else if (/pplive.suning.com/g.test(location.hostname)) {
      //   domains = 'pplive.suning.com';
      //   appkeys = 'bad09d17eee94772907ea9e3308320ac';
      // } else if (/m.ppsport.com/g.test(location.hostname)) {
      //   domains = 'm.ppsport.com';
      //   appkeys = 'a60a82f02e1e4953998cf262b005c68d';
      // }
      const ppsport = window.ppsport;
      ppsport.config({
        debug: !1,
        jsApiList: [
          'getUserInfo',
          'copyToClipBoard',
          'closeWebview',
          'goBack',
          'showTopRightMenu',
          'showBottomRightMenu',
          'shareMenuAction',
          'postTipoff',
          'hideTopBar',
          'showShare',
          'goBack',
          'userLogin',
          'showShareButton',
          'setElementVisible',
          'copyToClipBoard',
        ],
        domain: domains,
        appKey: appkeys,
        success: () => {
          delay.resolve(ppsport);
        },
      });
      ppsport.ready(() => {
        delay.resolve(ppsport);
      });
    }
    return promise;
  }
  return promise;
};
