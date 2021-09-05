import { createTrack } from "../track.js";

// can't use loader because it requires XMLHttpRequest
// which node doesn't support?

//const gltf = await loadGltf("src/res/model/world.glb");

const track = createTrack();

// test track functionality
test("find route (clockwise)", () => {
  // start of track to location 1
  let route = track.calculateRoute(0, 1);
  expect(route.remainingDistance).toBe(1);
  expect(route.direction).toBe(1);

  route = track.calculateRoute(0, track.getStopLoc("aboutMe"));
  expect(route.remainingDistance).toBe(track.getStopLoc("aboutMe"));
  expect(route.direction).toBe(1);
});

test("find route (anticlockwise)", () => {
  let route = track.calculateRoute(0, 9);
  expect(route.remainingDistance).toBe(1);
  expect(route.direction).toBe(-1);

  // last stop to second to last stop
  const loc1 = track.getStopLoc("contact");
  const loc2 = track.getStopLoc("education");
  route = track.calculateRoute(loc1, loc2);
  expect(route.remainingDistance).toBe(loc1 - loc2);
  expect(route.direction).toBe(-1);
});

test("find route (stationary)", () => {
  // start and end location are the same
  let route = track.calculateRoute(5, 5);

  console.log(route);

  expect(route.remainingDistance).toBe(0);
  expect(route.direction).toBe(0);
});
