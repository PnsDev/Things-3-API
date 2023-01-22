const dns = require('dns');


export async function checkInternet() : Promise<boolean> {
    return await new Promise(function (resolve) {
        dns.lookup('google.com', (err: any) => {
            if (err && err.code == "ENOTFOUND") resolve(false);
            else resolve(true);
        })
    });
}