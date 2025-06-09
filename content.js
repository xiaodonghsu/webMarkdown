// WebMarkdown 内容脚本
// 在网页中运行，提供额外功能如快捷键支持

(function() {
    'use strict';

    // 防止重复注入
    if (window.webMarkdownInjected) {
        return;
    }
    window.webMarkdownInjected = true;

    // 快捷键配置
    const SHORTCUTS = {
        convert: 'Ctrl+Shift+M', // 转换快捷键
        copy: 'Ctrl+Shift+C'     // 复制快捷键
    };

    // 添加快捷键支持
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(event) {
            // 检查是否按下了转换快捷键 (Ctrl+Shift+M)
            if (event.ctrlKey && event.shiftKey && event.key === 'M') {
                event.preventDefault();
                triggerConversion();
            }
        });
    }

    // 触发转换
    function triggerConversion() {
        // 向扩展发送消息请求转换
        chrome.runtime.sendMessage({
            action: 'convertPage',
            source: 'shortcut'
        }).catch(error => {
            console.log('WebMarkdown: 扩展未响应快捷键');
        });
    }

    // 创建智能内容选择器
    function createContentSelector() {
        // 如果已存在选择器，则不重复创建
        if (document.getElementById('webmarkdown-selector')) {
            return;
        }

        const selector = document.createElement('div');
        selector.id = 'webmarkdown-selector';
        selector.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(100%);
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        `;

        selector.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4V16L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 8L4 12L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>转换为Markdown</span>
            </div>
            <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">
                ${SHORTCUTS.convert}
            </div>
        `;

        // 点击事件
        selector.addEventListener('click', triggerConversion);

        // 鼠标悬停效果
        selector.addEventListener('mouseenter', () => {
            selector.style.transform = 'translateX(0) scale(1.05)';
        });

        selector.addEventListener('mouseleave', () => {
            selector.style.transform = 'translateX(0) scale(1)';
        });

        document.body.appendChild(selector);

        // 显示动画
        setTimeout(() => {
            selector.style.opacity = '1';
            selector.style.transform = 'translateX(0)';
        }, 100);

        // 3秒后自动隐藏
        setTimeout(() => {
            selector.style.opacity = '0';
            selector.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (selector.parentNode) {
                    selector.remove();
                }
            }, 300);
        }, 3000);
    }

    // 检测页面内容类型
    function detectPageType() {
        const indicators = {
            article: document.querySelector('article, .article, .post, .entry'),
            blog: document.querySelector('.blog, .post-content, .entry-content'),
            news: document.querySelector('.news, .article-content'),
            documentation: document.querySelector('.documentation, .docs, .manual'),
            wiki: document.querySelector('.wiki, .wikipedia')
        };

        for (const [type, element] of Object.entries(indicators)) {
            if (element) {
                return type;
            }
        }

        return 'general';
    }

    // 智能内容提取
    function getSmartContent() {
        const pageType = detectPageType();
        let contentElement = null;

        // 根据页面类型选择最佳内容提取策略
        switch (pageType) {
            case 'article':
            case 'blog':
                contentElement = document.querySelector('article, .article, .post, .entry-content, .post-content');
                break;
            case 'news':
                contentElement = document.querySelector('.article-content, .news-content, .story-content');
                break;
            case 'documentation':
                contentElement = document.querySelector('.documentation, .docs, .content, main');
                break;
            case 'wiki':
                contentElement = document.querySelector('#content, .wiki-content, .mw-content-text');
                break;
            default:
                contentElement = document.querySelector('main, .main, .content, .container');
        }

        // 如果没找到特定容器，回退到body
        if (!contentElement) {
            contentElement = document.body;
        }

        return contentElement;
    }

    // 监听来自popup的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getPageContent') {
            try {
                const contentElement = getSmartContent();
                const content = extractCleanContent(contentElement, request.options);
                sendResponse({
                    success: true,
                    content: content,
                    pageType: detectPageType(),
                    title: document.title,
                    url: window.location.href
                });
            } catch (error) {
                sendResponse({
                    success: false,
                    error: error.message
                });
            }
        }
        return true; // 保持消息通道开放
    });

    // 提取并清理内容
    function extractCleanContent(element, options = {}) {
        const cloned = element.cloneNode(true);

        // 移除不需要的元素
        const unwantedSelectors = [
            'script', 'style', 'nav', 'header', 'footer',
            '.nav', '.navigation', '.sidebar', '.advertisement',
            '.ads', '.social-share', '.comments', '.comment',
            '.breadcrumb', '.pagination', '.tags', '.metadata'
        ];

        unwantedSelectors.forEach(selector => {
            cloned.querySelectorAll(selector).forEach(el => el.remove());
        });

        // 处理图片
        if (!options.includeImages) {
            cloned.querySelectorAll('img').forEach(img => img.remove());
        } else {
            cloned.querySelectorAll('img').forEach(img => {
                // 转换相对路径为绝对路径
                if (img.src && !img.src.startsWith('http')) {
                    try {
                        img.src = new URL(img.src, window.location.href).href;
                    } catch (e) {
                        // 忽略无效URL
                    }
                }
                // 添加alt属性作为title
                if (img.alt) {
                    img.title = img.alt;
                }
            });
        }

        // 处理链接
        if (!options.includeLinks) {
            cloned.querySelectorAll('a').forEach(link => {
                const textNode = document.createTextNode(link.textContent);
                link.parentNode.replaceChild(textNode, link);
            });
        } else {
            cloned.querySelectorAll('a').forEach(link => {
                if (link.href && !link.href.startsWith('http')) {
                    try {
                        link.href = new URL(link.href, window.location.href).href;
                    } catch (e) {
                        // 忽略无效URL
                    }
                }
            });
        }

        return cloned.innerHTML;
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 添加快捷键支持
        addKeyboardShortcuts();

        // 检查是否是内容页面，如果是则显示快速转换按钮
        setTimeout(() => {
            const pageType = detectPageType();
            if (pageType !== 'general') {
                createContentSelector();
            }
        }, 1000);
    }

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        #webmarkdown-selector {
            font-weight: 500;
            letter-spacing: 0.5px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        #webmarkdown-selector:hover {
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        #webmarkdown-selector:active {
            transform: translateX(0) scale(0.95) !important;
        }
    `;
    document.head.appendChild(style);

})(); 