import { db } from "@/core/db";

export type Representative = {
  id: number;
  cityId: number;
  fullName: string;
  email?: string | null;
  mobileNumber?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listAllRepresentatives(): Promise<Representative[]> {
  return db<Representative>("city_representatives").orderBy("cityId").orderBy("fullName");
}

export async function listRepresentativesByCity(cityId: number): Promise<Representative[]> {
  return db<Representative>("city_representatives").where({ cityId }).orderBy("fullName");
}

export async function getRepresentativeById(id: number): Promise<Representative | undefined> {
  return db<Representative>("city_representatives").where({ id }).first();
}

export async function createRepresentative(data: Partial<Representative>) {
  const [id] = await db("city_representatives").insert(data);
  return getRepresentativeById(id);
}

export async function updateRepresentative(id: number, data: Partial<Representative>) {
  await db("city_representatives").where({ id }).update({ ...data, updatedAt: db.fn.now() });
  return getRepresentativeById(id);
}

export async function deleteRepresentative(id: number) {
  return db("city_representatives").where({ id }).delete();
}