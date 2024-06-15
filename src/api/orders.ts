import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../utills/firebaseConfig";

export const getOrdersByCustomerId = async (customerId: string) => {
  const ordersCollectionRef = collection(db, "orders");
  const q = query(ordersCollectionRef, where("customerId", "==", customerId));
  const querySnapshot = await getDocs(q);

  const orders: any = [];
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });

  return orders;
};

export const getOrdersByShopUserId = async (shopUserId: string) => {
  const ordersCollectionRef = collection(db, "orders");
  const q = query(ordersCollectionRef, where("shopUserId", "==", shopUserId));
  const querySnapshot = await getDocs(q);

  const orders: any = [];
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });

  return orders;
};
