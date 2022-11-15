const puppeteer = require('puppeteer');
const fs = require('fs');


const run = async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.trendyol.com/sr?wc=89,103799&tag=kirmizi_kampanya_urunu,turuncu_kampanya_urunu,sari_kampanya_urunu&bu=100100,100108,100113,100141,100143,100142,100144&sst=BEST_SELLER');

    // 1) taking screenshot
    // await page.screenshot({ path: 'example.png', fullPage: true });

    // 2) getting page as pdf
    // await page.pdf({ path: 'example.pdf', format: 'A4' });

    // 3) getting page as html and saving it to a file
    // const html = await page.content();

    // //save as html file
    // fs.writeFile('example.html', html, (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log('File written to...');
    // });

    // 4) getting title 
    // const title = await page.title();
    // console.log(title);

    // 5) getting inner text of body
    // const text = await page.evaluate(() => document.body.innerText);
    // console.log(text);

    // 6) getting links
    // const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), a => a.href));
    // console.log(links);


    // 7) getting product names,links, prices and image urls . Then saving them to a file
    const products = await page.evaluate(() => {
        const products = Array.from(document.querySelectorAll('.p-card-wrppr'));
        return products.map(product => {
            const name = product.querySelector('.prdct-desc-cntnr').innerText;
            const link = product.querySelector('a').href;

            //rating: from ".star-w .full" style="width: 100%" to 5
            let stars = Array.from(product.querySelectorAll('.star-w .full'));
            let result = 0;
            stars.forEach(star => {
                let width = star.style.width;
                result += parseInt(width);
            });
            result = result / 100;

            let ratingCount = product.querySelector('.ratingCount').innerText;
            //remove parentheses from ratingCount
            ratingCount = ratingCount.replace(/[()]/g, '');

            const imageUrl = product.querySelector('img').src;
            const price = product.querySelector('.product-price').innerText;
            return { name, price, star: result, ratingCount, link, imageUrl };
        });
    });

    //save as json file
    fs.writeFile('products.json', JSON.stringify(products), (err) => {
        if (err) {
            console.log(err);
        }
        console.log('File written to...');
    });
    await browser.close();

};

run();