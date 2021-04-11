export class ResponseMapper {
  async sendResponse(res, statusCode,data, message, error,httpStatus) {

    let response = {
      data:data,
      message: message,
      statusCode: statusCode,
      error: error
    }
    return res.status(httpStatus).send(response);
  }
}