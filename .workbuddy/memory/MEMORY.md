# 项目记忆

## 项目概述
- 这是一个基于 Jekyll 的在线简历项目，使用 jglovier/resume-template 模板
- 用户：周乐林，前端工程师，10年工作经验
- 数据文件在 `_data/` 目录下（YAML格式），布局在 `_layouts/resume.html`，样式在 `_sass/`
- 部署目标：GitHub Pages（有 CNAME 文件）

## 技术栈
- Jekyll + SCSS + Liquid 模板
- Google Fonts: Lora (serif) + Open Sans (sans-serif)
- 数据驱动：所有内容通过 `_data/*.yml` 管理

## 数据结构
- `_config.yml`: 全局配置（姓名、联系方式、个人简介、个人信息字段）
- `_data/experience.yml`: 工作经历
- `_data/education.yml`: 教育背景
- `_data/skills.yml`: 技能特长
- `_data/projects.yml`: 项目经验
- `_data/recognitions.yml`: 荣誉认证（当前为空）
- `_data/associations.yml`: 社会组织（当前为空）
- `_data/links.yml`: 联系方式
- `_data/interests.yml`: 兴趣爱好（当前为空）

## 修改记录
- 2026-07-27: 从 Word 文档提取简历信息并填入项目数据文件
  - 新增 _config.yml 字段：性别、出生日期、工作经验、教育程度、职业状态、期望行业、期望职位
  - 新增 skills.yml 条目：Web标准与页面构建（W3C/Html5/CSS3）
  - 修正 projects.yml：信通院项目"中国电信研究院"→"中国信息通信研究院"
  - 更新 resume.html 布局：新增"个人概况"信息卡片区域，所有 section 标题改为中文
  - 优化 _resume.scss：新增个人信息网格样式、响应式适配、列表样式优化
  - 生成 build-preview.js 脚本：用 Node.js + sass + js-yaml 生成独立 HTML 预览
  - 生成 preview.html：完整的独立 HTML 预览文件（含内联 CSS）

## 构建/预览方式
- Jekyll 构建：需要 Ruby + bundler（`bundle exec jekyll serve`）
- 快速预览：`NODE_PATH=... node build-preview.js` 生成 preview.html，然后用 `python -m http.server` 预览
