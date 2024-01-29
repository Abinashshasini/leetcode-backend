// taskQueue.js
import Bull from 'bull';
import { exec } from 'child_process';
import fs from 'fs';

const userCodeQueue = new Bull('userCodeQueue');

async function executeUserCode(code) {
  // Validate and sanitize user input here
  // Be extremely careful when executing user code

  // Prepare the code file
  const codeFile = 'user_code.js';

  // Creating a temporary test file
  const testFile = 'test_cases.js';

  // Write the code and test cases to the files
  const fullCode = `
    ${code}

    // Test Cases
    const testCase1 = twoSum([2, 7, 11, 15], 9);
    const testCase2 = twoSum([3, 2, 4], 6);
    const testCase3 = twoSum([3, 3], 6);

    console.log("Test Case 1: ", JSON.stringify(testCase1) === JSON.stringify([0, 1]));
    console.log("Test Case 2: ", JSON.stringify(testCase2) === JSON.stringify([1, 2]));
    console.log("Test Case 3: ", JSON.stringify(testCase3) === JSON.stringify([0, 1]));
  `;

  fs.writeFileSync(codeFile, fullCode);

  // Run the code using a child process
  const command = `node ${codeFile}`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      // Clean up the temporary files
      fs.unlinkSync(codeFile);

      if (error) {
        reject({ error: stderr });
      } else {
        // Parse the output to determine test results
        const outputLines = stdout.split('\n');
        const passedTestCases = [];
        const failedTestCases = [];

        outputLines.forEach((line) => {
          if (line.includes('Test Case')) {
            const testCaseNumber = line.match(/\d+/)[0];
            const testResult = line.includes('true');
            if (testResult) {
              passedTestCases.push(testCaseNumber);
            } else {
              failedTestCases.push(testCaseNumber);
            }
          }
        });

        resolve({
          output: stdout,
          testResults: {
            passed: passedTestCases,
            failed: failedTestCases,
          },
        });
      }
    });
  });
}

userCodeQueue.process(async (job) => {
  const { code } = job.data;
  return executeUserCode(code);
});

export default userCodeQueue;
