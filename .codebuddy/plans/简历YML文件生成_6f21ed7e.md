---
name: 简历YML文件生成
overview: 根据"前端工程师周乐林10年工作经验.docx"简历内容，更新Jekyll简历模板的_config.yml和_data目录下的所有YML数据文件
todos:
  - id: update-config
    content: 更新 _config.yml：修改姓名、标题、联系方式、自我介绍
    status: completed
  - id: update-experience
    content: 重写 _data/experience.yml：添加4段工作经历（2021-2016按时间倒序）
    status: completed
    dependencies:
      - update-config
  - id: update-education
    content: 重写 _data/education.yml：添加甘肃农业大学本科教育背景
    status: completed
    dependencies:
      - update-config
  - id: update-skills
    content: 重写 _data/skills.yml：分类添加7类技能特长
    status: completed
    dependencies:
      - update-config
  - id: update-projects
    content: 重写 _data/projects.yml：添加6个项目经验及技术成果
    status: completed
    dependencies:
      - update-experience
  - id: update-links
    content: 更新 _data/links.yml：添加社交链接和联系方式
    status: completed
    dependencies:
      - update-config
  - id: cleanup-files
    content: 清理无内容数据文件：清空 associations.yml、interests.yml、recognitions.yml
    status: completed
    dependencies:
      - update-config
  - id: validate-yml
    content: 验证所有YML文件格式正确性，确保Jekyll能正确解析
    status: completed
    dependencies:
      - update-experience
      - update-education
      - update-skills
      - update-projects
      - update-links
      - cleanup-files
---

## 产品概述

根据Word简历文档（前端工程师周乐林10年工作经验.docx）的内容，生成用于Jekyll简历模板的YML数据文件，实现在线简历展示。

## 核心功能

- 更新个人基本信息：姓名、联系方式、职业标题等
- 更新工作经历：4段完整的工作经验（2016-2025）
- 更新教育背景：甘肃农业大学本科学历
- 更新技能特长：前端技术栈、框架、工具等分类展示
- 更新项目经验：6个主要项目经历及技术成果
- 更新社交链接：邮箱、电话、所在地等联系信息
- 清理无内容的数据文件：荣誉、协会、兴趣等（简历中未提及）

## 技术栈

- 数据格式：YAML（YML）
- 模板引擎：Jekyll
- 现有项目结构：基于 jglovier/resume-template 的 Jekyll 简历模板

## 实现方案

### 文件修改清单

| 文件路径 | 操作 | 说明 |
| --- | --- | --- |
| `_config.yml` | 修改 | 更新个人基本信息、联系方式、简历标题、自我介绍 |
| `_data/experience.yml` | 重写 | 按时间倒序添加4段工作经历 |
| `_data/education.yml` | 重写 | 添加甘肃农业大学本科教育背景 |
| `_data/skills.yml` | 重写 | 分类整理技能特长（7个类别） |
| `_data/projects.yml` | 重写 | 添加6个项目经验及技术成果 |
| `_data/links.yml` | 修改 | 更新社交链接 |
| `_data/associations.yml` | 清空 | 简历中未提及相关内容 |
| `_data/interests.yml` | 清空 | 简历中未提及相关内容 |
| `_data/recognitions.yml` | 清空 | 简历中未提及相关内容 |


### YML格式规范

- 日期范围使用 `&mdash;` 表示长破折号
- 多行内容使用 `>` 或 `|` 符号
- 列表项使用YAML数组格式 `- key: value`
- HTML内容可直接嵌入（模板支持）

### 数据结构设计

**experience.yml 结构：**

```
- company: 公司名称
  position: 职位
  duration: 开始时间 &mdash; 结束时间
  summary: 工作内容描述（支持HTML）
```

**projects.yml 结构：**

```
- project: 项目名称
  role: 担任角色
  duration: 时间范围
  description: 项目描述
```

**skills.yml 结构：**

```
- skill: 技能类别
  description: 技能描述
```

## Agent Extensions

### Skill

- **docx**
- Purpose: 读取和解析Word文档内容，确保简历信息提取的准确性
- Expected outcome: 已成功提取简历所有文本内容，包括个人信息、工作经历、项目经验、技能等