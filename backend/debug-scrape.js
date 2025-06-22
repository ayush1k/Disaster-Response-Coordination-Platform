import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugScrape() {
  try {
    const response = await axios.get('https://www.nasa.gov/news/all-news/');
    const $ = cheerio.load(response.data);

    // Dump the first 3 .item blocks to inspect structure
    const items = $('.item_list .item');
    console.log(`Found ${items.length} items`);

    items.slice(0, 3).each((i, el) => {
      console.log(`\n--- Item ${i + 1} ---`);
      console.log($(el).html()); // Raw HTML for inspection
    });
  } catch (error) {
    console.error('❌ Error during debug:', error.message);
  }
}

debugScrape();
