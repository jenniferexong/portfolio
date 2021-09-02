import { createStop, linkStops } from "../stop.js";

test("single stop", () => {
  const stop = createStop("a", 0);
  linkStops([stop]);
  expect(stop.next()).toBe(stop);
  expect(stop.previous()).toBe(stop);
  expect(stop.next().next()).toBe(stop);
});

test("link stops", () => {
  const stops = {
    a: createStop("a", 0),
    b: createStop("b", 1),
  };

  expect(stops.a.next()).toBe(undefined);
  expect(stops.a.previous()).toBe(undefined);

  linkStops(Object.values(stops));
  expect(stops.a.next()).toBe(stops.b);
  expect(stops.a.previous()).toBe(stops.b);

  expect(stops.b.next()).toBe(stops.a);
  expect(stops.b.previous()).toBe(stops.a);
});

test("more stops", () => {
  const stops = {
    a: createStop("a", 0),
    b: createStop("b", 1),
    c: createStop("c", 2),
    d: createStop("d", 2),
  };

  linkStops(Object.values(stops));
  expect(stops.a.next().next()).toBe(stops.c);
  expect(stops.d.previous().next()).toBe(stops.d);
  expect(stops.d.next()).toBe(stops.a);
  expect(stops.a.previous()).toBe(stops.d);
  expect(stops.b.previous().previous()).toBe(stops.d);
});
