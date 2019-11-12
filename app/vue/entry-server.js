import { createApp } from './app';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default ctx => new Promise((resolve, reject) => {
  const env = process.env;
  const isDev = process.env.EGG_SERVER_ENV === 'local';
  const { EGG_SERVER_ENV } = env;
  function envProcess() {
    const result = {};
    let dfpHost;
    let mmdsHost;
    switch (EGG_SERVER_ENV) {
      case 'prd':
        dfpHost = 'dfp.suning.com';
        mmdsHost = 'mmds.suning.com';
        break;
      case 'pre':
        dfpHost = 'dfppre.cnsuning.com';
        mmdsHost = 'mmdssit.cnsuning.com';
        break;
      case 'sit':
      case 'local':
      default:
        dfpHost = 'dfpsit.cnsuning.com';
        mmdsHost = 'mmdssit.cnsuning.com';
    }
    result.dfpScript = `//${dfpHost}/dfprs-collect/dist/fp.js?appCode=187G6Cr2aRnlv6Un`;
    result.mmdsHost = `//${mmdsHost}/mmds/mmds.js?appCode=187G6Cr2aRnlv6Un`;
    return result;
  }
  const ENV_PROCESS = envProcess();
  const context = ctx;
  const s = isDev && Date.now();
  const { app, router, store } = createApp();

  // 接收从controller page.js里面传过来的数据，用于直接存入store，从而避免走客户端请求存store
  const SSRSetStoreData = context.SSRSetStoreData;
  context.EGG_SERVER_ENV = EGG_SERVER_ENV;
  context.title = context.title || '《PP体育》赛事直播';
  context.keyword = context.keyword || '英超,西甲,亚冠,欧冠,德甲,欧联杯,CBA,篮球,WWE,UFC,体育,中超,PP体育,足球,赛事,';
  context.pgtitle = context.pgtitle || '';
  context.shortcutIcon = context.shortcutIcon || '/static/images/logo.png';
  const { dfpScript, mmdsHost } = ENV_PROCESS;
  context.dfpScript = context.DeviceFingerprint ? dfpScript : '';
  context.mmdsHost = context.DeviceFingerprint ? mmdsHost : '';
  const { url } = context;

  // set router's location
  router.push(url);
  // wait until router has resolved possible async hooks
  router.onReady(() => {
    let matchedComponents;
    if (!SSRSetStoreData.errorMessage) {
      matchedComponents = router.getMatchedComponents();
      // no matched routes
      if (!matchedComponents.length) {
        reject({ code: 404 });
      }
    } else {
      matchedComponents = [];
    }

    // 向store里存入数据,SSRSetStoreData信息
    // store.registerModule('SSRSetStoreData', './store/SSRSetStoreData.js');
    store.commit('SSRSetStoreData/SSRSetStoreData', { SSRSetStoreData });
    // Call fetchData hooks on components matched by the route.
    // A preFetch hook dispatches a store action and returns a Promise,
    // which is resolved when the action is complete and store state has been
    // updated.
    Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
      store,
      route: router.currentRoute,
    }))).then(() => {
      if (isDev) {
        console.log(`data pre-fetch: ${Date.now() - s}ms`);
      }
      // After all preFetch hooks are resolved, our store is now
      // filled with the state needed to render the app.
      // Expose the state on the render context, and let the request handler
      // inline the state in the HTML response. This allows the client-side
      // store to pick-up the server-side state without having to duplicate
      // the initial data fetching on the client.
      context.state = store.state;
      resolve(app);
    }).catch(reject);
  }, reject);
});
