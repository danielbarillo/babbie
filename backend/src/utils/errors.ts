export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleControllerError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }

  return {
    statusCode: 500,
    message: 'An unexpected error occurred'
  };
};