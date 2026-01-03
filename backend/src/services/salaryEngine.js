/**
 * Calculates the salary structure based on a fixed Gross Wage.
 * Logic derived from wireframe requirements:
 * - Basic: 50% of Wage
 * - HRA: 50% of Basic
 * - Standard Allowance: Fixed 4167
 * - Performance Bonus: 8.33% of Basic
 * - LTA: 8.33% of Basic
 * - Fixed Allowance: Balancing component (Wage - sum of above)
 * - PF: 12% of Basic
 * - PT: Fixed 200
 */
const calculateSalaryStructure = (grossWage) => {
    // Ensure wage is a number
    const wage = parseFloat(grossWage);
    if (isNaN(wage) || wage <= 0) {
        throw new Error('Invalid wage amount. Wage must be a positive number.');
    }

    // --- Earnings Calculation ---

    // 1. Basic = 50% of Wage
    const basic = wage * 0.50;

    // 2. HRA = 50% of Basic
    const hra = basic * 0.50;

    // 3. Standard Allowance = Fixed 4167
    const standardAllowance = 4167;

    // 4. Performance Bonus = 8.33% of Basic
    const performanceBonus = basic * 0.0833;

    // 5. Leave Travel Allowance (LTA) = 8.33% of Basic
    const lta = basic * 0.0833;

    // 6. Fixed Allowance (Balancing Figure)
    // Formula: Wage - (Basic + HRA + Std Allow + Bonus + LTA)
    const totalAllocated = basic + hra + standardAllowance + performanceBonus + lta;
    let fixedAllowance = wage - totalAllocated;

    // Handle edge case where wage is too low to cover fixed components
    if (fixedAllowance < 0) {
        fixedAllowance = 0;
        // In a real strict system, you might throw an error here:
        // throw new Error('Wage is too low to cover defined standard components.');
    }

    // --- Deductions Calculation ---

    // 1. Provident Fund (PF) = 12% of Basic
    const pf = basic * 0.12;

    // 2. Professional Tax (PT) = Fixed 200
    const professionalTax = 200;

    const totalDeductions = pf + professionalTax;

    // --- Net Pay Calculation ---
    const netSalary = wage - totalDeductions;

    return {
        grossWage: parseFloat(wage.toFixed(2)),
        components: {
            basic: parseFloat(basic.toFixed(2)),
            hra: parseFloat(hra.toFixed(2)),
            standardAllowance: parseFloat(standardAllowance.toFixed(2)),
            performanceBonus: parseFloat(performanceBonus.toFixed(2)),
            lta: parseFloat(lta.toFixed(2)),
            fixedAllowance: parseFloat(fixedAllowance.toFixed(2))
        },
        deductions: {
            pf: parseFloat(pf.toFixed(2)),
            professionalTax: parseFloat(professionalTax.toFixed(2)),
            totalDeductions: parseFloat(totalDeductions.toFixed(2))
        },
        netSalary: parseFloat(netSalary.toFixed(2))
    };
};

module.exports = {
    calculateSalaryStructure
};