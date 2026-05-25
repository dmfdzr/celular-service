export type CustomerStatus = "active" | "suspended"
export type CustomerSegment = "Bronze" | "Silver" | "Gold" | "Platinum"
export type TransactionStatus = "processing" | "success" | "failed"
export type OperatorMenu = "dashboard" | "customers" | "transactions" | "data"

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  segment: CustomerSegment
  status: CustomerStatus
  city: string
  monthlySpend: number
}

export type DataPackage = {
  id: string
  name: string
  operator: string
  quota: string
  validity: string
  price: number
  speed: string
  tag: string
  popular: boolean
}

export type Transaction = {
  id: string
  customerId: string
  customerName: string
  msisdn: string
  packageId: string
  packageName: string
  operator: string
  price: number
  status: TransactionStatus
  channel: string
  createdAt: string
}

export type CustomerForm = {
  name: string
  email: string
  phone: string
  city: string
  segment: CustomerSegment
}
