export function phoneNumberToDashSeperated(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
}
