const WebSocket = require('ws');
const EventEmitter = require('events');

module.exports = class QQBot {

  constructor() {
    this._ev = null;
    this._ws = null;
    this.api = this._createAPIProxy();
  }

  _createAPIProxy() {
    return new Proxy({}, {
      get: (_, method) => params => this._callAPI(method, params)
    });
  }
  
  _callAPI(method, params) {
    return new Promise((resolve, reject) => {

      const id = Math.random().toString().slice(2, 12);
      const json = JSON.stringify({ id, method, params });

      const onWrittenOut = err => {
        if (err) return reject(err);

        let done = false;
        const onMessage = data => {
          data = JSON.parse(data);
          if(data.id !== id) return;
          const { error, result } = data;
          this._ws.off('message', onMessage);
          error ? reject(new Error(error)) : resolve(result);
          done = true;
        };

        this._ws.on('message', onMessage);
        
        const onTimeout = () => {
          if(done) return;
          this._ws.off('message', onMessage);
          reject(new Error('Timeout'));
        };

        setTimeout(onTimeout, 6000);   // 超过6000毫秒没收到服务器响应
      };

      this._ws.send(json, onWrittenOut);
    });
  }

  async connect(url) {
    this._ws = new WebSocket(url);

    return new Promise((resolve, reject) => {
      const onErrorBeforeOpen = err => reject(err);
      const onError = err => { throw err; };
      const onOpen = () => {
        this._ws.off('error', onErrorBeforeOpen);
        this._ws.on('error', onError);   // 致命错误
        resolve();
      }
      this._ws.on('error', onErrorBeforeOpen);
      this._ws.on('open', onOpen);
    });
  }

  on(event, cb) {
    if(this._ev === null) {   // 首次调用该函数时完成初始化
      this._ev = new EventEmitter();
      this._ev.setMaxListeners(100);
      this._ws.on('message', data => {
        const { event, params } = JSON.parse(data);
        if (event) {
          this._ev.emit(event, event, params);
        }
      });
    }

    this._ev.on(event, cb);
  }

  off(event, cb) {
    this._ev.off(event, cb);
  }

  close() {
    this._ws.close();
  }
}