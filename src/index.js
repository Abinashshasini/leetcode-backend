import dotenv from 'dotenv';
import handleConnectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
  path: './env',
});

handleConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 5050, () => {
      console.log(
        `Server is running at port : http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('MongodB connecting faild', error);
  });

// import express from 'express';
// import bodyParser from 'body-parser';
// import { exec } from 'child_process';
// import cors from 'cors';
// import fs from 'fs';
// const app = express();
// const port = 5050;

// app.use(cors());
// app.use(bodyParser.json());

// Task Queue
// const taskQueue = [];

// // Function to execute user code
// async function executeUserCode(code, res) {
//   // Validate and sanitize user input here
//   // Be extremely careful when executing user code

//   // Prepare the code file
//   const codeFile = 'user_code.js';

//   // Creating a temporary test file
//   const testFile = 'test_cases.js';

//   // Write the code and test cases to the files
//   const fullCode = `
//     ${code}

//     // Ensure twoSum function is defined
//     if (typeof twoSum === 'function') {
//       // Test Cases
//       const testCase1 = twoSum([2, 7, 11, 15], 9);
//       const testCase2 = twoSum([3, 2, 4], 6);
//       const testCase3 = twoSum([3, 3], 6);

//       console.log("Test Case 1: ", JSON.stringify(testCase1) === JSON.stringify([0, 1]) ? "Passed" : createTestResult([0, 1], testCase1));
//       console.log("Test Case 2: ", JSON.stringify(testCase2) === JSON.stringify([1, 2]) ? "Passed" : createTestResult([1, 2], testCase2));
//       console.log("Test Case 3: ", JSON.stringify(testCase3) === JSON.stringify([0, 1]) ? "Passed" : createTestResult([0, 1], testCase3));
//     } else {
//       console.log("Error: twoSum function is not defined");
//     }
//   `;

//   fs.writeFileSync(codeFile, fullCode);

//   // Run the code using a child process
//   const command = `node ${codeFile}`;
//   exec(command, (error, stdout, stderr) => {
//     // Clean up the temporary files
//     fs.unlinkSync(codeFile);

//     if (error) {
//       res.status(500).json({ error: stderr });
//     } else {
//       // Parse the output to determine test results
//       const outputLines = stdout.split('\n');
//       const testResults = [];

//       outputLines.forEach((line) => {
//         if (line.includes('Test Case')) {
//           const testCaseNumber = line.match(/\d+/)[0];
//           const testResult = line.includes('Passed')
//             ? 'Passed'
//             : parseTestResult(line);

//           testResults.push({ testCaseNumber, testResult });
//         }
//       });

//       // Check if any test case is marked as 'undefined', indicating an issue with user code
//       const hasUndefinedTest = testResults.some(
//         (result) => result.testResult === 'undefined'
//       );

//       res.status(200).json({
//         output: stdout,
//         testResults: hasUndefinedTest
//           ? 'All test cases failed (check your code)'
//           : testResults,
//       });
//     }
//   });
// }

// // Function to parse the test result string
// function parseTestResult(line) {
//   try {
//     const jsonString = line.slice(line.indexOf('{'));
//     return JSON.parse(jsonString);
//   } catch (error) {
//     return 'undefined';
//   }
// }

// // Function to create a detailed test result
// function createTestResult(expected, actual) {
//   return { expected, actual: actual !== undefined ? actual : 'undefined' };
// }

// // Middleware to handle the user code execution
// app.post('/twosum', async (req, res) => {
//   const { code } = req.body;

//   // Add the task to the queue
//   taskQueue.push(() => executeUserCode(code, res));

//   // If the queue is not running, start it
//   if (taskQueue.length === 1) {
//     runTaskQueue();
//   }
// });

// // Function to run the task queue
// async function runTaskQueue() {
//   while (taskQueue.length > 0) {
//     const task = taskQueue[0];
//     await task(); // Execute the task
//     taskQueue.shift(); // Remove the task from the queue
//   }
// }
