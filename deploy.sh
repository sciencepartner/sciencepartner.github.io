#!/bin/bash
# 科学伙伴网站部署脚本

echo "=========================================="
echo "🚀 科学伙伴网站部署工具"
echo "=========================================="

# 检查必要工具
check_tools() {
    echo "🔧 检查必要工具..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装，请先安装 Git"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python3 未安装，请先安装 Python3"
        exit 1
    fi
    
    echo "✅ 所有必要工具已安装"
}

# 创建本地预览
create_preview() {
    echo ""
    echo "🌐 创建本地预览..."
    
    # 检查是否在项目目录
    if [ ! -f "index.html" ]; then
        echo "❌ 请在项目根目录运行此脚本"
        exit 1
    fi
    
    # 启动本地服务器
    echo "📡 启动本地服务器 (端口: 8000)"
    echo "🔗 访问地址: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    python3 -m http.server 8000
}

# 部署到 GitHub Pages
deploy_github() {
    echo ""
    echo "🚀 部署到 GitHub Pages..."
    
    read -p "请输入 GitHub 仓库地址 (例如: https://github.com/用户名/sciencepartner-website): " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 请输入有效的仓库地址"
        exit 1
    fi
    
    echo ""
    echo "📦 初始化 Git 仓库..."
    
    # 初始化 Git
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "初始提交: 科学伙伴网站"
    fi
    
    # 添加远程仓库
    git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
    
    echo "📤 推送到 GitHub..."
    git push -u origin main || git push -u origin master
    
    echo ""
    echo "✅ 部署完成！"
    echo ""
    echo "接下来需要："
    echo "1. 访问 https://github.com/你的用户名/sciencepartner-website"
    echo "2. 进入 Settings → Pages"
    echo "3. 选择分支 (main/master)"
    echo "4. 选择根目录 (/)"
    echo "5. 保存设置"
    echo ""
    echo "网站将在几分钟内上线"
}

# 部署到自定义域名
deploy_custom_domain() {
    echo ""
    echo "🌍 配置自定义域名..."
    
    read -p "请输入你的域名 (例如: sciencepartner.com.cn): " domain
    
    if [ -z "$domain" ]; then
        echo "❌ 请输入有效的域名"
        exit 1
    fi
    
    # 创建 CNAME 文件
    echo "$domain" > CNAME
    
    echo ""
    echo "📝 已创建 CNAME 文件"
    echo ""
    echo "接下来需要："
    echo "1. 在你的域名注册商处添加 DNS 记录："
    echo "   类型: CNAME"
    echo "   名称: www (或 @)"
    echo "   值: 你的用户名.github.io"
    echo ""
    echo "2. 在 GitHub Pages 设置中添加自定义域名"
    echo "3. 启用 HTTPS"
}

# 主菜单
main_menu() {
    echo ""
    echo "请选择操作："
    echo "1. 🎯 本地预览"
    echo "2. 🚀 部署到 GitHub Pages"
    echo "3. 🌍 配置自定义域名"
    echo "4. 📋 显示部署说明"
    echo "5. ❌ 退出"
    echo ""
    
    read -p "请输入选项 (1-5): " choice
    
    case $choice in
        1)
            create_preview
            ;;
        2)
            deploy_github
            ;;
        3)
            deploy_custom_domain
            ;;
        4)
            show_instructions
            ;;
        5)
            echo "再见！👋"
            exit 0
            ;;
        *)
            echo "❌ 无效选项"
            main_menu
            ;;
    esac
}

# 显示部署说明
show_instructions() {
    echo ""
    echo "📋 科学伙伴网站部署说明"
    echo "=========================================="
    echo ""
    echo "🎯 项目概述"
    echo "   这是一个为'科学伙伴'内容品牌创建的高端静态网站"
    echo "   采用纯 HTML/CSS/JavaScript 技术栈"
    echo "   完全响应式设计，支持移动端"
    echo ""
    echo "🚀 部署选项"
    echo ""
    echo "1. GitHub Pages (推荐)"
    echo "   优势：完全免费、全球 CDN、自动 HTTPS"
    echo "   步骤："
    echo "   - 创建 GitHub 仓库"
    echo "   - 运行部署脚本"
    echo "   - 在仓库设置中启用 GitHub Pages"
    echo ""
    echo "2. Netlify"
    echo "   优势：自动部署、表单处理、服务器端函数"
    echo "   步骤："
    echo "   - 注册 Netlify 账号"
    echo "   - 拖拽项目文件夹到 Netlify"
    echo "   - 配置自定义域名"
    echo ""
    echo "3. Vercel"
    echo "   优势：极速部署、边缘网络、自动优化"
    echo "   步骤："
    echo "   - 注册 Vercel 账号"
    echo "   - 导入 GitHub 仓库"
    echo "   - 自动部署"
    echo ""
    echo "🌍 自定义域名"
    echo "   1. 在域名注册商处添加 CNAME 记录"
    echo "   2. 在部署平台配置自定义域名"
    echo "   3. 启用 HTTPS"
    echo ""
    echo "🔧 内容更新"
    echo "   1. 编辑 data/ 目录下的 JSON 文件"
    echo "   2. 提交更改到 Git"
    echo "   3. 部署平台会自动重新部署"
    echo ""
    echo "📞 技术支持"
    echo "   如有问题，请参考项目 README.md"
    echo "   或联系：contact@sciencepartner.com.cn"
    echo ""
    
    read -p "按回车键返回主菜单..." -n 1
    main_menu
}

# 主程序
echo ""
check_tools
main_menu