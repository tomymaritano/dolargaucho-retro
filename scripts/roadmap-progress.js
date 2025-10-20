#!/usr/bin/env node

/**
 * Roadmap Progress Report
 *
 * Generates a progress report from roadmap features
 */

const fs = require('fs');

function parseRoadmap() {
  const roadmapPath = './constants/roadmap.ts';
  const content = fs.readFileSync(roadmapPath, 'utf-8');

  // Count features by status
  const completed = (content.match(/status: 'completed'/g) || []).length;
  const inProgress = (content.match(/status: 'in-progress'/g) || []).length;
  const planned = (content.match(/status: 'planned'/g) || []).length;

  const total = completed + inProgress + planned;

  return { completed, inProgress, planned, total };
}

function generateProgressBar(percentage, width = 40) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '━'.repeat(filled) + '╸' + '━'.repeat(Math.max(0, empty - 1));
}

function main() {
  console.log('\n📊 Roadmap Progress Report - Q1-Q2 2025\n');

  const { completed, inProgress, planned, total } = parseRoadmap();
  const completedPercentage = Math.round((completed / total) * 100);
  const inProgressPercentage = Math.round((inProgress / total) * 100);

  console.log(`Overall Progress: ${completedPercentage}%`);
  console.log(generateProgressBar(completedPercentage));
  console.log('');

  console.log(`✅ Completed: ${completed}/${total} features`);
  console.log(`🟠 In Progress: ${inProgress}/${total} features`);
  console.log(`🟡 Planned: ${planned}/${total} features`);
  console.log('');

  // Summary by quarter (hardcoded - could parse from roadmap)
  console.log('By Quarter:');
  console.log('  Q1 2025: 5 features (Discord, Email, Alerts, Testing, Security)');
  console.log('  Q2 2025: 13 features (AI Insights, Search, Export, Charts, Wallets, etc.)');
  console.log('');

  console.log('By Priority:');
  console.log('  High: 10 features');
  console.log('  Medium: 6 features');
  console.log('  Low: 2 features');
  console.log('');

  // Next steps
  console.log('📅 Next Steps:');
  console.log('  1. Complete in-progress features: PWA Mobile, API Pública, Auth System');
  console.log('  2. Start Q1 planned features: Discord, Email Service, Alertas Backend');
  console.log('  3. Review blocked issues weekly');
  console.log('');

  console.log('🔗 Resources:');
  console.log('  - Roadmap: docs/ROADMAP_Q1_Q2_2025.md');
  console.log('  - GitHub Project: https://github.com/tomymaritano/dolargaucho-retro/projects');
  console.log(
    '  - Issues: https://github.com/tomymaritano/dolargaucho-retro/issues?q=label:roadmap'
  );
  console.log('');
}

main();
