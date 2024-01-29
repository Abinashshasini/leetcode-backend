
    import { runnerTwoSum } from './src/test-cases/two-sum.js';
    /**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for( i = 0; i < nums.length; i++) {
        for(let j = i + 1; j < nums.length; j++) {
            if(nums[i] + nums[j] === target) {
                return [j, i]
            }
        }
    }
    return []
};
    try {
      const userFunctionParams = twoSum; 
      const output = runnerTwoSum(userFunctionParams);
      console.log(JSON.stringify(output));
    } catch (error) {
      console.error(JSON.stringify({ error: error.message }));
    }
  