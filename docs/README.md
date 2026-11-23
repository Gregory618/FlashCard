# English FlashCard — Web/PWA

这是 English-FlashCard 微信小程序之外的独立 Web/PWA 版本。

## 功能
- 目标词/短语大字号显示，例句明显小一级
- 点击翻卡
- 记住了 / 忘记了
- 间隔复习：1 / 2 / 4 / 7 / 15 / 30 / 60 天
- 忘记后第二天再出现
- 今日到期数量、已掌握数量、总卡片数
- 可搜索词库
- JSON 导出/导入复习进度
- Service Worker 离线缓存

## GitHub Pages
把 GitHub Pages 发布目录设为 docs/，即可运行这个版本。

## 数据策略
docs/data/cards.json 保存卡片内容。复习进度默认保存在浏览器 localStorage，不会把个人复习记录公开到 GitHub。通过“导出进度”生成 JSON 备份，可在另一台设备导入。

## 当前同步
V1 使用当前已验证的 41 张卡片作为独立 App 的首批数据。当前 ChatGPT 闪卡组件没有向开发接口暴露完整的 51 张卡片内容，因此没有凭空补写其余卡片；后续可以继续从闪卡中补齐。