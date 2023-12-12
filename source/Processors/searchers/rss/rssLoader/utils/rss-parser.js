import _config from '../config.js'
const config = _config.value;
import Parser from '../rss-parser.js';

const parser = new Parser({
    customFields: {
        item: ['magnet'],
    },
    headers: {
        'User-Agent': config.ua,
    },
});

export default parser;
