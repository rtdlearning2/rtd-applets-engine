const puppeteer = require('puppeteer');

(async () => {
  const url = 'http://localhost:5176/activity/index.html?src=/engine/config/golden.json';
  console.log('Opening', url);
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the SVG graph to be present
  await page.waitForSelector('#graphSvg');

  // Helper: click at a graph coordinate (graphX, graphY) by computing pixel coordinates
  async function clickGraph(graphX, graphY, offset = {x:0,y:0}) {
    await page.evaluate((gx, gy, off) => {
      const svg = document.getElementById('graphSvg');
      const rect = svg.getBoundingClientRect();

      // Read view bounds from global state if available
      // The app attaches state to window._appState for debugging in some setups; fallback to attributes on svg
      const state = window.state ?? window._appState ?? null;
      let xmin = -6, xmax = 6, ymin = -6, ymax = 6;
      if (state && state.view) {
        xmin = state.view.xmin; xmax = state.view.xmax; ymin = state.view.ymin; ymax = state.view.ymax;
      } else if (svg.dataset && svg.dataset.xmin) {
        xmin = +svg.dataset.xmin; xmax = +svg.dataset.xmax; ymin = +svg.dataset.ymin; ymax = +svg.dataset.ymax;
      }

      const width = rect.width; const height = rect.height;

      const px = rect.left + ((gx - xmin) / (xmax - xmin)) * width + off.x;
      const py = rect.top + ((ymax - gy) / (ymax - ymin)) * height + off.y;

      // synthesize a pointer event at client coords (px, py)
      const evt = new PointerEvent('pointerdown', {
        clientX: px,
        clientY: py,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse'
      });

      // Dispatch on the top-level document so our attachGraphInteraction listener sees it
      document.dispatchEvent(evt);
    }, graphX, graphY, offset);

    // Give the app a moment to update the DOM
    await page.waitForTimeout(150);
  }

  // Utility to count student points in SVG
  async function countStudentPoints() {
    return page.evaluate(() => {
      const svg = document.getElementById('graphSvg');
      if (!svg) return 0;
      return svg.querySelectorAll('.student-point').length;
    });
  }

  // Start: ensure zero student points
  let initial = await countStudentPoints();
  console.log('Initial student points:', initial);

  // 1) Click exactly on the first expected vertex (-5,-3) (from golden.json)
  await clickGraph(-5, -3);
  let after1 = await countStudentPoints();
  console.log('After clicking -5,-3 =>', after1);
  if (after1 !== initial + 1) {
    console.error('Expected +1 student point after exact click');
    await browser.close();
    process.exit(2);
  }

  // 2) Click slightly offset but within hitRadius (5px offset)
  await clickGraph(-1, -1, {x:5, y:3});
  let after2 = await countStudentPoints();
  console.log('After clicking near -1,-1 =>', after2);
  if (after2 !== after1 + 1) {
    console.error('Expected +1 student point after near click');
    await browser.close();
    process.exit(3);
  }

  // 3) Click far away (center of graph) that should be outside hitRadius and ignored
  await clickGraph(2, 2, {x:200, y:200});
  let after3 = await countStudentPoints();
  console.log('After clicking far away (should be ignored) =>', after3);
  if (after3 !== after2) {
    console.error('Expected no change after far click');
    await browser.close();
    process.exit(4);
  }

  // 4) Click duplicate on first vertex (-5,-3) should be ignored
  await clickGraph(-5, -3);
  let after4 = await countStudentPoints();
  console.log('After duplicate click -5,-3 =>', after4);
  if (after4 !== after3) {
    console.error('Duplicate click should not add a new point');
    await browser.close();
    process.exit(5);
  }

  console.log('All interaction checks passed');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
