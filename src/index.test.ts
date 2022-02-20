import hoursToMilliseconds from "date-fns/hoursToMilliseconds";
import minutesToMilliseconds from "date-fns/minutesToMilliseconds";
import { main } from ".";

function daysToMilliseconds(days: number): number {
  return days * 86400000;
}

function monthsToApproximateMilliseconds(months: number): number {
  return months * 2629800000;
}

describe("onBlur", () => {
  describe.each([
    { elapsed: 1, expected: "1 minute" },
    { elapsed: 2, expected: "2 minutes" },
    { elapsed: 44, expected: "44 minutes" },
    { elapsed: 45, expected: "about 1 hour" },
  ])("after $elapsed minute(s)", ({ elapsed, expected }) => {
    let cleanup: ReturnType<typeof main>;

    beforeEach(() => {
      jest.useFakeTimers();
      cleanup = main();
      window.dispatchEvent(new FocusEvent("blur"));
      jest.advanceTimersByTime(minutesToMilliseconds(elapsed));
    });

    afterEach(() => {
      window.dispatchEvent(new FocusEvent("focus"));
      cleanup();
      jest.useRealTimers();
    });

    it(`should report last visited to be ${expected} ago in the document title`, () => {
      expect(window.document.title).toEqual(`(Last visited: ${expected} ago)`);
    });
  });

  describe.each([
    { elapsed: 1, expected: "about 1 hour" },
    { elapsed: 2, expected: "about 2 hours" },
    { elapsed: 23, expected: "about 23 hours" },
    { elapsed: 24, expected: "1 day" },
  ])("after $elapsed hour(s)", ({ elapsed, expected }) => {
    let cleanup: ReturnType<typeof main>;

    beforeEach(() => {
      jest.useFakeTimers();
      cleanup = main();
      window.dispatchEvent(new FocusEvent("blur"));
      jest.advanceTimersByTime(hoursToMilliseconds(elapsed));
    });

    afterEach(() => {
      window.dispatchEvent(new FocusEvent("focus"));
      cleanup();
      jest.useRealTimers();
    });

    it(`should report last visited to be ${expected} ago in the document title`, () => {
      expect(window.document.title).toEqual(`(Last visited: ${expected} ago)`);
    });
  });

  describe.each([
    { elapsed: 2, expected: "2 days" },
    { elapsed: 29, expected: "29 days" },
    { elapsed: 30, expected: "about 1 month" },
    { elapsed: 31, expected: "about 1 month" },
  ])("after $elapsed days", ({ elapsed, expected }) => {
    let cleanup: ReturnType<typeof main>;

    beforeEach(() => {
      jest.useFakeTimers();
      cleanup = main();
      window.dispatchEvent(new FocusEvent("blur"));
      jest.advanceTimersByTime(daysToMilliseconds(elapsed));
    });

    afterEach(() => {
      window.dispatchEvent(new FocusEvent("focus"));
      cleanup();
      jest.useRealTimers();
    });

    it(`should report last visited to be ${expected} ago in the document title`, () => {
      expect(window.document.title).toEqual(`(Last visited: ${expected} ago)`);
    });
  });

  describe.each([
    { elapsed: 2, expected: "2 months" },
    { elapsed: 11.9, expected: "12 months" },
    { elapsed: 12, expected: "about 1 year" },
    { elapsed: 14.9, expected: "about 1 year" },
    { elapsed: 15, expected: "over 1 year" },
    { elapsed: 20.9, expected: "over 1 year" },
    { elapsed: 21, expected: "almost 2 years" },
    { elapsed: 23, expected: "almost 2 years" },
    { elapsed: 24, expected: "about 2 years" },
  ])("after $elapsed months", ({ elapsed, expected }) => {
    let cleanup: ReturnType<typeof main>;

    beforeEach(() => {
      jest.useFakeTimers();
      cleanup = main();
      window.dispatchEvent(new FocusEvent("blur"));
      jest.advanceTimersByTime(monthsToApproximateMilliseconds(elapsed));
    });

    afterEach(() => {
      window.dispatchEvent(new FocusEvent("focus"));
      cleanup();
      jest.useRealTimers();
    });

    it(`should report last visited to be ${expected} ago in the document title`, () => {
      expect(window.document.title).toEqual(`(Last visited: ${expected} ago)`);
    });
  });
});

describe("onFocus", () => {
  const mockTitle = "Original title";
  let cleanup: ReturnType<typeof main>;

  beforeEach(() => {
    jest.useFakeTimers();
    window.document.title = mockTitle;
    cleanup = main();
    window.dispatchEvent(new FocusEvent("blur"));
    jest.advanceTimersByTime(minutesToMilliseconds(1));
    window.dispatchEvent(new Event("focus"));
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("should set the document title to the original title", () => {
    expect(window.document.title).toEqual(mockTitle);
  });
});
