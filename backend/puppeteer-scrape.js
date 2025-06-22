import puppeteer from 'puppeteer';

async function scrapeNASA() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.nasa.gov/news/all-news/', {
    waitUntil: 'networkidle2',
  });

  const updates = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.item_list .item'));
    return items.slice(0, 5).map(item => {
      const titleEl = item.querySelector('.content_title');
      const linkEl = item.querySelector('a');

      const title = titleEl?.innerText?.trim() || '';
      const url = linkEl?.href?.startsWith('http') ? linkEl.href : `https://www.nasa.gov${linkEl?.getAttribute('href')}`;
      
      return title && url ? { title, url } : null;
    }).filter(Boolean);
  });

  console.log('\n✅ Scraped updates:', updates);

  await browser.close();
}

scrapeNASA();
