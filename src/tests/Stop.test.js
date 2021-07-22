import CreateStop from "../Stop.js";
import { linkStops } from "../Stop.js";

test("single stop", () => {
  const stop = CreateStop("a", 0);
  linkStops([stop]);
  expect(stop.next()).toBe(stop);
  expect(stop.previous()).toBe(stop);
  expect(stop.next().next()).toBe(stop);
});

test("link stops", () => {
  const stops = {
    a: CreateStop("a", 0),
    b: CreateStop("b", 1),
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
    a: CreateStop("a", 0),
    b: CreateStop("b", 1),
    c: CreateStop("c", 2),
    d: CreateStop("d", 2),
  };

  linkStops(Object.values(stops));
  expect(stops.a.next().next()).toBe(stops.c);
  expect(stops.d.previous().next()).toBe(stops.d);
  expect(stops.d.next()).toBe(stops.a);
  expect(stops.a.previous()).toBe(stops.d);
  expect(stops.b.previous().previous()).toBe(stops.d);
});
