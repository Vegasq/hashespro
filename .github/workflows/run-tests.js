const puppeteer = require('puppeteer');

async function runTests() {
  console.log('Starting browser to run tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Open a new page
    const page = await browser.newPage();
    
    // Set up console log capture
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.error(`Browser console error: ${text}`);
      } else {
        console.log(`Browser console: ${text}`);
      }
    });
    
    // Navigate to the test page
    console.log('Navigating to test page...');
    await page.goto('http://localhost:8080/test.html', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    // Wait for tests to complete (look for all test summaries)
    console.log('Waiting for tests to complete...');
    await page.waitForFunction(() => {
      const summaries = document.querySelectorAll('.summary');
      // We expect 7 test modules to run (one summary per module)
      return summaries.length >= 7;
    }, { timeout: 30000 });
    
    // Check for test failures
    const testResults = await page.evaluate(() => {
      const summaries = Array.from(document.querySelectorAll('.summary'));
      const results = summaries.map(summary => summary.textContent);
      const errors = Array.from(document.querySelectorAll('.error')).map(error => error.textContent);
      
      return {
        summaries: results,
        errors: errors,
        hasFailures: document.querySelectorAll('.error').length > 0
      };
    });
    
    // Log test summaries
    console.log('\n--- Test Results ---');
    testResults.summaries.forEach(summary => {
      console.log(summary);
    });
    
    // If there are failures, log them and exit with error
    if (testResults.hasFailures) {
      console.error('\n--- Test Failures ---');
      testResults.errors.forEach(error => {
        console.error(error);
      });
      process.exit(1);
    } else {
      console.log('\nAll tests passed successfully!');
    }
    
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  } finally {
    // Close the browser
    await browser.close();
  }
}

runTests();
