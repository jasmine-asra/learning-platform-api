import errorHandler from "../src/middlewares/errorHandler";
import ApiError from "../src/utils/apiError";

test("should handle ApiError correctly", () => {
  const req = {} as any;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
  const next = jest.fn();

  const error = new ApiError("Custom Error", 400);
  
  errorHandler(error, req, res, next);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: "Custom Error" });
});