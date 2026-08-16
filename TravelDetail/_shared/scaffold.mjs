import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_BASE_DIR = path.resolve(SCRIPT_DIR, '..');

export class ScaffoldError extends Error {}

const DESTINATION_PATTERN = /^[A-Za-z]+(-[A-Za-z]+)*$/;
const YYYYMM_PATTERN = /^\d{6}$/;

export function folderName(destination, yyyymm) {
  if (!DESTINATION_PATTERN.test(destination)) {
    throw new ScaffoldError(
      `destination 必須是羅馬拼音（例如 "Tailand"），收到："${destination}"`,
    );
  }
  if (!YYYYMM_PATTERN.test(yyyymm)) {
    throw new ScaffoldError(`yyyymm 必須是 6 位數字（例如 "202610"），收到："${yyyymm}"`);
  }
  return `${destination}-${yyyymm}`;
}

function dmHtmlSkeleton(destination) {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${destination} 行程</title>
<link rel="stylesheet" href="../_shared/components.css">
<link rel="stylesheet" href="theme.css">
</head>
<body>
<!-- TODO: hero / site-nav / day-card 內容依 plan.md 與研究結果填入，結構請參考 .claude/skills/travel-detail-page/SKILL.md -->
<script src="../_shared/scroll-reveal.js" defer></script>
</body>
</html>
`;
}

/**
 * Deterministic scaffold step for a trip folder. Content authoring (the
 * actual itinerary text) happens after this, by the skill's LLM step — this
 * only sets up the folder, the shared-asset references, and the theme token
 * starting point. Never overwrites a file that already exists: `force` only
 * lets the call proceed into an already-existing trip folder to fill in
 * whatever files are missing, it does not reset existing ones.
 */
export function scaffoldTrip({ destination, yyyymm, baseDir = DEFAULT_BASE_DIR, force = false }) {
  const name = folderName(destination, yyyymm);

  const sharedDir = path.join(baseDir, '_shared');
  const themeTemplatePath = path.join(sharedDir, 'theme.template.css');
  if (!fs.existsSync(themeTemplatePath)) {
    throw new ScaffoldError(`找不到 _shared/theme.template.css，無法建立主題 token 範本：${themeTemplatePath}`);
  }

  const tripDir = path.join(baseDir, name);
  const tripDirExists = fs.existsSync(tripDir);
  if (tripDirExists && !force) {
    throw new ScaffoldError(
      `資料夾已存在，拒絕覆蓋：${tripDir}（如需在既有資料夾內補齊缺少的檔案，請明確傳入 force: true；已存在的檔案不會被覆蓋）`,
    );
  }
  if (!tripDirExists) {
    fs.mkdirSync(tripDir, { recursive: true });
  }

  const files = {
    theme: path.join(tripDir, 'theme.css'),
    dm: path.join(tripDir, 'dm.html'),
    plan: path.join(tripDir, 'plan.md'),
    link: path.join(tripDir, 'link.md'),
  };

  // Every file here is treated as user-owned once it exists: force only
  // authorizes *entering* an existing trip folder (bypassing the guard
  // above) to fill in whatever's missing. It never overwrites a file that's
  // already there — theme.css and dm.html included — so re-running the
  // scaffold can't wipe out an already-authored page or a hand-picked theme.
  if (!fs.existsSync(files.theme)) {
    fs.copyFileSync(themeTemplatePath, files.theme);
  }
  if (!fs.existsSync(files.dm)) {
    fs.writeFileSync(files.dm, dmHtmlSkeleton(destination));
  }
  if (!fs.existsSync(files.plan)) {
    fs.writeFileSync(files.plan, '');
  }
  if (!fs.existsSync(files.link)) {
    fs.writeFileSync(files.link, '# 參考連結\n');
  }

  return { tripDir, files };
}

function main() {
  const [destination, yyyymm, ...rest] = process.argv.slice(2);
  const force = rest.includes('--force');

  if (!destination || !yyyymm) {
    console.error('用法：node scaffold.mjs <Destination> <YYYYMM> [--force]');
    process.exitCode = 1;
    return;
  }

  try {
    const { tripDir } = scaffoldTrip({ destination, yyyymm, force });
    console.log(`已建立行程資料夾：${tripDir}`);
  } catch (err) {
    if (err instanceof ScaffoldError) {
      console.error(err.message);
      process.exitCode = 1;
      return;
    }
    throw err;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
