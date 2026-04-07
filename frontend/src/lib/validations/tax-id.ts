const EU_COUNTRIES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
  "Spain", "Sweden",
];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/;
const VAT_REGEX = /^[A-Z]{2}[0-9A-Z]{2,12}$/;
const EIN_REGEX = /^\d{2}-?\d{7}$/;

interface TaxIdConfig {
  label: string;
  placeholder: string;
  validate: (v: string) => boolean;
  format: string;
}

export function getTaxIdConfig(country: string): TaxIdConfig {
  if (country === "India") {
    return {
      label: "GSTIN",
      placeholder: "e.g. 22AAAAA0000A1Z5",
      validate: (v) => GSTIN_REGEX.test(v.toUpperCase()),
      format: "15 alphanumeric characters (e.g. 22AAAAA0000A1Z5)",
    };
  }

  if (country === "United States") {
    return {
      label: "EIN (Employer Identification Number)",
      placeholder: "e.g. 12-3456789",
      validate: (v) => EIN_REGEX.test(v.replace(/\s/g, "")),
      format: "9 digits (e.g. 12-3456789)",
    };
  }

  if (EU_COUNTRIES.includes(country)) {
    return {
      label: "VAT Number",
      placeholder: "e.g. DE123456789",
      validate: (v) => VAT_REGEX.test(v.toUpperCase().replace(/\s/g, "")),
      format: "Country code + 2-12 alphanumeric characters",
    };
  }

  if (country === "United Kingdom") {
    return {
      label: "UTR (Unique Taxpayer Reference)",
      placeholder: "e.g. 1234567890",
      validate: (v) => /^\d{10}$/.test(v.replace(/\s/g, "")),
      format: "10 digits",
    };
  }

  if (country === "United Arab Emirates") {
    return {
      label: "TRN (Tax Registration Number)",
      placeholder: "e.g. 100123456789003",
      validate: (v) => /^\d{15}$/.test(v.replace(/\s/g, "")),
      format: "15 digits",
    };
  }

  return {
    label: "Tax ID / Registration Number",
    placeholder: "Enter your tax identification number",
    validate: (v) => v.trim().length >= 5,
    format: "Minimum 5 characters",
  };
}
