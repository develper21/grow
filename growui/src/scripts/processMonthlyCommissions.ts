import { processMonthlyCommissions } from '@/utils/commissionCalculator';
import dbConnect from '@/utils/db';

/**
 * Cron job script to process monthly commission calculations
 * Should be run on the 1st of each month at 12:01 AM
 */

async function runMonthlyCommissionProcess() {
  try {
    console.log('Starting monthly commission processing...');
    await dbConnect();

    const result = await processMonthlyCommissions();

    console.log('Monthly commission processing completed:', result);

    if (result.success) {
      console.log(`✅ Successfully processed ${result.recordsCreated} commission records`);
    } else {
      console.log('❌ Commission processing failed');
    }

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('❌ Error in monthly commission processing:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMonthlyCommissionProcess();
}

export { runMonthlyCommissionProcess };
