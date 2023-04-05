const { shuffle } = require('../src/shuffle')

describe('shuffle should...', () => {
    test('have a length of the array argument sent in', () =>{
      const nums = [0, 1, 2, 3, 4, 5]
      expect(shuffle(nums)).toHaveLength(6)
    }),
    test('should return an array', () =>{
      const nums = [0, 1, 2, 3, 4, 5]
      const returnedValue = shuffle(nums)
      expect(returnedValue).toBeInstanceOf(Array)
    })
})