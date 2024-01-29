import fs from 'fs';
import { exec } from 'child_process';
import { testCases } from '../test-cases/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { runnerTwoSum } from '../test-cases/two-sum.js';

const taskQueue = [];

// Function to execute user code
async function executeUserCode(params, res) {
  const { userCode, type, id } = params;
  const runnerFunction = testCases[id];
  // const sanitizedCode = validateAndSanitizeCode(userCode);
  const functionName = 'twoSum';
  // Validate and sanitize user input here
  // Be extremely careful when executing user code

  // Prepare the code file
  const codeFile = 'user_code.js';

  // Write the code and test cases to the files
  const fullCode = `
    import { runnerTwoSum } from './src/test-cases/${id}.js';
    ${userCode}
    try {
      const userFunctionParams = ${functionName}; 
      const output = runnerTwoSum(userFunctionParams);
      console.log(JSON.stringify(output));
    } catch (error) {
      console.error(JSON.stringify({ error: error.message }));
    }
  `;

  fs.writeFileSync(codeFile, fullCode);

  // Run the code using a child process
  const command = `node ${codeFile}`;
  exec(command, (error, stdout, stderr) => {
    // fs.unlinkSync(codeFile);
    if (stderr) {
      res.status(404).json({ error: stderr });
      console.log('lubbed');
    } else {
      res.status(200).json({ output: JSON.parse(stdout.trim()) });
    }
  });
}

const handleCompileProblrm = asyncHandler(async (req, res) => {
  const { userCode, type, id } = req.body;

  // Get the runner function based on question ID
  const runnerFunction = testCases[id];

  // Add the task to the queue
  taskQueue.push(() =>
    executeUserCode({ userCode, type, id }, res, runnerFunction)
  );

  // If the queue is not running, start it
  if (taskQueue.length === 1) {
    runTaskQueue();
  }
});

// Function to run the task queue
async function runTaskQueue() {
  while (taskQueue.length > 0) {
    const task = taskQueue[0];
    await task(); // Execute the task
    taskQueue.shift(); // Remove the task from the queue
  }
}

export { handleCompileProblrm };
