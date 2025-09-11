class CustomError extends Error {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;

  constructor({
    type,
    title,
    detail,
    instance,
    status,
  }: {
    type: string;
    title: string;
    detail: string;
    instance: string;
    status: number;
  }) {
    super();
    this.type = type;
    this.title = title;
    this.detail = detail;
    this.instance = instance;
    this.status = status;
  }
}

export default CustomError;
