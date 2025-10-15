import { processMonthlyCommissions } from '../utils/commissionCalculator';
import dbConnect from '../utils/db';

async function runMonthlyCommissionProcess() {
  try {
    console.log('Starting monthly commission processing...');
    await dbConnect();

    const result = await processMonthlyCommissions();

    console.log('Monthly commission processing completed:', result);

    if (result?.success) {
      console.log(`Successfully processed ${result.recordsCreated} commission records`);
    } else {
      console.log('Commission processing failed');
    }

    process.exit(result?.success ? 0 : 1);
  } catch (error) {
    console.error('Error in monthly commission processing:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runMonthlyCommissionProcess();
}

export { runMonthlyCommissionProcess };
