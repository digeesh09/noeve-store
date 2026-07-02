import { apiClient } from './api';

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  streetLine1: string;
  streetLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export async function fetchAddresses(): Promise<Address[]> {
  try {
    const res = await apiClient.store.getAddresses();
    return (res.data || []) as Address[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function addAddress(data: Omit<Address, 'id' | 'userId'>): Promise<Address> {
  const res = await apiClient.store.addAddress(data);
  return res.data as Address;
}

export async function updateAddress(id: string, data: Omit<Address, 'id' | 'userId'>): Promise<Address> {
  const res = await apiClient.store.updateAddress(id, data);
  return res.data as Address;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.store.deleteAddress(id);
}
