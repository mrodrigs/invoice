export interface Receiver {
  name: string
  street: string
  city: string
  phone: string
  email: string
}

export interface InvoiceBody {
  company: string
  invoiceNumber: string
  receiver: string
  description: string
  month: string
  amount: string
}
