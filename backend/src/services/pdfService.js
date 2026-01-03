const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

const generateSalarySlip = async (data, filename) => {
    try {
        const templatePath = path.join(__dirname, '../../templates/pdf/salarySlip.hbs');
        const templateHtml = await fs.readFile(templatePath, 'utf-8');
        
        const template = handlebars.compile(templateHtml);
        const html = template(data);

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        const exportPath = path.join(__dirname, '../../public/exports', filename);
        
        await page.pdf({
            path: exportPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        return exportPath;

    } catch (error) {
        throw new Error('PDF Generation Failed: ' + error.message);
    }
};

module.exports = {
    generateSalarySlip
};