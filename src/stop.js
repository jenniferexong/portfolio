export const createStop = (name, location) => {
  let next, previous;

  return {
    name,
    location,
    next,
    previous,
  };
};

// link stops into a circular structure
export function linkStops(stopsArray) {
  for (let i = 0; i < stopsArray.length; i++) {
    // link first and last stops
    let p = i == 0 ? stopsArray.length - 1 : i - 1;
    let n = i == stopsArray.length - 1 ? 0 : i + 1;
    stopsArray[i].previous = stopsArray[p];
    stopsArray[i].next = stopsArray[n];
  }
}
