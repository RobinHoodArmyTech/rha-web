import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { CITY_ADMIN_ROLES } from "@/core/config/constants";
import { listCities } from "@/core/services/backend/city/cityService";
import CitiesClient from "./CitiesClient";

export const metadata = { title: "City Management" };

export default async function CitiesPage() {
  const session = await getSession();
  if (!session || !CITY_ADMIN_ROLES.includes(session.roleName)) {
    redirect("/sites/admin");
  }

  const cities = await listCities();

  return (
    <CitiesClient initialCities={cities} />
  );
}
