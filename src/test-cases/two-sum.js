const runnerTwoSum = (requestFunction) => {
  let passedTestCases = [];
  let failedTestCases = [];
  try {
    const nums = [
      [2, 7, 11, 15],
      [3, 2, 4],
      [3, 3],
    ];

    const targets = [9, 6, 6];
    const answers = [
      [0, 1],
      [1, 2],
      [0, 1],
    ];

    for (let i = 0; i < nums.length; i++) {
      const result = requestFunction(nums[i], targets[i]);
      if (JSON.stringify(result) === JSON.stringify(answers[i])) {
        passedTestCases.push({
          testCase: i + 1,
          status: 'success',
          output: result,
        });
      } else {
        failedTestCases.push({
          testCase: i + 1,
          status: 'failed',
          output: result,
        });
      }
    }
    return { passedTestCases, failedTestCases };
  } catch (error) {
    console.error(error);
  }
};

export { runnerTwoSum };
