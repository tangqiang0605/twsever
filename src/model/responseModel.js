// 服务器响应模型（规范化）
class BaseModel {
  constructor(code, data, message) {
    this.status = code;
    this.data = data;
    this.message = message;
  }
}

class SuccessModel extends BaseModel {
  constructor(status=200,data, message) {
    super(status,data, message);
  }
}

class ErrorModel extends BaseModel {
  constructor(status=404,data, message) {
    super(status,data, message);
  }
}

module.exports = { SuccessModel, ErrorModel };
