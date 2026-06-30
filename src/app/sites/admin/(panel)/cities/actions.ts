"use server";

import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { createCity, patchCity } from "@/core/services/backend/city/cityService";
import { CreateCitySchema, PatchCitySchema } from "@/core/validators/cityValidation";
import { db } from "@/core/db";
import { revalidatePath } from "next/cache";

export async function addCityAction(data: z.infer<typeof CreateCitySchema>) {
  try {
    // 1. Resolve the countryName from the database to save it to cities.json
    const country = await db("countries").where("id", data.countryId).first();
    const countryName = country?.countryName || "Unknown";

    // 2. Check for duplicate city name to provide a friendly error
    const existingCity = await db("cities").whereRaw("LOWER(cityName) = LOWER(?)", [data.cityName]).first();
    if (existingCity) {
      return { success: false, error: "A city with this name already exists. Please choose a different name." };
    }

    // 3. Add to database via the service function
    const newCity = await createCity(data);

    // 3. Append to the seed file (cities.json)
    const seedPath = path.join(process.cwd(), "src", "core", "db", "seeds", "data", "cities.json");
    const fileContent = await fs.readFile(seedPath, "utf-8");
    const citiesSeedData = JSON.parse(fileContent);

    // Prepare JSON entry matching the schema in the seed file
    const newSeedEntry = {
      cityName: data.cityName,
      country: countryName,
      cityEmail: data.cityEmail || null,
      foodCadetsLink: data.foodCadetsLink || null,
    };

    citiesSeedData.push(newSeedEntry);

    // Format with 2 spaces to match existing structure
    await fs.writeFile(seedPath, JSON.stringify(citiesSeedData, null, 2), "utf-8");

    // 4. Revalidate the page to update the UI
    revalidatePath("/sites/admin/cities");

    return { success: true, city: newCity };
  } catch (error: any) {
    console.error("Failed to add city:", error);
    return { success: false, error: error?.message || "Failed to add city." };
  }
}

export async function editCityAction(id: number, data: z.infer<typeof PatchCitySchema>) {
  try {
    const updatedCity = await patchCity(id, data);
    
    // Attempt to update cities.json by matching the cityName (best effort since no IDs in json)
    if (updatedCity) {
      try {
        const seedPath = path.join(process.cwd(), "src", "core", "db", "seeds", "data", "cities.json");
        const fileContent = await fs.readFile(seedPath, "utf-8");
        const citiesSeedData = JSON.parse(fileContent);
        
        // Find existing city by the old name if the name changed, or the current name
        const cityIndex = citiesSeedData.findIndex((c: any) => c.cityName === data.cityName || c.cityName === updatedCity.cityName);
        
        if (cityIndex !== -1) {
          citiesSeedData[cityIndex] = {
            ...citiesSeedData[cityIndex],
            cityName: updatedCity.cityName,
            country: updatedCity.countryName,
            cityEmail: updatedCity.cityEmail,
            foodCadetsLink: updatedCity.foodCadetsLink,
          };
          await fs.writeFile(seedPath, JSON.stringify(citiesSeedData, null, 2), "utf-8");
        }
      } catch (err) {
        console.warn("Failed to update cities.json seed file during edit.", err);
      }
    }

    revalidatePath("/sites/admin/cities");
    return { success: true, city: updatedCity };
  } catch (error: any) {
    console.error("Failed to edit city:", error);
    return { success: false, error: error?.message || "Failed to edit city." };
  }
}

export async function deleteCityAction(id: number, cityName: string) {
  try {
    const { deleteCity } = await import("@/core/services/backend/city/cityService");
    const deleted = await deleteCity(id);

    if (deleted) {
      try {
        const seedPath = path.join(process.cwd(), "src", "core", "db", "seeds", "data", "cities.json");
        const fileContent = await fs.readFile(seedPath, "utf-8");
        const citiesSeedData = JSON.parse(fileContent);
        
        const cityIndex = citiesSeedData.findIndex((c: any) => c.cityName === cityName);
        
        if (cityIndex !== -1) {
          citiesSeedData.splice(cityIndex, 1);
          await fs.writeFile(seedPath, JSON.stringify(citiesSeedData, null, 2), "utf-8");
        }
      } catch (err) {
        console.warn("Failed to delete from cities.json seed file.", err);
      }
      
      revalidatePath("/sites/admin/cities");
      return { success: true };
    }
    
    return { success: false, error: "City not found." };
  } catch (error: any) {
    console.error("Failed to delete city:", error);
    return { success: false, error: error?.message || "Failed to delete city." };
  }
}
