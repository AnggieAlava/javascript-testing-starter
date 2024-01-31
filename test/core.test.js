import { it, expect, describe } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  validateUserInput,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });
  it("should return an array with valid coupon codes", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });
  it("should return an array with valid discounts", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });
  it("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });
  it("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });
  it("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });
  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("should return success if given valid input", () => {
    expect(validateUserInput("anggie", 28)).toMatch(/success/i);
  });
  it("should return an error if username is not a string", () => {
    expect(validateUserInput(1, 28)).toMatch(/invalid/i);
  });
  it("should return an error if username is less than 3 characters", () => {
    expect(validateUserInput("mo", 28)).toMatch(/invalid/i);
  });
  it("should return an error if username is longer than 255 characters", () => {
    expect(validateUserInput("A".repeat(256), 28)).toMatch(/invalid/i);
  });
  it("should return an error if age is not a number", () => {
    expect(validateUserInput("anggie", "28")).toMatch(/invalid/i);
  });
  it("should return an error if age is less than 18", () => {
    expect(validateUserInput("anggie", 17)).toMatch(/invalid/i);
  });
  it("should return an error if age is greater than 100", () => {
    expect(validateUserInput("anggie", 101)).toMatch(/invalid/i);
  });
  it("should return an error if both username and age are invalid", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it("should return false when the price is outside the range", () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });
  it("should return true when the price is equal to the min or to the max", () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });
  it("should return true when the price is within the range", () => {
    expect(isPriceInRange(50, 0, 100)).toBe(true);
  });
});

describe("canDrive", () => {
  it("should return false when the age is below the legal driving age", () => {
    expect(canDrive(15, "US")).toBe(false);
    expect(canDrive(16, "UK")).toBe(false);
  });
  it("should return true when the age is equal to the legal driving age", () => {
    expect(canDrive(16, "US")).toBe(true);
    expect(canDrive(17, "UK")).toBe(true);
  });
  it("should return true when the age is above the legal driving age", () => {
    expect(canDrive(17, "US")).toBe(true);
    expect(canDrive(18, "UK")).toBe(true);
  });
  it("should return an error when the country code is invalid", () => {
    expect(canDrive(17, "CA")).toMatch(/invalid/i);
  });
});
