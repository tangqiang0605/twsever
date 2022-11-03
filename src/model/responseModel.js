// 服务器响应模型（规范化）
class BaseModel {
  constructor(data, message) {
    // data可以没有，但message必须要，只有一个参数时，填的是message
    if (typeof data === 'string') {
      this.message = data;
      data = null;
      message = null;

    }
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = -1;
  }
}

module.exports = { SuccessModel, ErrorModel };
