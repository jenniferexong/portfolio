const CreateStop = (name, location) => {
  const name_ = name;
  const location_ = location;
  let next_, previous_;

  return {
    name: () => name_,
    location: () => location_,
    next: () => next_,
    previous: () => previous_,
    setNext: (next) => (next_ = next),
    setPrevious: (previous) => (previous_ = previous),
  };
};
export default CreateStop;

// link stops into a circular structure
export function linkStops(stopsArray) {
  for (let i = 0; i < stopsArray.length; i++) {
    // link first and last stops
    let previous = i == 0 ? stopsArray.length - 1 : i - 1;
    let next = i == stopsArray.length - 1 ? 0 : i + 1;
    stopsArray[i].setPrevious(stopsArray[previous]);
    stopsArray[i].setNext(stopsArray[next]);
  }
}
