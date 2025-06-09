# WebMarkdown - Chrome扩展

![WebMarkdown Logo](https://img.shields.io/badge/WebMarkdown-v1.0-blue?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange?style=for-the-badge)

一个强大的Chrome扩展，可以将任何网页内容智能转换为Markdown格式，并提供预览和一键复制功能。

## ✨ 核心特性

### 🚀 智能内容提取
- **智能页面识别**: 自动识别文章、博客、新闻、文档等不同类型网页
- **精准内容定位**: 智能定位主要内容区域，过滤广告、导航、侧边栏等干扰元素
- **多种布局支持**: 兼容各种网站布局和结构设计

### 🖼️ 高级图片处理
- **普通图片提取**: 完整提取img标签图片，包含alt和title属性
- **背景图片识别**: 智能提取CSS背景图片
- **延迟加载支持**: 处理data-src等懒加载图片
- **路径自动转换**: 相对路径自动转换为绝对URL
- **独立图片清单**: 在Markdown末尾生成完整的图片列表

### 📝 精准Markdown转换
- **高质量转换**: 使用Turndown.js核心引擎，确保转换质量
- **完整格式支持**: 支持标题、段落、列表、表格、代码块、引用等
- **结构保持**: 保持原文档的层次结构和格式
- **字符处理**: 智能处理特殊字符和HTML实体

### 💫 现代化用户体验
- **美观界面**: 现代化渐变设计，流畅的动画效果
- **实时预览**: 即时查看转换结果，所见即所得
- **一键操作**: 支持一键复制到剪贴板和下载为.md文件
- **智能提取**: 自动识别页面主要内容区域，提升转换质量
- **详细统计**: 显示字符数、行数、预计阅读时间等统计信息



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
2. **点击浏览器工具栏中的WebMarkdown图标**
3. **配置转换选项**：
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

### 推荐测试网站
- **新闻网站**: BBC、CNN、新浪新闻等
- **技术博客**: Medium、Dev.to、掘金等  
- **文档网站**: MDN、GitHub、知乎等
- **图片网站**: Unsplash、Pinterest等

### 测试要点
- 内容提取的准确性
- 图片处理的完整性
- Markdown格式的正确性
- 转换选项的有效性

## 📊 性能指标

| 页面类型 | 图片数量 | 预期转换时间 |
|----------|----------|--------------|
| 小页面 | <10张 | <2秒 |
| 中页面 | 10-50张 | <5秒 |
| 大页面 | 50+张 | <10秒 |

## 📁 文件结构

```
webMarkdown/
├── manifest.json                    # Chrome扩展清单文件
├── popup.html                       # 扩展弹窗界面
├── popup.css                        # 弹窗样式文件
├── popup.js                         # 扩展主要逻辑和内容提取功能
├── turndown.min.js                  # HTML转Markdown核心库
├── README.md                        # 项目说明文档
├── LICENSE                          # 开源许可证
└── icons/                           # 扩展图标文件夹
    ├── icon16.png                   # 16x16图标
    ├── icon32.png                   # 32x32图标
    ├── icon48.png                   # 48x48图标
    └── icon128.png                  # 128x128图标
```

## 🔧 技术实现

### 核心技术栈
- **前端**: HTML5, CSS3, JavaScript ES6+
- **扩展API**: Chrome Extensions Manifest V3
- **转换引擎**: Turndown.js (HTML to Markdown)
- **功能API**: Chrome Scripting API, Web APIs

### 架构设计
- **popup.js**: 扩展主界面逻辑，包含用户交互、智能内容提取和转换控制
- **turndown.min.js**: 第三方库，负责HTML到Markdown的核心转换
- **chrome.scripting API**: 用于在页面上下文中执行内容提取脚本

### 智能提取算法
- **多层级选择器**: 通过优先级选择器（article、main、.content等）定位最佳内容区域
- **智能清理**: 自动移除广告、导航、评论等干扰元素
- **图片处理**: 支持懒加载图片、相对路径转换、占位符生成
- **链接处理**: 相对链接自动转换为绝对链接

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
- [ ] 转换历史记录

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