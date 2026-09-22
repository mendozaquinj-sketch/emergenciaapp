export type EmergencyContact = {
  name: string;
  phone: string; // formato internacional, ej. 5215512345678
};

export type ProfileType = "persona" | "mascota";

export type Profile = {
  id?: string;
  ownerId: string;
  type: ProfileType;
  name: string;
  bloodType?: string;
  allergies?: string;
  emergencyContacts: EmergencyContact[];
  languageDefault: "es" | "en" | "pt";
  createdAt?: any;

  // Campos específicos de mascotas
  breed?: string;
  marks?: string;
  vet?: string;
  reward?: string;
};

export type ScanEvent = {
  profileId: string;
  timestamp: any;
  approxLat?: number;
  approxLng?: number;
};
