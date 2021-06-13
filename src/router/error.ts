import express from 'express';

export default function errorHandler(
  err: { status: null | number; error: Error } | Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void {
  if (err instanceof Error) {
    console.error(err);
    res.status(500).send({
      message: err.message,
      statusCode: 500,
      error: err.message,
    });
  } else {
    if (!err.status || err.status === 500) {
      console.error(err);
    }
    res.status(err.status || 500).send({
      message: err.error.message,
      statusCode: err.status || 500,
      error: err.error.message,
    });
  }
}
