# DAPP开发指南

## 一、DAPP介绍

> DAPP的全称是Decentralized Application，即“去中心化的应用程序”，是在区块链语境下对应用程序的称呼。

> DAPP运行在区块链之上，需要全网的用户共同使用和维护，所以不存在某个中心化的节点可以控制DAPP。

> DAPP的本质，是一段运行在区块链上的程序，即“智能合约”。智能合约是一段存储在区块链上的字节码程序，当需要运行它的时候，区块链就会启动虚拟机程序，加载这段代码，并运行它，最终将运行的结果返回给应用的前端，其架构如下：

![dapp架构](https://raw.githubusercontent.com/vntchain/statics/master/dapp/arch.png)

* 基础层
> 即Hubble基础设施层，包含了存储，p2p网络，共识，账户管理等模块，并对外提供RPC服务接口。
在基础层，存储着DAPP的核心：智能合约的代码。

* 逻辑层
> 即智能合约的执行引擎：虚拟机。虚拟机会从基础层获取智能合约的代码，根据上层发送的交易需求，执行合约代码。代码执行期间如果发生数据的读写，虚拟机就会直接与基础层交互进行数据的读写。

* 可视层
> 即DAPP的前端，为终端用户提供交易界面，可以如下形式：
  - Web界面
  - PC客户端
  - 手机app客户端
  - 命令行

可视层与底层交互的方式，可以是rpc接口，或者是我们提供的js sdk，即vnt.js。

## 二、智能合约介绍

一个DAPP的核心，就是一段运行在区块链上的代码：智能合约。

智能合约会对外公开一些函数的接口，用户通过调用这些接口，来执行智能合约的功能。这些功能大致分为两部分：
* 会引起数据修改
> 对于这部分功能，虚拟机需要将执行完的结果写回到区块链存储之中。所以，这类功能会引起合约存储状态的改变。用户需要发起交易来调用这些功能，才能够真正的改变存储状态。

* 不会引起数据修改
> 这类功能不会引起数据的修改，可能只是纯粹的读取存储状态，比如查询余额；也可能是一种与存储无关的纯计算操作，比如计算一个字符串的哈希。对于这类功能，用户不需要发起交易。

目前，Hubble支持的智能合约语言是C语言。

Hubble的虚拟机，是一种基于Web Assembly的智能合约解释器。所以，使用C语言开发的智能合约，需要先使用我们的编译工具编译成Web Assembly字节码，才能部署并被虚拟机执行。


## 二、DAPP开发

根据第一部分的描述，我们可以将一个DAPP的开发过程，分为如下几步：

### 1. 开发智能合约

使用C语言开发智能合约。合约的语法规则，完全遵守C语言的语法规范。除此之外，我们还实现了一个指令集，用以实现对区块链的读写操作。

> 详情请访问 [如何开发合约](/developer/dapp/develop)

### 2. 编译智能合约

使用我们的编译工具，将智能合约编译成Web Assembly字节码与ABI文件。

其中ABI文件，是智能合约的接口文件，描述了智能合约中的开放接口的函数名称、参数、返回值等属性。ABI文件在部署合约、访问合约的时候都需要用到。

编译工具使用详情见 [如何编译合约](/developer/dapp/compile)

### 3. 部署和调用合约

合约开发和编译完成后，就需要将其部署到Hubble网络之上了。

目前我们建议使用Hubble的Javascript sdk，即vnt.js，来部署和调用合约。当然，你也可以使用RPC接口。

详情见 [如何部署调用合约](/developer/dapp/invoke)

如果你想使用rpc接口，请参考文档：[VNT Chain JSON RPC API](https://github.com/vntchain/vnt-documentation/blob/master/api/vnt-json-rpc-api.md)

### 4. Dapp前端开发

根据应用的需求，选择使用任何你喜欢的技术，开发你的前端。

前端应用可以使用vnt.js，也可以使用rpc接口来操作Hubble链。

[vnt.js API 文档](https://github.com/vntchain/vnt.js/blob/master/doc/api-reference.md)

[RPC 接口文档](https://github.com/vntchain/vnt-documentation/blob/master/api/vnt-json-rpc-api.md)
