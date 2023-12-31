import fs from 'fs';
import got from 'got';
import url from 'url';
import path from 'path';

import fs from 'fs';
import got from 'got';
import url from 'url';
import path from 'path';

export const genRemoteIcon = async (siteUrl) => {
    try {
        const { protocol, host } = url.parse(siteUrl);
        const iconPath = path.join('/data/public/stageIcons', `${host}.ico`);

        // Check if the icon already exists locally
        if (fs.existsSync(iconPath)) {
            return iconPath.replace('/data','');
        }

        const faviconUrl = `${protocol}//${host}/favicon.ico`;
        const response = await got(faviconUrl, { responseType: 'buffer' });

        if (response.statusCode === 200) {
            fs.writeFile(iconPath, response.body, (err) => {
                if (err) {
                    console.error(`Failed to write icon to ${iconPath}: ${err.message}`);
                }
            });
            return faviconUrl;
        } else {
            throw new Error('Icon not found');
        }
    } catch (error) {
        console.error(`Failed to fetch icon from ${siteUrl}: ${error.message}`);
        return null; // Replace with your default icon URL
    }
};