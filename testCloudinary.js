const cloudinary = require('cloudinary').v2;

const apiKey = '616629641948748';
const apiSecret = 'ntVY29mm9RCsfGWFSnDB1VtrId4';

const candidateNames = [
    'dmeoz1vpw',
    'legne',
    'arak-dental-laboratory',
    'arakdentallab',
    'legend-lab',
    'arak',
    'araklab82',
    'arakdb'
];

async function checkCloudNames() {
    for (const name of candidateNames) {
        console.log(`Checking cloud name: ${name}...`);
        cloudinary.config({
            cloud_name: name,
            api_key: apiKey,
            api_secret: apiSecret
        });
        try {
            // Ping the Cloudinary API
            const result = await cloudinary.api.ping();
            console.log(`SUCCESS! Cloud name "${name}" is valid! Result:`, result);
            return name;
        } catch (err) {
            console.log(`Failed for "${name}":`, err);
        }
    }
    console.log('None of the candidate cloud names were successful.');
    return null;
}

checkCloudNames();
