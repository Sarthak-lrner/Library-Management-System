class PaymentInforequest {
  constructor(
    public amount: number,
    public currency: string,
    public receiptEmail: string,
  ) {}

}
export default PaymentInforequest;