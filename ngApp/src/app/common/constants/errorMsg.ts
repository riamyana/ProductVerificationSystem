export class ErrorMsg {
  static readonly noPublicAddressErrorMsg = `Public Address Not Found..!
  Please register :)`;

  static readonly publicAddressExistsErrorMsg = `Public Address already exists..!
  Please login :)`;

  static readonly registerSuccessMsg = `Registered Successfully..! :)`;

  static readonly somethingWentWrongErrorMsg = `Something went wrong..! Please try again later..!`;

  static addNewProductMsg(type: string) {
    return (type == 'success') ? "New Product Added Successfully..! :)" : "Something went wrong in adding New Product..! Please try again later..! :("
  }

  static changeOwnerMsg(type: string) {
    return (type == 'success') ? "Owner changed Successfully..! :)" : "Something went wrong in changing owner..! Please try again later..! :("
  }
}
