# WebMarkdown - Chrome扩展

![WebMarkdown Logo](https://img.shields.io/badge/WebMarkdown-v1.0-blue?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange?style=for-the-badge)

一个强大的Chrome扩展，可以将任何网页内容智能转换为Markdown格式，并提供预览和一键复制功能。

## ✨ 核心特性

### 🚀 智能内容提取
- 自动识别并提取网页主要内容
- 过滤广告、导航、侧边栏等干扰元素
- 支持多种网站布局和结构

### 🖼️ 高级图片处理
- **普通图片提取**: 完整提取img标签图片，包含alt和title属性
- **背景图片识别**: 智能提取CSS背景图片
- **延迟加载支持**: 处理data-src等懒加载图片
- **路径自动转换**: 相对路径自动转换为绝对URL
- **独立图片清单**: 在Markdown末尾生成完整的图片列表

### 📝 精准Markdown转换
- 使用Turndown.js核心引擎
- 支持标题、段落、列表、表格、代码块
- 保持原文档结构和格式
- 智能处理特殊字符和HTML实体

### 💫 现代化用户体验
- 美观的渐变设计和动画效果
- 实时预览转换结果
- 一键复制到剪贴板
- 支持下载为.md文件
- 详细的转换统计信息

## 🛠️ 安装方法

### 开发版安装
1. 下载或克隆本项目
```bash
git clone https://github.com/your-username/webMarkdown.git
```

2. 打开Chrome浏览器，进入扩展管理页面
```
chrome://extensions/
```

3. 开启右上角的"开发者模式"

4. 点击"加载已解压的扩展程序"，选择项目文件夹

5. 扩展安装完成，可在工具栏看到WebMarkdown图标

## 📋 使用方法

### 基础使用
1. **打开想要转换的网页**
2. **点击扩展图标**
3. **选择转换选项**：
   - ✅ 包含图片
   - ✅ 包含链接  
   - ✅ 包含背景图片
4. **点击"开始转换"**
5. **查看预览结果**
6. **复制或下载Markdown文件**

### 转换选项说明

| 选项 | 说明 | 推荐设置 |
|------|------|----------|
| 包含图片 | 是否在Markdown中包含img标签图片 | ✅ 开启 |
| 包含链接 | 是否保留页面中的超链接 | ✅ 开启 |
| 包含背景图片 | 是否提取CSS背景图片 | 根据需要 |

## 🧪 功能测试

项目包含完整的测试环境，可以验证所有功能：

### 1. 基础功能测试
打开项目中的 `test-image-extraction.html` 文件：
```
file:///path/to/webMarkdown/test-image-extraction.html
```

### 2. 真实网站测试
推荐测试以下类型网站：
- **新闻网站**: BBC、CNN等
- **技术博客**: Medium、Dev.to等  
- **文档网站**: MDN、GitHub等
- **图片网站**: Unsplash、Pinterest等

### 3. 图片提取验证
测试页面包含：
- 普通img标签图片
- CSS背景图片
- 延迟加载图片
- 隐藏图片过滤
- 相对路径转换

详细测试指南请查看：[图片提取功能测试指南.md](./图片提取功能测试指南.md)

## 📊 性能指标

| 页面类型 | 图片数量 | 预期转换时间 |
|----------|----------|--------------|
| 小页面 | <10张 | <2秒 |
| 中页面 | 10-50张 | <5秒 |
| 大页面 | 50+张 | <10秒 |

## 📁 文件结构

```
webMarkdown/
├── manifest.json                    # Chrome扩展清单
├── popup.html                       # 用户界面
├── popup.css                        # 界面样式
├── popup.js                         # 主要逻辑
├── turndown.min.js                  # HTML转Markdown核心库
├── test-image-extraction.html       # 功能测试页面
├── 图片提取功能测试指南.md            # 测试文档
├── 开发进度.md                       # 开发记录
├── README.md                        # 本文件
└── icons/                           # 扩展图标
    ├── icon16.png
    ├── icon32.png  
    ├── icon48.png
    └── icon128.png
```

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript ES6+
- **扩展API**: Chrome Extensions Manifest V3
- **核心库**: Turndown.js (HTML to Markdown)
- **功能API**: Chrome Scripting API, Web APIs

## 📈 开发进度

- ✅ **基础功能** (100%) - HTML到Markdown转换
- ✅ **用户界面** (100%) - 现代化设计和交互
- ✅ **图片处理** (100%) - 高级图片提取功能
- ✅ **测试验证** (100%) - 完整的测试环境
- 🔄 **优化改进** (95%) - 性能和兼容性优化

详细进度请查看：[开发进度.md](./开发进度.md)

## 🐛 已知限制

1. **跨域图片**: 某些图片可能因CORS策略无法访问
2. **动态内容**: JavaScript动态生成的内容可能遗漏
3. **复杂表格**: 样式复杂的表格可能格式化不完美
4. **SVG处理**: 内联SVG需要特殊处理

## 🚀 后续计划

- [ ] 图片本地化存储选项
- [ ] 批量网页转换功能
- [ ] 自定义转换模板
- [ ] 与笔记应用集成
- [ ] 多语言界面支持

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Turndown.js](https://github.com/mixmark-io/turndown) - 优秀的HTML到Markdown转换库
- Chrome Extensions API文档和社区支持
- 所有测试和反馈的用户

---

如果这个项目对您有帮助，请给个⭐️支持一下！ 