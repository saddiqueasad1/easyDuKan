// types.ts
export interface Message {
  messageId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Participant {
  chatPartnerID: string;
  userName: string;
  userId: string;
}

export interface IUser {
  id: string;
  name: string;
  avatar: string;
}
interface QuickReplies {
  type: "radio" | "checkbox";
  values: Reply[];
  keepIt?: boolean;
}
interface Reply {
  title: string;
  value: string;
  messageId?: any;
}
export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: IUser;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

export interface Category {
  id: string;
  name: string;
}

export interface IProfile {
  username: string;
  phoneNumber: string;
  email: string;
  address: string;
  userId?: string;
  emailVerified?: boolean;
  photoURL?: string;
  branchIds: string[];
  branchName?: string;
}

export interface IProduct {
  category_id?: string;
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  totalQuantity: number;
  purchasePrice: number;
}

export interface IItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  purchasePrice: number;
}

export interface IBill {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  totalAmount: number;
  totalQuantity: number;
  status: string;
  items: IItem[];
}
