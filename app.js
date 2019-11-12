'use strict';
module.exports = app => {

  app.messenger.on('pagecachetime', data => {
    app.config.pagecachetime = data || '10';
  });
  // api controller，用于api接口的基础类
  class ApiController extends app.Controller {
    success(data) {
      this.ctx.body = {
        result: true,
        data,
        timestamp: Date.parse(new Date()),
      };
      this.ctx.status = 200;
    }
  }

  app.ApiController = ApiController;
  class ConvertJSON {

    ObjectToJSONStr(param) {
      if (param) {
        let jsonStr = JSON.stringify(param);
        jsonStr = jsonStr.length > 0 ? jsonStr.replace(/\'/g, '”') : jsonStr;
        jsonStr = jsonStr.length > 0 ? jsonStr.replace(/[\r\n]/g, '') : jsonStr;
        // console.log(JSON.parse(newData));
        return jsonStr;
      }
      return param;
    }
  }

  app.ConvertJSON = ConvertJSON;
};
