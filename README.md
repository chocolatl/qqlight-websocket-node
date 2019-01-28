QQLight机器人[WebSocket插件](https://github.com/Chocolatl/qqlight-websocket)Node.js绑定

## 安装

```
npm install --save https://github.com/Chocolatl/qqlight-websocket-node.git
```

## 示例

下面的示例演示了如何初始化、调用接口、监听事件以及错误处理：

```js
const QQBot = require('qqlight-websocket-node');

async function start() {
  const bot = new QQBot();

  try {
    // 连接QQLight-WebSocket插件服务器
    await bot.connect('ws://localhost:49632/');
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }

  // 导出QQ机器人接口
  const {
    getLoginAccount,
    getNickname,
    sendMessage
  } = bot.api;

  // 监听收到消息事件
  bot.on('message', async (event, data) => {
    console.log(data);
    await sendMessage(data);
  });

  // 使用QQ机器人接口
  const account = await getLoginAccount();
  const nickname = await getNickname({ qq: account });
  console.log(nickname);

  try {
    // 缺少必要参数，该方法调用会抛出异常
    await getNickname({});
  } catch (err) {
    // Error: Invalid Parameters
    console.error(err);
  }
}

start();
```

完整的事件与接口列表可以在[QQLight-WebSocket插件文档](https://github.com/Chocolatl/qqlight-websocket#api%E5%88%97%E8%A1%A8)中查看

## 许可证

```
GLWT（祝你好运）公共许可证
版权所有（C）每个人，除了作者

任何人都被允许复制、分发、修改、合并、销售、出版、再授权或
任何其它操作，但风险自负。

作者对这个项目中的代码一无所知。
代码处于可用或不可用状态，没有第三种情况。


                祝你好运公共许可证
            复制、分发和修改的条款和条件

0：在不导致作者被指责或承担责任的情况下，你可以做任何你想
要做的事情。

无论是在合同行为、侵权行为或其它因使用本软件产生的情形，作
者不对任何索赔、损害承担责任。

祝你好运及一帆风顺
```