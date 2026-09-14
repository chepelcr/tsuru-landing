export interface CreateOrganizationData {
  // Basic info (Step 1)
  name: string;
  slug: string;
  subdomain?: string;
  ownerId: string;

  // Contact settings (Step 2 & 3)
  contact_settings?: {
    phone: string;
    whatsapp_number?: string;
    business_hours: string;
    address: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
  };

  // Template selection (Step 4)
  template_id?: string;
}

export interface OrganizationFormData {
  // Step 1: Basic info
  name: string;
  slug: string;
  subdomain: string;

  // Step 2: Contact info
  phone: string;
  whatsappNumber: string;
  sameAsBusinessPhone: boolean;
  businessHours: string;

  // Step 3: Business address
  country: string;
  state: string;
  city: string;
  postalCode: string;
  fullAddress: string;

  // Step 4: Template selection
  selectedTemplateId: string;
}

export interface Template {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  preview_url?: string;
  is_active: boolean;
  sort_order: number;
}
