export const categories = [
  {
    name: "Medicines",
    subcategories: [
      {
        name: "Prescription Drugs",
        href: "/medicines/prescription",
        children: [
          { name: "Painkillers", href: "/medicines/prescription/painkillers" },
          { name: "Antibiotics", href: "/medicines/prescription/antibiotics" },
          { name: "Antidepressants", href: "/medicines/prescription/antidepressants" },
          { name: "Cardiac Drugs", href: "/medicines/prescription/cardiac" },
          { name: "Anti-diabetic", href: "/medicines/prescription/anti-diabetic" },
        ],
      },
      {
        name: "OTC Medicines",
        href: "/medicines/otc",
        children: [
          { name: "Cough Syrups", href: "/medicines/otc/cough" },
          { name: "Allergy Tablets", href: "/medicines/otc/allergy" },
          { name: "Cold & Flu", href: "/medicines/otc/cold-flu" },
          { name: "Digestive Aids", href: "/medicines/otc/digestive" },
        ],
      },
      { name: "Ayurvedic", href: "/medicines/ayurvedic" },
      { name: "Homeopathic", href: "/medicines/homeopathic" },
    ],
  },
  {
    name: "Health Products",
    subcategories: [
      {
        name: "Vitamins & Supplements",
        href: "/health/vitamins",
        children: [
          { name: "Vitamin C", href: "/health/vitamins/vitamin-c" },
          { name: "Vitamin D", href: "/health/vitamins/vitamin-d" },
          { name: "Multivitamins", href: "/health/vitamins/multivitamins" },
        ],
      },
      {
        name: "Protein & Nutrition",
        href: "/health/nutrition",
        children: [
          { name: "Protein Powders", href: "/health/nutrition/protein-powders" },
          { name: "Energy Bars", href: "/health/nutrition/energy-bars" },
          { name: "Weight Gainers", href: "/health/nutrition/weight-gainers" },
        ],
      },
      { name: "Health Devices", href: "/health/devices" },
      { name: "First Aid", href: "/health/first-aid" },
    ],
  },
  {
    name: "Personal Care",
    subcategories: [
      {
        name: "Skin Care",
        href: "/personal-care/skin",
        children: [
          { name: "Face Creams", href: "/personal-care/skin/face-creams" },
          { name: "Sunscreen", href: "/personal-care/skin/sunscreen" },
          { name: "Serums", href: "/personal-care/skin/serums" },
        ],
      },
      {
        name: "Hair Care",
        href: "/personal-care/hair",
        children: [
          { name: "Shampoos", href: "/personal-care/hair/shampoos" },
          { name: "Conditioners", href: "/personal-care/hair/conditioners" },
          { name: "Hair Oils", href: "/personal-care/hair/oils" },
        ],
      },
      { name: "Oral Care", href: "/personal-care/oral" },
      { name: "Baby Care", href: "/personal-care/baby" },
    ],
  },
  {
    name: "Lab Tests",
    subcategories: [
      { name: "Health Checkups", href: "/lab-tests/checkups" },
      { name: "Diabetes", href: "/lab-tests/diabetes" },
      { name: "Heart Health", href: "/lab-tests/heart" },
      { name: "Women Health", href: "/lab-tests/women" },
      { name: "Kidney Function", href: "/lab-tests/kidney" },
      { name: "Thyroid", href: "/lab-tests/thyroid" },
      { name: "Liver Function", href: "/lab-tests/liver" },
    ],
  },
  {
    name: "Wellness Packages",
    subcategories: [
      { name: "Full Body Checkup", href: "/wellness/full-body" },
      { name: "Senior Citizen Checkup", href: "/wellness/senior" },
      { name: "Fitness Panel", href: "/wellness/fitness" },
      { name: "Pregnancy Panel", href: "/wellness/pregnancy" },
      { name: "Cardiac Package", href: "/wellness/cardiac" },
    ],
  },
  {
    name: "Diagnostics",
    subcategories: [
      { name: "Blood Tests", href: "/diagnostics/blood-tests" },
      { name: "Urine Tests", href: "/diagnostics/urine-tests" },
      { name: "X-Ray", href: "/diagnostics/x-ray" },
      { name: "MRI & CT Scan", href: "/diagnostics/mri-ct" },
      { name: "Ultrasound", href: "/diagnostics/ultrasound" },
    ],
  },
  {
    name: "Covid Care",
    subcategories: [
      { name: "RT-PCR Test", href: "/covid/rtpcr" },
      { name: "Antigen Test", href: "/covid/antigen" },
      { name: "Covid Essentials", href: "/covid/essentials" },
      { name: "Vaccination", href: "/covid/vaccination" },
    ],
  },
  {
    name: "Home Care",
    subcategories: [
      { name: "Nursing Services", href: "/home-care/nursing" },
      { name: "Elderly Care", href: "/home-care/elderly" },
      { name: "Home Sample Collection", href: "/home-care/sample-collection" },
      { name: "Medical Equipment Rent", href: "/home-care/equipment-rent" },
      { name: "Physiotherapy at Home", href: "/home-care/physiotherapy" },
    ],
  },
  {
    name: "Ayurveda",
    subcategories: [
      { name: "Herbal Medicines", href: "/ayurveda/herbal" },
      { name: "Chyawanprash", href: "/ayurveda/chyawanprash" },
      { name: "Oils & Balms", href: "/ayurveda/oils" },
      { name: "Wellness Kits", href: "/ayurveda/kits" },
    ],
  },
  {
    name: "Care Plans",
    subcategories: [
      { name: "Diabetes Care", href: "/care-plan/diabetes" },
      { name: "Heart Care", href: "/care-plan/heart" },
      { name: "Women Care", href: "/care-plan/women" },
      { name: "Kidney Care", href: "/care-plan/kidney" },
    ],
  },
];
