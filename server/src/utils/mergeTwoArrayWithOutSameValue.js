function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = function mergeArrays(arr1, arr2) {
  // Create a new array to hold the merged elements
  const suffule = shuffleArray(arr1);
  const merged = [...arr2];

  suffule.forEach((item2) => {
    const index = merged.findIndex((item1) => item1.sku === item2.sku);
    if (index === -1) {
      merged.push(item2);
    } else {
      merged[index] = item2;
    }
  });

  return merged;
};
