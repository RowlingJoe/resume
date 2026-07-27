const fs = require('fs');
const path = require('path');
const sass = require('sass');
const yaml = require('js-yaml');

const ROOT = 'D:/study/resume';

// Load _config.yml
const configRaw = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
// Remove Jekyll front matter dashes if present, but _config.yml doesn't have them
const config = yaml.load(configRaw);

// Load all data files
function loadData(name) {
  const raw = fs.readFileSync(path.join(ROOT, '_data', name + '.yml'), 'utf8');
  try {
    return yaml.load(raw) || [];
  } catch(e) {
    console.warn(`Warning parsing ${name}.yml:`, e.message);
    return [];
  }
}

const experience = loadData('experience');
const education = loadData('education');
const skills = loadData('skills');
const projects = loadData('projects');
const recognitions = loadData('recognitions');
const associations = loadData('associations');
const links = loadData('links');
const interests = loadData('interests');

// Compile SCSS
const scssContent = `
@import "normalize";
@import "mixins";
@import "variables";
@import "base";
@import "layout";
@import "resume";
`;

// We need to use the sass importer to resolve @import paths
const result = sass.compileString(scssContent, {
  loadPaths: [path.join(ROOT, '_sass')],
  style: 'expanded'
});

const css = result.css;

// Generate HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Generate personal info section
function genPersonalInfo() {
  const items = [];
  if (config.resume_gender) {
    items.push(`<div class="info-item"><span class="info-label">性别</span><span class="info-value">${config.resume_gender}</span></div>`);
  }
  if (config.resume_birthdate) {
    items.push(`<div class="info-item"><span class="info-label">出生日期</span><span class="info-value">${config.resume_birthdate}</span></div>`);
  }
  if (config.resume_experience_years) {
    items.push(`<div class="info-item"><span class="info-label">工作经验</span><span class="info-value">${config.resume_experience_years}</span></div>`);
  }
  if (config.resume_education_level) {
    items.push(`<div class="info-item"><span class="info-label">教育程度</span><span class="info-value">${config.resume_education_level}</span></div>`);
  }
  if (config.resume_work_status) {
    items.push(`<div class="info-item"><span class="info-label">职业状态</span><span class="info-value status-tag">${config.resume_work_status}</span></div>`);
  }
  if (config.resume_career_industry) {
    items.push(`<div class="info-item info-item-wide"><span class="info-label">期望行业</span><span class="info-value">${config.resume_career_industry}</span></div>`);
  }
  if (config.resume_career_position) {
    items.push(`<div class="info-item"><span class="info-label">期望职位</span><span class="info-value">${config.resume_career_position}</span></div>`);
  }
  if (items.length === 0) return '';
  return `
      <section class="content-section personal-info-section">
        <header class="section-header">
          <h2>个人概况</h2>
        </header>
        <div class="personal-info-grid">
          ${items.join('\n          ')}
        </div>
      </section>`;
}

// Generate experience section
function genExperience() {
  if (!config.resume_section_experience) return '';
  const items = experience.map(job => `
        <div class="resume-item" itemscope itemprop="worksFor" itemtype="http://schema.org/Organization">
          <h3 class="resume-item-title" itemprop="name">${job.company}</h3>
          <h4 class="resume-item-details" itemprop="description">${job.position} &bull; ${job.duration}</h4>
          <p class="resume-item-copy">${job.summary}</p>
        </div>`).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>工作经历</h2>
        </header>
${items}
      </section>`;
}

// Generate education section
function genEducation() {
  if (!config.resume_section_education) return '';
  const items = education.map(edu => {
    const awards = edu.awards ? edu.awards.map(a => `              <li>${a.award}</li>`).join('\n') : '';
    return `
        <div class="resume-item" itemscope itemprop="alumniOf" itemtype="http://schema.org/CollegeOrUniversity">
          <h3 class="resume-item-title" itemprop="name">${edu.uni}</h3>
          <h4 class="resume-item-details group" itemprop="description">${edu.degree} &bull; ${edu.year}</h4>
${awards ? `          <ul class="resume-item-list">\n${awards}\n          </ul>` : ''}
          <p class="resume-item-copy">${edu.summary || ''}</p>
        </div>`;
  }).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>教育背景</h2>
        </header>
${items}
      </section>`;
}

// Generate projects section
function genProjects() {
  if (!config.resume_section_projects) return '';
  const items = projects.map(proj => `
        <div class="resume-item" itemscope itemtype="http://schema.org/CreativeWork">
          <h3 class="resume-item-title" itemprop="name">${proj.project}</h3>
          <h4 class="resume-item-details" itemprop="description">${proj.role} &bull; ${proj.duration}</h4>
          <p class="resume-item-copy">${proj.description}</p>
        </div>`).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>项目经验</h2>
        </header>
${items}
      </section>`;
}

// Generate skills section
function genSkills() {
  if (!config.resume_section_skills) return '';
  const items = skills.map(skill => `
        <div class="resume-item">
          <h4 class="resume-item-details">${skill.skill}</h4>
          <p class="resume-item-copy">${skill.description}</p>
        </div>`).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>技能特长</h2>
        </header>
${items}
      </section>`;
}

// Generate recognition section
function genRecognitions() {
  if (!config.resume_section_recognition || !recognitions || recognitions.length === 0) return '';
  const items = recognitions.map(rec => `
        <div class="resume-item">
          <h3 class="resume-item-title" itemprop="award">${rec.award}</h3>
          <h4 class="resume-item-details">${rec.organization} &bull; ${rec.year}</h4>
          <p class="resume-item-copy">${rec.summary}</p>
        </div>`).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>荣誉认证</h2>
        </header>
${items}
      </section>`;
}

// Generate associations section
function genAssociations() {
  if (!config.resume_section_associations || !associations || associations.length === 0) return '';
  const items = associations.map(assoc => `
        <div class="resume-item" itemscope itemprop="memberOf" itemtype="http://schema.org/Organization">
          <h3 class="resume-item-title" itemprop="name">${assoc.organization}</h3>
          <h4 class="resume-item-details" itemprop="description">${assoc.role} &bull; ${assoc.year}</h4>
          <p class="resume-item-copy">${assoc.summary}</p>
        </div>`).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>社会组织</h2>
        </header>
${items}
      </section>`;
}

// Generate links section
function genLinks() {
  if (!config.resume_section_links || !links || links.length === 0) return '';
  const items = links.map(link => `            <li><a href="${link.url}" itemprop="url">${link.description}</a></li>`).join('\n');
  return `
      <section class="content-section">
        <header class="section-header">
          <h2>联系方式</h2>
        </header>
        <div class="resume-item">
          <ul class="resume-item-list">
${items}
          </ul>
        </div>
      </section>`;
}

// Check if avatar image exists
let avatarHtml = '';
if (config.resume_avatar === 'true') {
  const avatarPath = path.join(ROOT, 'images', 'avatar.jpg');
  if (fs.existsSync(avatarPath)) {
    const avatarData = fs.readFileSync(avatarPath).toString('base64');
    avatarHtml = `<img src="data:image/jpeg;base64,${avatarData}" alt="my photo" class="avatar no-print" itemprop="image">`;
  } else {
    // Try png
    const avatarPathPng = path.join(ROOT, 'images', 'avatar.png');
    if (fs.existsSync(avatarPathPng)) {
      const avatarData = fs.readFileSync(avatarPathPng).toString('base64');
      avatarHtml = `<img src="data:image/png;base64,${avatarData}" alt="my photo" class="avatar no-print" itemprop="image">`;
    }
  }
}

// Generate favicon
let faviconLink = '';
const faviconPath = path.join(ROOT, 'favicon.png');
if (fs.existsSync(faviconPath)) {
  const faviconData = fs.readFileSync(faviconPath).toString('base64');
  faviconLink = `<link rel="icon" type="image/x-icon" href="data:image/png;base64,${faviconData}" />`;
}

// Assemble full HTML
const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${config.title || config.resume_name + ' - 简历'}</title>
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700|Open+Sans:400,300,800,700' rel='stylesheet' type='text/css'>
    <meta name="description" content="${config.description || ''}">
    <style>
${css}
    </style>
    ${faviconLink}
  </head>
  <body class="theme-default">
    <div class="wrapper" itemscope itemtype="http://schema.org/Person">
      <meta itemprop="telephone" content="${config.resume_contact_telephone || ''}"/>
      <meta itemprop="address" content="${config.resume_contact_address || ''}"/>

      <header class="page-header">
        ${avatarHtml}
        <h1 class="header-name" itemprop="name">${config.resume_name}</h1>
        ${config.display_header_contact_info === 'true' ? `<div class="header-contact-info"><p>${config.resume_header_contact_info}</p></div>` : ''}
        <div class="title-bar no-print">
          <h2 class="header-title" itemprop="jobTitle">${config.resume_title}</h2>
        </div>
        <div class="executive-summary" itemprop="description">
          ${config.resume_header_intro || ''}
        </div>
        ${config.resume_looking_for_work === 'yes' ? `<a href="mailto:${config.resume_contact_email}" class="contact-button no-print" itemprop="email">联系我</a>` : ''}
      </header>
${genPersonalInfo()}
${genExperience()}
${genEducation()}
${genProjects()}
${genSkills()}
${genRecognitions()}
${genAssociations()}
${genLinks()}

      <footer class="page-footer">
        <p class="footer-line">${config.resume_name || ''} &bull; 在线简历 &bull; 基于 <a href="https://github.com/jglovier/resume-template">Jekyll Resume Template</a> 构建</p>
      </footer>

    </div>
  </body>
</html>`;

const outputPath = path.join(ROOT, 'preview.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log('Preview generated: ' + outputPath);
console.log('CSS size: ' + css.length + ' chars');
console.log('HTML size: ' + html.length + ' chars');
