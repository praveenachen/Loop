export interface FieldSpec {
  key: string;
  label: string;
  placeholder?: string;
  min?: number;
  max: number;
  numeric?: boolean;
  integer?: boolean;
  multiline?: boolean;
  optional?: boolean;
}
export function validateFields(
  fields: readonly FieldSpec[],
  values: Record<string, string>,
): string | null {
  for (const field of fields) {
    const value = (values[field.key] ?? "").trim();
    if (!value && !field.optional) return `${field.label} is required.`;
    if (field.numeric) {
      const n = Number(value);
      if (
        !Number.isFinite(n) ||
        n < (field.min ?? 0) ||
        n > field.max ||
        (field.integer && !Number.isInteger(n))
      )
        return `${field.label} must be ${field.integer ? "a whole number" : "a number"} between ${field.min ?? 0} and ${field.max}.`;
    } else if (value.length < (field.min ?? 1) || value.length > field.max)
      return `${field.label} must be between ${field.min ?? 1} and ${field.max} characters.`;
  }
  return null;
}
export const listingFields: FieldSpec[] = [
  { key: "title", label: "Title", min: 3, max: 140 },
  {
    key: "description",
    label: "Description",
    min: 8,
    max: 1000,
    multiline: true,
  },
  {
    key: "price",
    label: "Price",
    numeric: true,
    integer: true,
    min: 0,
    max: 1000000,
  },
  {
    key: "category",
    label: "Category",
    placeholder: "Electronics",
    min: 2,
    max: 60,
  },
  {
    key: "location",
    label: "Pickup location",
    placeholder: "SLC",
    min: 2,
    max: 120,
  },
];
export const rideFields: FieldSpec[] = [
  {
    key: "route",
    label: "Route",
    placeholder: "Waterloo to Toronto",
    min: 3,
    max: 140,
  },
  {
    key: "departure",
    label: "Departure",
    placeholder: "Friday at 5:30 PM",
    min: 3,
    max: 80,
  },
  {
    key: "pricePerSeat",
    label: "Price per seat",
    numeric: true,
    integer: true,
    min: 0,
    max: 1000000,
  },
  {
    key: "seats",
    label: "Seats",
    numeric: true,
    integer: true,
    min: 0,
    max: 8,
  },
  {
    key: "car",
    label: "Vehicle / ride preference",
    placeholder: "Honda Civic 2020 / Any verified driver",
    min: 2,
    max: 120,
  },
];
export const groupFields: FieldSpec[] = [
  { key: "course", label: "Course", placeholder: "CS 246", min: 2, max: 20 },
  {
    key: "seatsLeft",
    label: "Available spots",
    numeric: true,
    integer: true,
    min: 0,
    max: 60,
  },
  {
    key: "title",
    label: "Group title",
    placeholder: "Midterm Review Session",
    min: 3,
    max: 140,
  },
  {
    key: "schedule",
    label: "Schedule",
    placeholder: "Sunday, 3:00 PM",
    min: 3,
    max: 120,
  },
  {
    key: "location",
    label: "Location",
    placeholder: "DC Library",
    min: 2,
    max: 120,
  },
  {
    key: "focus",
    label: "Focus",
    placeholder: "Topics and goals for this session",
    min: 4,
    max: 240,
    multiline: true,
  },
];
export const profileFields: FieldSpec[] = [
  { key: "name", label: "Full name", min: 2, max: 80 },
  { key: "program", label: "Program", min: 2, max: 80 },
  { key: "year", label: "Year", min: 1, max: 10 },
  { key: "avatar", label: "Avatar initials (2-3 chars)", min: 2, max: 3 },
];
