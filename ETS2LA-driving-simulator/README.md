# ETS2LA 驾驶可视化模拟预览

本预览直接复用了你提供的 ETS2LA 仓库中：
- `ETS2LA.UI/wwwroot/Visualization/` 的原始 3D 可视化构建产物；
- `ETS2LA.UI/Pages/Visualization.razor` 的 UI 逻辑作为对照参考。

## 运行
推荐使用 Python 本地静态服务器（不要直接双击 HTML，以免浏览器对 iframe/资源路径做限制）：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。如果终端当前目录不是本文件夹，请先 `cd` 到本文件夹。

## 模拟数据
底部可切换「车道辅助 + ACC / 全自动驾驶 / 手动驾驶 / 前车减速」模式，调整目标车速和模拟速度，也可以暂停、重置。车速、踏板、转向角、车道偏移、方向灯、巡航目标均为本地生成的演示数据。

## 边界
- 中央 3D 场景来自原仓库的 Visualization 构建产物。
- HUD 模拟数据是独立演示，不会连接 ETS2/ATS，也不会向游戏发送方向盘、油门或刹车输入。
- 原项目 `Visualization.razor` 依赖 `GameTelemetry`、`ApplicationState` 和 `Visualization Sockets` 插件；本预览用模拟数据替代这些运行时依赖。
