// WebMarkdown 扩展主逻辑
// 用于处理HTML到Markdown的转换

// 提取页面内容的函数（将在页面上下文中执行）
function extractPageContentFunction(options) {
    // 这个函数将在页面的上下文中执行
    
    console.log('=== 开始提取页面内容 ===');
    console.log('转换选项:', options);
    
    try {
        // 尝试智能提取主要内容
        let contentElement = null;
        
        // 优先查找常见的内容容器
        const selectors = [
            'article',
            'main',
            '[role="main"]',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '#content',
            '.container .row',
            'body'
        ];

        for (const selector of selectors) {
            contentElement = document.querySelector(selector);
            if (contentElement && contentElement.innerText.trim().length > 100) {
                console.log('选择的内容容器:', selector);
                break;
            }
        }

        if (!contentElement) {
            contentElement = document.body;
            console.log('使用默认容器: body');
        }

        // 克隆内容元素避免修改原始DOM
        const clonedElement = contentElement.cloneNode(true);
        
        // 移除不需要的元素
        console.log('清理不需要的元素...');
        const unwantedSelectors = [
            'script', 'style', 'nav', 'header', 'footer',
            '.nav', '.navigation', '.sidebar', '.advertisement',
            '.ads', '.social-share', '.comments', '.comment',
            '.breadcrumb', '.pagination', '.tags', '.metadata'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = clonedElement.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`移除 ${elements.length} 个 ${selector} 元素`);
                elements.forEach(el => el.remove());
            }
        });

        // 简化的图片处理逻辑
        console.log('=== 开始处理图片 ===');
        const images = clonedElement.querySelectorAll('img');
        console.log(`找到 ${images.length} 张图片`);
        
        if (!options.includeImages) {
            console.log('删除所有图片（用户选择不包含图片）');
            images.forEach(img => img.remove());
        } else {
            let processedCount = 0;
            let errorCount = 0;
            
            images.forEach((img, index) => {
                try {
                    console.log(`处理图片 ${index + 1}/${images.length}`);
                    
                    // 获取图片源 - 简化逻辑
                    let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
                    
                    console.log(`原始src: "${src}"`);
                    
                    // 如果没有有效的src，生成占位符
                    if (!src || src.trim() === '' || src === window.location.href) {
                        console.warn(`图片 ${index + 1} 没有有效src，设置占位符`);
                        src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJhzwvdGV4dD48L3N2Zz4=';
                    } else if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
                        // 转换相对URL为绝对URL
                        try {
                            const absoluteUrl = new URL(src, window.location.href).href;
                            console.log(`转换相对路径: ${src} -> ${absoluteUrl}`);
                            src = absoluteUrl;
                        } catch (e) {
                            console.warn(`无法转换相对URL: ${src}`, e);
                        }
                    } else if (src.startsWith('//')) {
                        // 处理协议相对URL
                        src = window.location.protocol + src;
                        console.log(`添加协议: ${src}`);
                    }
                    
                    // 设置图片src
                    img.src = src;
                    
                    // 处理alt属性
                    if (!img.alt || img.alt.trim() === '') {
                        img.alt = img.getAttribute('title') || 
                                  img.getAttribute('aria-label') || 
                                  `图片${index + 1}`;
                        console.log(`设置alt: "${img.alt}"`);
                    }
                    
                    // 处理title属性
                    if (!img.title && img.alt) {
                        img.title = img.alt;
                    }
                    
                    // 清理延迟加载属性
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-original');
                    img.removeAttribute('data-lazy');
                    img.removeAttribute('loading');
                    
                    processedCount++;
                    console.log(`图片 ${index + 1} 处理完成: ${img.src.substring(0, 80)}...`);
                    
                } catch (error) {
                    errorCount++;
                    console.error(`处理图片 ${index + 1} 时出错:`, error);
                    // 确保有基本的alt文本
                    if (!img.alt) {
                        img.alt = `图片${index + 1}`;
                    }
                }
            });
            
            console.log(`图片处理完成: 成功 ${processedCount}，失败 ${errorCount}`);
        }

        // 处理链接
        console.log('=== 处理链接 ===');
        const links = clonedElement.querySelectorAll('a');
        console.log(`找到 ${links.length} 个链接`);
        
        if (!options.includeLinks) {
            console.log('移除所有链接（保留文本）');
            links.forEach(link => {
                const textNode = document.createTextNode(link.textContent || link.innerText || '');
                link.parentNode.replaceChild(textNode, link);
            });
        } else {
            // 转换相对链接为绝对链接
            links.forEach(link => {
                if (link.href && !link.href.startsWith('http')) {
                    try {
                        link.href = new URL(link.href, window.location.href).href;
                    } catch (e) {
                        console.warn('无效的URL:', link.href);
                    }
                }
            });
        }

        // 获取最终的HTML内容
        let htmlContent = clonedElement.innerHTML;
        
        // 验证HTML内容
        if (!htmlContent || htmlContent.trim() === '') {
            console.warn('HTML内容为空，尝试获取文本内容');
            htmlContent = clonedElement.textContent || clonedElement.innerText || '';
            if (htmlContent.trim()) {
                htmlContent = `<div>${htmlContent}</div>`;
            }
        }

        console.log('=== 提取完成 ===');
        console.log('HTML长度:', htmlContent.length);
        console.log('页面标题:', document.title);
        console.log('页面URL:', window.location.href);

        const result = {
            html: htmlContent,
            title: document.title || '未知标题',
            url: window.location.href || '',
            success: true,
            stats: {
                imagesFound: images.length,
                linksFound: links.length,
                contentLength: htmlContent.length
            }
        };

        console.log('返回结果:', result.stats);
        return result;

    } catch (error) {
        console.error('提取页面内容时出错:', error);
        return {
            success: false,
            error: error.message,
            html: '',
            title: document.title || '未知标题',
            url: window.location.href || ''
        };
    }
}

// WebMarkdown转换器主类
class WebMarkdownConverter {
    constructor() {
        this.turndownService = null;
        this.currentMarkdown = '';
    }

    // 初始化
    init() {
        this.initTurndownService();
        this.bindEvents();
        this.updateUI('ready');
    }

    // 初始化Turndown服务
    initTurndownService() {
        console.log('初始化Turndown服务...');
        
        this.turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            fence: '```',
            emDelimiter: '*',
            strongDelimiter: '**',
            linkStyle: 'inlined'
        });

        // 添加自定义规则
        this.addCustomRules();
        
        console.log('Turndown服务初始化完成');
    }

    // 添加自定义转换规则
    addCustomRules() {
        // 图片转换规则 - 简化且更可靠
        this.turndownService.addRule('image', {
            filter: 'img',
            replacement: function (content, node) {
                const alt = node.getAttribute('alt') || node.getAttribute('title') || '图片';
                const src = node.getAttribute('src') || '';
                const title = node.getAttribute('title') || '';
                
                console.log('转换图片:', { alt, src: src.substring(0, 50) + '...', title });
                
                if (!src) {
                    return `![${alt}](图片链接缺失)`;
                }
                
                // 如果有title且与alt不同，则包含title
                if (title && title !== alt && title.trim() !== '') {
                    return `![${alt}](${src} "${title}")`;
                } else {
                    return `![${alt}](${src})`;
                }
            }
        });

        // 表格转换规则
        this.turndownService.addRule('table', {
            filter: 'table',
            replacement: function (content, node) {
                const rows = Array.from(node.querySelectorAll('tr'));
                if (rows.length === 0) return '';

                let markdown = '\n';
                
                rows.forEach((row, rowIndex) => {
                    const cells = Array.from(row.querySelectorAll('td, th'));
                    const cellContents = cells.map(cell => cell.textContent.trim().replace(/\|/g, '\\|'));
                    
                    markdown += '| ' + cellContents.join(' | ') + ' |\n';
                    
                    // 添加表头分隔符
                    if (rowIndex === 0) {
                        markdown += '|' + ' --- |'.repeat(cells.length) + '\n';
                    }
                });
                
                return markdown + '\n';
            }
        });

        // 代码块转换规则
        this.turndownService.addRule('code', {
            filter: ['pre'],
            replacement: function (content, node) {
                const codeElement = node.querySelector('code');
                const language = codeElement ? (codeElement.className.match(/language-(\w+)/) || [])[1] || '' : '';
                const codeContent = codeElement ? codeElement.textContent : node.textContent;
                
                return '\n```' + language + '\n' + codeContent + '\n```\n';
            }
        });

        console.log('自定义转换规则已添加');
    }

    // 绑定事件
    bindEvents() {
        document.getElementById('convertBtn').addEventListener('click', () => {
            this.convertCurrentPage();
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadMarkdown();
        });

        // 选项变化时的实时预览（可选）
        const optionInputs = document.querySelectorAll('input[type="checkbox"]');
        optionInputs.forEach(input => {
            input.addEventListener('change', () => {
                // 可以在这里添加实时预览功能
                console.log('选项已更改:', input.id, input.checked);
            });
        });
    }

    // 转换当前页面
    async convertCurrentPage() {
        try {
            this.updateUI('loading');
            
            // 获取当前活动标签页
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('无法获取当前标签页');
            }

            console.log('当前标签页:', tab.url);

            // 获取转换选项
            const options = this.getConversionOptions();
            console.log('转换选项:', options);

            // 在页面中执行内容提取
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractPageContentFunction,
                args: [options]
            });

            if (!results || !results[0]) {
                throw new Error('无法执行内容提取脚本');
            }

            const pageData = results[0].result;
            console.log('页面数据:', pageData);

            // 处理提取的内容
            this.processPageContent(pageData);

        } catch (error) {
            console.error('转换失败:', error);
            this.showError('转换失败: ' + error.message);
        }
    }

    // 获取转换选项
    getConversionOptions() {
        return {
            includeImages: document.getElementById('includeImages').checked,
            includeLinks: document.getElementById('includeLinks').checked,
            includeBackgroundImages: document.getElementById('includeBackgroundImages').checked
        };
    }

    // 处理提取的页面内容
    processPageContent(pageData) {
        if (!pageData.success) {
            throw new Error(pageData.error);
        }

        if (!this.turndownService) {
            throw new Error('Turndown服务未初始化');
        }

        try {
            console.log('=== 开始处理页面内容 ===');
            console.log('页面数据统计:', pageData.stats);
            
            // 验证HTML内容
            if (!pageData.html || pageData.html.trim() === '') {
                throw new Error('页面内容为空');
            }

            console.log('HTML内容长度:', pageData.html.length);

            // 使用Turndown转换HTML为Markdown
            let markdown;
            try {
                console.log('开始Turndown转换...');
                markdown = this.turndownService.turndown(pageData.html);
                console.log('Turndown转换完成，Markdown长度:', markdown.length);
            } catch (turndownError) {
                console.error('Turndown转换错误:', turndownError);
                // 使用备用转换方法
                markdown = this.fallbackHtmlToMarkdown(pageData.html);
                console.log('使用备用转换方法，Markdown长度:', markdown.length);
            }

            // 确保有转换结果
            if (!markdown || markdown.trim() === '') {
                throw new Error('转换结果为空');
            }

            // 添加页面信息头部
            const title = pageData.title || '未知标题';
            const url = pageData.url || '';
            const stats = pageData.stats || {};
            
            const header = `# ${title}

> **来源**: [${title}](${url})  
> **转换时间**: ${new Date().toLocaleString('zh-CN')}  
> **统计**: 图片 ${stats.imagesFound || 0} 张，链接 ${stats.linksFound || 0} 个

---

`;
            
            markdown = header + markdown;

            // 清理和格式化Markdown
            markdown = this.cleanMarkdown(markdown);

            this.currentMarkdown = markdown;
            this.displayMarkdown(markdown);
            this.updateUI('success');
            this.updateStats();

            console.log('=== 处理完成 ===');

        } catch (error) {
            console.error('处理页面内容时出错:', error);
            throw new Error('Markdown转换失败: ' + error.message);
        }
    }

    // 备用HTML到Markdown转换方法
    fallbackHtmlToMarkdown(html) {
        try {
            console.log('使用备用转换方法...');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // 处理标题
            tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                const markdown = '\n\n' + '#'.repeat(level) + ' ' + heading.textContent.trim() + '\n\n';
                heading.outerHTML = markdown;
            });
            
            // 处理段落
            tempDiv.querySelectorAll('p').forEach(p => {
                p.outerHTML = '\n\n' + p.textContent.trim() + '\n\n';
            });
            
            // 处理列表
            tempDiv.querySelectorAll('li').forEach(li => {
                li.outerHTML = '- ' + li.textContent.trim() + '\n';
            });
            
            // 处理图片 - 关键改进
            tempDiv.querySelectorAll('img').forEach((img, index) => {
                const alt = img.getAttribute('alt') || img.getAttribute('title') || `图片${index + 1}`;
                const src = img.getAttribute('src') || '';
                const title = img.getAttribute('title') || '';
                
                console.log(`备用方法处理图片 ${index + 1}:`, { alt, src: src.substring(0, 50) + '...', title });
                
                if (src) {
                    const titlePart = title && title !== alt ? ` "${title}"` : '';
                    img.outerHTML = `\n\n![${alt}](${src}${titlePart})\n\n`;
                } else {
                    img.outerHTML = `\n\n![${alt}](图片链接缺失)\n\n`;
                }
            });
            
            // 处理链接
            tempDiv.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href') || '';
                const text = a.textContent.trim();
                a.outerHTML = href ? `[${text}](${href})` : text;
            });
            
            // 处理粗体和斜体
            tempDiv.querySelectorAll('strong, b').forEach(b => {
                b.outerHTML = '**' + b.textContent.trim() + '**';
            });
            
            tempDiv.querySelectorAll('em, i').forEach(i => {
                i.outerHTML = '*' + i.textContent.trim() + '*';
            });
            
            // 获取最终文本
            const result = tempDiv.textContent || tempDiv.innerText || '';
            console.log('备用转换完成，长度:', result.length);
            return result;
            
        } catch (error) {
            console.error('备用转换方法也失败:', error);
            // 最后的备用方案：直接提取文本
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.textContent || tempDiv.innerText || '转换失败';
        }
    }

    // 清理和格式化Markdown
    cleanMarkdown(markdown) {
        return markdown
            // 移除多余的空行
            .replace(/\n{4,}/g, '\n\n\n')
            // 修复列表格式
            .replace(/\n([*\-+])\s/g, '\n$1 ')
            // 修复标题格式
            .replace(/\n(#{1,6})\s*/g, '\n\n$1 ')
            // 移除行首行尾空白
            .split('\n')
            .map(line => line.trim())
            .join('\n')
            // 最终清理
            .trim();
    }

    // 显示Markdown内容
    displayMarkdown(markdown) {
        const outputElement = document.getElementById('markdownOutput');
        const statusElement = document.getElementById('statusMessage');

        outputElement.value = markdown;
        outputElement.classList.add('show');
        statusElement.style.display = 'none';

        // 启用操作按钮
        document.getElementById('copyBtn').disabled = false;
        document.getElementById('downloadBtn').disabled = false;
    }

    // 复制到剪贴板
    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.currentMarkdown);
            this.showSuccess('已复制到剪贴板');
        } catch (error) {
            console.error('复制失败:', error);
            
            // 备用复制方法
            const textArea = document.createElement('textarea');
            textArea.value = this.currentMarkdown;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showSuccess('已复制到剪贴板');
        }
    }

    getCurrentEditorContent() {
        const outputElement = document.getElementById('markdownOutput');
        return outputElement ? outputElement.value : this.currentMarkdown;
    }

    getMarkdownTitle(markdown) {
        const match = markdown.match(/^\s*#\s+(.+?)\s*$/m);
        return match ? match[1].trim() : '';
    }

    sanitizeFilename(filename) {
        return filename
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 120);
    }

    // 下载Markdown文件
    downloadMarkdown() {
        try {
            const markdownContent = this.getCurrentEditorContent();

            if (!markdownContent || markdownContent.trim() === '') {
                throw new Error('没有可下载的Markdown内容');
            }

            const markdownTitle = this.getMarkdownTitle(markdownContent);
            const safeTitle = this.sanitizeFilename(markdownTitle) || `webpage-${new Date().getTime()}`;
            const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${safeTitle}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            this.showSuccess('文件下载已开始');
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('下载失败: ' + error.message);
        }
    }

    // 更新统计信息
    updateStats() {
        const stats = {
            characters: this.currentMarkdown.length,
            words: this.currentMarkdown.split(/\s+/).filter(word => word.length > 0).length,
            lines: this.currentMarkdown.split('\n').length,
            images: (this.currentMarkdown.match(/!\[.*?\]\(.*?\)/g) || []).length,
            links: (this.currentMarkdown.match(/\[.*?\]\(.*?\)/g) || []).length
        };

        // 更新UI中的统计信息
        const statsElement = document.getElementById('statsInfo');
        if (statsElement) {
            statsElement.innerHTML = `
                字符: ${stats.characters} | 
                单词: ${stats.words} | 
                行数: ${stats.lines} | 
                图片: ${stats.images} | 
                链接: ${stats.links}
            `;
        }
    }

    // 更新UI状态
    updateUI(state) {
        const convertBtn = document.getElementById('convertBtn');
        const statusElement = document.getElementById('statusMessage');
        const outputElement = document.getElementById('markdownOutput');

        switch (state) {
            case 'ready':
                convertBtn.disabled = false;
                convertBtn.textContent = '转换页面';
                statusElement.textContent = '请点击"转换页面"开始转换';
                statusElement.className = 'status-message';
                statusElement.style.display = 'block';
                outputElement.classList.remove('show');
                break;

            case 'loading':
                convertBtn.disabled = true;
                convertBtn.textContent = '转换中...';
                statusElement.textContent = '正在提取和转换页面内容，请稍候...';
                statusElement.className = 'status-message loading';
                statusElement.style.display = 'block';
                outputElement.classList.remove('show');
                break;

            case 'success':
                convertBtn.disabled = false;
                convertBtn.textContent = '重新转换';
                statusElement.style.display = 'none';
                break;

            case 'error':
                convertBtn.disabled = false;
                convertBtn.textContent = '转换页面';
                statusElement.className = 'status-message error';
                statusElement.style.display = 'block';
                outputElement.classList.remove('show');
                break;
        }
    }

    // 显示成功消息
    showSuccess(message) {
        this.createNotification(message, 'success');
    }

    // 显示错误消息
    showError(message) {
        console.error('错误:', message);
        this.updateUI('error');
        
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = 'status-message error';
        statusElement.style.display = 'block';
        
        this.createNotification(message, 'error');
    }

    // 创建通知
    createNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 根据类型设置颜色
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('WebMarkdown扩展启动');
    const converter = new WebMarkdownConverter();
    converter.init();
}); 
