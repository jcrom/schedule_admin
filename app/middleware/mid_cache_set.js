'use strict';
module.exports = () => {
  return function* (next) {
    yield next;
    if (!this.response.header['cache-control']) {
      this.set('Cache-Control', 'max-age=180');
    }
    
    // if (this.request.method.toUpperCase() === 'GET' && !this.response.header['Last-Modified']) {
    //   this.set('Last-Modified', new Date().toUTCString());
    // }

    if (!this.response.header['expires']) {
      //设置当前时间+3分钟：把当前分钟数+3后的值重新设置为date对象的分钟数  与max-age保持一致
      var expiresDate=new Date();
      var expiresmin=expiresDate.getMinutes();
      expiresDate.setMinutes(expiresmin+3);
      this.set('expires', expiresDate.toUTCString());
    }

    if (!this.response.header['Last-Modified']) {
      this.set('Last-Modified', new Date().toUTCString());
    }
  };
};
