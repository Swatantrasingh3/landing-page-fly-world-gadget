import { randomUUID } from "node:crypto";
// The deployment platform requires this server-only client to remain in root db.js.
// @ts-expect-error db.js is intentionally outside the TypeScript project include list.
import { supabase } from "../db.js";

type RepairPhoto = {
  fileName: string;
  mimeType: string;
  fileSize: number;
  data: string;
};

type RepairRequest = {
  fullName: string;
  phone: string;
  email: string | null;
  droneBrand: string;
  droneModel: string | null;
  problemType: string;
  problemDescription: string;
  repairRequirement: string | null;
  pickupPreference: string | null;
  photos: RepairPhoto[];
};

const PHOTO_BUCKET = "repair-damage-photos";

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-180) || "photo";
}

export async function createSupabaseRepairRequest(input: RepairRequest) {
  const uploadedPaths: string[] = [];

  try {
    const damagePhotos = [];
    for (const photo of input.photos) {
      const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFileName(photo.fileName)}`;
      const { error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, Buffer.from(photo.data, "base64"), {
          contentType: photo.mimeType,
          upsert: false,
        });

      if (error) throw new Error(`Damage photo upload failed: ${error.message}`);
      uploadedPaths.push(path);
      damagePhotos.push({
        path,
        fileName: photo.fileName,
        mimeType: photo.mimeType,
        fileSize: photo.fileSize,
      });
    }

    const { data, error } = await supabase
      .from("repair_requests")
      .insert({
        full_name: input.fullName,
        phone: input.phone,
        email: input.email,
        drone_brand: input.droneBrand,
        drone_model: input.droneModel,
        problem_type: input.problemType,
        problem_description: input.problemDescription,
        repair_requirement: input.repairRequirement,
        pickup_preference: input.pickupPreference,
        damage_photos: damagePhotos,
      })
      .select("id")
      .single();

    if (error) throw new Error(`Repair request could not be saved: ${error.message}`);
    return { id: data.id };
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(PHOTO_BUCKET).remove(uploadedPaths);
    }
    throw error;
  }
}
