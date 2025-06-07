const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');

function getFiles({ dir, include, exclude }) {
  const patterns = [];

  if (include) {
    patterns.push(include);
  } else {
    patterns.push('**/*');
  }

  if (exclude) {
    patterns.push('!' + exclude);
  }

  return fg.sync(patterns, {
    cwd: dir,
    onlyFiles: true,
    dot: true
  }).sort();
}

function compareContents(filePath1, filePath2) {
  try {
    const content1 = fs.readFileSync(filePath1, 'utf8');
    const content2 = fs.readFileSync(filePath2, 'utf8');
    return content1 === content2;
  } catch {
    return false;
  }
}

function runDiff({ target, other, compareName, compareContent }) {
  const targetFiles = getFiles(target);
  const otherFiles = getFiles(other);

  if (compareName) {
    const onlyInTarget = targetFiles.filter(f => !otherFiles.includes(f));
    const onlyInOther = otherFiles.filter(f => !targetFiles.includes(f));

    console.log('=== Files only in target ===');
    onlyInTarget.length ? onlyInTarget.forEach(f => console.log(f)) : console.log('None');

    console.log('\n=== Files only in other ===');
    onlyInOther.length ? onlyInOther.forEach(f => console.log(f)) : console.log('None');
  }

  if (compareContent) {
    const commonFiles = targetFiles.filter(f => otherFiles.includes(f));
    const differentFiles = commonFiles.filter(f => {
      const tPath = path.join(target.dir, f);
      const oPath = path.join(other.dir, f);
      return !compareContents(tPath, oPath);
    });

    console.log('\n=== Files with different contents ===');
    differentFiles.length ? differentFiles.forEach(f => console.log(f)) : console.log('None');
  }
}

module.exports = runDiff;
