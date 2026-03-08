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

// Sentinal Thoughts......
const fs = require('fs-extra').promises;
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

// Constants for better maintainability
const TEMPLATE_DIR = path.join(__dirname, '../../templates/pdf');
const EXPORT_DIR = path.join(__dirname, '../../public/exports');
const PDF_OPTIONS = {
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
};

// Cache compiled templates for better performance
const templateCache = new Map();

/**
 * Get or compile Handlebars template with caching
 */
async function getTemplate(templateName) {
    if (templateCache.has(templateName)) {
        return templateCache.get(templateName);
    }

    const templatePath = path.join(TEMPLATE_DIR, `${templateName}.hbs`);
    const templateHtml = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);
    
    templateCache.set(templateName, template);
    return template;
}

/**
 * Ensure export directory exists
 */
async function ensureExportDir() {
    await fs.mkdir(EXPORT_DIR, { recursive: true });
}

/**
 * Generate PDF from template and data
 */
async function generatePDF(templateName, data, filename) {
    try {
        await ensureExportDir();
        
        const template = await getTemplate(templateName);
        const html = template(data);
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            
            const exportPath = path.join(EXPORT_DIR, filename);
            await page.pdf({ ...PDF_OPTIONS, path: exportPath });
            
            return exportPath;
        } finally {
            await browser.close();
        }
        
    } catch (error) {
        // Log the error for debugging
        console.error(`PDF generation failed for ${templateName}:`, error);
        throw new Error(`PDF Generation Failed: ${error.message}`);
    }
}

/**
 * Specific function for salary slip generation
 */
async function generateSalarySlip(data, filename) {
    return generatePDF('salarySlip', data, filename);
}

module.exports = {
    generateSalarySlip,
    generatePDF // Export generic function for reusability
};
