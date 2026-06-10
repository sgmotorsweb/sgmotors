import { MetadataRoute } from "next";

const VEHICLES = [
  { id: "1", make: "Porsche", model: "911 Carrera S", year: 2021 },
  { id: "2", make: "Audi", model: "RS e-tron GT", year: 2023 },
  { id: "3", make: "Mercedes-Benz", model: "AMG GT 63 S", year: 2022 },
  { id: "4", make: "BMW", model: "M4 Competition", year: 2022 },
  { id: "5", make: "Tesla", model: "Model S Plaid", year: 2023 },
  { id: "6", make: "Ferrari", model: "Roma", year: 2021 },
  { id: "7", make: "Lamborghini", model: "Huracán EVO", year: 2022 },
  { id: "8", make: "Range Rover", model: "Sport HSE Dynamic", year: 2023 },
  { id: "9", make: "BMW", model: "X5 M Competition", year: 2021 },
  { id: "10", make: "Audi", model: "R8 V10 Plus", year: 2020 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sgmotors.fr";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/reprise`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/requete-recherche`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cgv`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/rgpd`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const vehiclePages = VEHICLES.map((v) => ({
    url: `${baseUrl}/vehicule/${v.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...vehiclePages];
}
