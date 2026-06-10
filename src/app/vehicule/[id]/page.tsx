import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Settings, CheckCircle, ArrowLeft, Fuel, Gauge, Cog, Calendar, Palette, ClipboardList, Award, CarFront } from "lucide-react";
import ContactButtons, { MobileContactBar, FinanceContact } from "./ContactButtons";
import StatsTracker from "./StatsTracker";
import VehicleGallery from "@/components/VehicleGallery";
import { getServerVehicle } from "@/lib/vehicles-server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getServerVehicle(id);
  if (!vehicle) return { title: "Véhicule non trouvé - SG MOTORS" };

  return {
    title: `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.price.toLocaleString("fr-FR")} € | SG MOTORS`,
    description: `Découvrez la ${vehicle.make} ${vehicle.model} ${vehicle.year} à ${vehicle.price.toLocaleString("fr-FR")} €. ${vehicle.mileage.toLocaleString("fr-FR")} km, ${vehicle.fuel}, ${vehicle.transmission}. Garage SG MOTORS - Paris.`,
    openGraph: {
      title: `${vehicle.make} ${vehicle.model} ${vehicle.year} | SG MOTORS`,
      description: `${vehicle.price.toLocaleString("fr-FR")} € - ${vehicle.mileage.toLocaleString("fr-FR")} km - ${vehicle.fuel}`,
      images: [{ url: vehicle.images[0], width: 1200, height: 630 }],
      type: "website",
      locale: "fr_FR",
      siteName: "SG MOTORS",
    },
    twitter: {
      card: "summary_large_image",
      title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
      description: `${vehicle.price.toLocaleString("fr-FR")} € - ${vehicle.mileage.toLocaleString("fr-FR")} km - ${vehicle.fuel}`,
      images: [vehicle.images[0]],
    },
    alternates: { canonical: `https://www.sgmotors.fr/vehicule/${vehicle.id}` },
  };
}

export default async function VehiculeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getServerVehicle(id);
  if (!vehicle) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${vehicle.make} ${vehicle.model}`,
    modelDate: vehicle.year,
    manufacturer: { "@type": "Organization", name: vehicle.make },
    offers: { "@type": "Offer", price: vehicle.price, priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    mileageFromOdometer: { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" },
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    color: vehicle.color,
    vehicleEngine: { "@type": "EngineSpecification", name: vehicle.power },
    image: vehicle.images,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StatsTracker id={vehicle.id} />
      <article itemScope itemType="https://schema.org/Vehicle" className="flex flex-col flex-1 bg-primary pb-24 lg:pb-0">
        <meta itemProp="name" content={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} />
        <meta itemProp="modelDate" content={String(vehicle.year)} />
        <nav className="sticky top-20 z-40 border-b" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }} aria-label="Fil d'Ariane">
          <div className="container mx-auto px-4 py-3">
            <Link href="/" className="text-sm flex items-center gap-1 transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Retour au catalogue">
              <ArrowLeft className="h-4 w-4" /> Retour au catalogue
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <VehicleGallery images={vehicle.images} make={vehicle.make} model={vehicle.model} year={vehicle.year} />
              <div className="block lg:hidden">
                <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.badge && <span className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--color-sg-accent-blue)", color: "#fff" }}>{vehicle.badge}</span>}</h1>
                <p className="text-3xl font-bold mb-2" style={{ color: "var(--color-sg-accent-cyan)" }} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price" content={String(vehicle.price)}>{vehicle.price.toLocaleString("fr-FR")}</span> <span itemProp="priceCurrency" content="EUR">€</span>
                </p>
                <div className="flex flex-wrap gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Gauge className="h-4 w-4" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" />{vehicle.mileage.toLocaleString("fr-FR")} km</span>
                  <span className="flex items-center gap-1"><Fuel className="h-4 w-4" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" />{vehicle.fuel}</span>
                  <span className="flex items-center gap-1"><Cog className="h-4 w-4" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" />{vehicle.transmission}</span>
                </div>
              </div>

              <section aria-label="Caractéristiques techniques" className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <h2 className="text-lg font-bold mb-5 pb-3 border-b flex items-center gap-2" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>
                  <Settings className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" /> Caractéristiques techniques
                </h2>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4">
                  {[
                    { icon: Calendar, label: "Année", value: String(vehicle.year) },
                    vehicle.finition && { icon: Award, label: "Finition", value: vehicle.finition },
                    { icon: Gauge, label: "Kilométrage", value: `${vehicle.mileage.toLocaleString("fr-FR")} km` },
                    { icon: Fuel, label: "Carburant", value: vehicle.fuel },
                    { icon: Cog, label: "Boîte", value: vehicle.transmission },
                    vehicle.vehicleType && { icon: CarFront, label: "Type", value: vehicle.vehicleType },
                    vehicle.color && { icon: Palette, label: "Couleur", value: vehicle.color },
                    vehicle.power && { icon: Cog, label: "Puissance DIN", value: vehicle.power.match(/^\d+/) ? `${vehicle.power} ch` : vehicle.power },
                    vehicle.powerFiscal && { icon: Cog, label: "Puiss. fiscale", value: `${vehicle.powerFiscal} CV` },
                    vehicle.consumption && { icon: Cog, label: "Consommation", value: vehicle.consumption.match(/[\d,.]+\s*L\s*\/?\s*100\s*km/i) ? vehicle.consumption : `${vehicle.consumption} L/100km` },
                    { icon: Cog, label: "Crit'Air", value: String(vehicle.critAir) },
                    { icon: Cog, label: "Portes", value: String(vehicle.doors) },
                    { icon: Cog, label: "Places", value: String(vehicle.seats) },
                    vehicle.condition && { icon: ClipboardList, label: "État", value: vehicle.condition },
                  ].filter(Boolean).map(({ icon: Icon, label, value }: any) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" />
                      <div><dt className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</dt><dd className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</dd></div>
                    </div>
                  ))}
                </dl>
              </section>

              {vehicle.videoUrl && (
                <section aria-label="Vidéo" className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                  <h2 className="text-lg font-bold mb-4 pb-3 border-b flex items-center gap-2" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>
                    <Settings className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> Vidéo
                  </h2>
                  {vehicle.videoUrl.startsWith("data:") ? (
                    <video src={vehicle.videoUrl} controls className="w-full rounded-xl" />
                  ) : (
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <iframe src={vehicle.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  )}
                </section>
              )}

              <section aria-label="Équipements et options" className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 pb-3 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>
                  <Settings className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" /> Équipements
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(vehicle.options || []).map((opt, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-sg-accent-blue)" }} aria-hidden="true"></span>{opt}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="Démarches administratives" className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 pb-3 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>
                  <ClipboardList className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} aria-hidden="true" /> Démarches administratives
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  SG MOTORS s&apos;occupe de toutes les démarches administratives liées à l&apos;achat de votre véhicule : carte grise, certificat de cession, contrôle technique, et immatriculation. Vous repartez avec un véhicule en règle, sans vous soucier des formalités.
                </p>
              </section>
            </div>

            <aside className="space-y-6" aria-label="Actions et financement">
              <div className="sticky top-32 space-y-6">
                <div className="hidden lg:block border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                  <h1 className="text-2xl font-bold mb-2 leading-tight" style={{ color: "var(--text-primary)" }}>{vehicle.year} {vehicle.make} <br/>{vehicle.model} {vehicle.badge && <span className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--color-sg-accent-blue)", color: "#fff" }}>{vehicle.badge}</span>}</h1>
                  <p className="text-4xl font-bold my-4" style={{ color: "var(--text-primary)" }} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price" content={String(vehicle.price)}>{vehicle.price.toLocaleString("fr-FR")}</span> <span itemProp="priceCurrency" content="EUR">€</span>
                  </p>
                  <dl className="grid grid-cols-2 gap-4 py-4 border-t text-sm" style={{ borderColor: "var(--border-primary)" }}>
                    <div><dt style={{ color: "var(--text-muted)" }} className="mb-1">Kilométrage</dt><dd className="font-semibold" style={{ color: "var(--text-primary)" }}>{vehicle.mileage.toLocaleString("fr-FR")} km</dd></div>
                    <div><dt style={{ color: "var(--text-muted)" }} className="mb-1">Carburant</dt><dd className="font-semibold" style={{ color: "var(--text-primary)" }}>{vehicle.fuel}</dd></div>
                    <div><dt style={{ color: "var(--text-muted)" }} className="mb-1">Boîte</dt><dd className="font-semibold" style={{ color: "var(--text-primary)" }}>{vehicle.transmission}</dd></div>
                    <div><dt style={{ color: "var(--text-muted)" }} className="mb-1">Puissance</dt><dd className="font-semibold" style={{ color: "var(--text-primary)" }}>{vehicle.power}</dd></div>
                  </dl>
                </div>

                <div className="border rounded-xl p-6 relative overflow-hidden" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                  <div className="absolute top-0 right-0 p-4 opacity-5"><CalculatorIcon className="w-24 h-24" style={{ color: "var(--text-primary)" }} aria-hidden="true" /></div>
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: "var(--text-primary)" }}>Financement</h2>
                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Plusieurs solutions de financement flexibles :</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span><strong style={{ color: "var(--text-primary)" }}>4x sans frais</strong> par carte bancaire (Paiement 4x CB)</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span><strong style={{ color: "var(--text-primary)" }}>Crédit longue durée</strong> via notre prestataire partenaire (sous réserve d'acceptation)</span>
                    </li>
                  </ul>
                  <FinanceContact />
                </div>

                <div className="hidden lg:flex flex-col gap-3">
                  <ContactButtons vehicule={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} />
                </div>
              </div>
            </aside>
          </div>
        </div>

        <MobileContactBar vehicule={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} />
      </article>
    </>
  );
}

function CalculatorIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="8" x2="8" y1="10" y2="10" /><line x1="12" x2="12" y1="10" y2="10" /><line x1="16" x2="16" y1="10" y2="10" /><line x1="8" x2="8" y1="14" y2="14" /><line x1="12" x2="12" y1="14" y2="14" /><line x1="16" x2="16" y1="14" y2="14" /><line x1="8" x2="8" y1="18" y2="18" /><line x1="12" x2="12" y1="18" y2="18" /></svg>);
}
