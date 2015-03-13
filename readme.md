* Author: bianyali
* THEME: karma-vis
* Version: 0.99

# 因果可视化

    该 repo 是因果可视化系统，后端使用 racket-lang 搭建，前端使用 d3.js, bootstrap, bootbox, bootstrap-toggle 库。inspired by BEERVIZ (http://seekshreyas.com/beerviz/)

# 安装方案

    下载racket (www.racket-lang.org), open file "run.rkt", run...

# 可作为模板使用的部分：

    racket-web server： 使用 racket 搭建 web server 方案，以及 json 数据的处理。
                        dispatch，static path 配置。
                        MVC 简单框架。

    d3.js 交互平台框架的实现： 事件相应，事件处理，数据关系处理
