import axios from 'axios';
import * as cheerio from 'cheerio';

async function testScrape() {
  try {
    const response = await axios.get('https://www.nasa.gov/news/all-news/');
    const $ = cheerio.load(response.data);

    const updates = [];

    $('.item_list .item').each((i, el) => {
      const title = $(el).find('.content_title').text().trim();
      const url = $(el).find('a').attr('href');

      if (title && url) {
        updates.push({
          title,
          url: url.startsWith('http') ? url : `https://www.nasa.gov${url}`,
        });
      }
    });

    console.log('\n✅ Scraped updates:', updates);
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
  }
}

testScrape();
