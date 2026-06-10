export const MAKES = [
  "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chevrolet", "Chrysler",
  "Citroën", "Cupra", "Dacia", "Daewoo", "Daihatsu", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis",
  "GMC", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini",
  "Lancia", "Land Rover", "Lexus", "Lotus", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini",
  "Mitsubishi", "Nissan", "Opel", "Pagani", "Peugeot", "Polestar", "Porsche", "RAM", "Renault", "Rolls-Royce",
  "Rover", "Saab", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

export const MODELS_BY_MAKE: Record<string, string[]> = {
  "Abarth": ["595", "695", "124 Spider", "Punto"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta", "MiTo", "4C", "Spider", "GTV"],
  "Aston Martin": ["DB11", "DB12", "DBS", "Vantage", "DBX", "Vanquish", "Rapide", "Valhalla"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "R8", "TT", "RS3", "RS4", "RS5", "RS6", "RS7", "SQ5", "S3", "S4", "S5"],
  "Bentley": ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Azure"],
  "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 6", "Série 7", "Série 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "i4", "i5", "i7", "iX", "iX3", "M2", "M3", "M4", "M5", "M8", "X3 M", "X4 M", "X5 M", "X6 M", "Z4"],
  "Bugatti": ["Chiron", "Veyron", "Divo", "La Voiture Noire", "Mistral"],
  "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "Lyriq"],
  "Chevrolet": ["Camaro", "Corvette", "Malibu", "Tahoe", "Suburban", "Traverse", "Equinox", "Silverado"],
  "Citroën": ["C1", "C3", "C4", "C5", "C6", "C3 Aircross", "C4 Cactus", "C5 Aircross", "Berlingo", "DS3", "DS4", "DS7", "Ami", "Jumpy", "Jumper", "SpaceTourer"],
  "Cupra": ["Leon", "Formentor", "Born", "Ateca", "Tavascan"],
  "Dacia": ["Sandero", "Duster", "Logan", "Spring", "Jogger", "Lodgy"],
  "Dodge": ["Challenger", "Charger", "Durango", "Viper", "Journey"],
  "Ferrari": ["296 GTB", "296 GTS", "812 Superfast", "Portofino", "Roma", "SF90 Stradale", "SF90 Spider", "F8 Tributo", "F8 Spider", "812 GTS", "Purosangue", "LaFerrari", "Enzo", "F40", "F50"],
  "Fiat": ["500", "500X", "500L", "Panda", "Tipo", "Doblo", "Ducato", "Ulysse", "Multipla"],
  "Ford": ["Fiesta", "Focus", "Mustang", "Mustang Mach-E", "Puma", "Kuga", "Explorer", "Ranger", "Transit", "Bronco", "F-150", "GT", "Mondeo", "S-Max", "Galaxy"],
  "Honda": ["Civic", "CR-V", "HR-V", "Jazz", "Accord", "NSX", "Integra", "Pilot", "e"],
  "Hyundai": ["i10", "i20", "i30", "i40", "Kona", "Tucson", "Santa Fe", "IONIQ 5", "IONIQ 6", "Nexo", "Bayon", "Staria"],
  "Jaguar": ["F-Type", "F-Pace", "E-Pace", "I-Pace", "XE", "XF", "XJ", "XK"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Renegade", "Compass", "Avenger", "Gladiator"],
  "Kia": ["Rio", "Ceed", "Sportage", "Sorento", "Stonic", "Niro", "EV6", "EV9", "Picanto", "Soul", "Stinger", "ProCeed"],
  "Lamborghini": ["Huracán", "Aventador", "Urus", "Revuelto", "Gallardo", "Murciélago", "Countach", "Diablo"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Discovery", "Discovery Sport", "Defender", "Freelander"],
  "Lexus": ["IS", "ES", "LS", "NX", "RX", "UX", "RZ", "LC", "LM"],
  "Lotus": ["Emira", "Evija", "Eletre", "Exige", "Elise", "Evora"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "MC20", "Grecale", "GranTurismo", "GranCabrio"],
  "Mazda": ["2", "3", "6", "CX-3", "CX-5", "CX-60", "MX-5", "RX-8", "CX-30", "MX-30"],
  "McLaren": ["720S", "765LT", "Artura", "Senna", "Speedtail", "P1", "GT", "600LT", "570S"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "Classe G", "GLA", "GLB", "GLC", "GLE", "GLS", "EQE", "EQS", "EQA", "EQB", "EQC", "AMG GT", "AMG SL", "Viano", "Vito", "Sprinter", "Classe CLA", "Classe CLS"],
  "Mini": ["Cooper", "Countryman", "Clubman", "Cabrio", "Paceman", "John Cooper Works", "Electric"],
  "Mitsubishi": ["ASX", "Outlander", "Eclipse Cross", "Space Star", "L200", "Pajero", "Colt"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya", "GT-R", "370Z", "Navara", "Pathfinder", "Patrol"],
  "Peugeot": ["108", "208", "308", "508", "2008", "3008", "5008", "Rifter", "Partner", "Boxer", "e-208", "e-308", "e-2008", "RCZ"],
  "Polestar": ["1", "2", "3", "4"],
  "Porsche": ["911", "718 Cayman", "718 Boxster", "Panamera", "Cayenne", "Macan", "Taycan", "Carrera GT", "918 Spyder"],
  "Renault": ["Clio", "Megane", "Captur", "Arkana", "Austral", "Rafale", "Kadjar", "Koleos", "Espace", "Talisman", "Scenic", "Trafic", "Master", "Zoe", "Twingo", "5", "Alpine A110"],
  "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan", "Spectre"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Mii", "Alhambra"],
  "Skoda": ["Fabia", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Scala", "Citigo"],
  "Subaru": ["Impreza", "WRX", "Outback", "Forester", "XV", "Levorg", "BRZ"],
  "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny", "Ignis", "Across"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Roadster"],
  "Toyota": ["Yaris", "Corolla", "Camry", "RAV4", "C-HR", "Highlander", "Land Cruiser", "Supra", "GR86", "Prius", "Aygo", "Proace", "Hilux", "bZ4X", "Mirai"],
  "Volkswagen": ["Polo", "Golf", "ID.3", "ID.4", "ID.5", "ID.Buzz", "Passat", "Tiguan", "T-Cross", "T-Roc", "Taigo", "Touran", "Sharan", "Arteon", "Multivan", "Transporter", "Crafter", "Amarok", "Lupo", "Beetle", "Scirocco"],
  "Volvo": ["XC40", "XC60", "XC90", "S60", "S90", "V60", "V90", "C40", "EX30", "EX90", "Polestar"],
  "Opel": ["Corsa", "Astra", "Insignia", "Crossland", "Grandland", "Mokka", "Combo", "Vivaro", "Movano"],
  "DS": ["DS4", "DS7", "DS9", "DS3 Crossback"],
  "Alpine": ["A110", "A310"],
  "Lancia": ["Ypsilon", "Delta"],
  "MG": ["MG4", "MG ZS", "MG HS", "MG5", "MG Marvel R"],
  "Smart": ["ForTwo", "ForFour", "#1", "#3"],
  "Hummer": ["H2", "H3", "EV"],
  "Rivian": ["R1T", "R1S"],
  "Lucid": ["Air"],
  "Fisker": ["Ocean", "Pear"],
  "VinFast": ["VF8", "VF9"],
};

export function getModelsForMake(make: string): string[] {
  return MODELS_BY_MAKE[make] || [];
}

export const ENERGY_TYPES = ["Essence", "Diesel", "Électrique", "Hybride", "Hybride Rechargeable", "GPL", "E85", "Hydrogène"];
export const TRANSMISSION_TYPES = ["Manuelle", "Automatique", "Automatique (PDK)", "Automatique (DSG)", "Automatique (EDC)", "Automatique (ECT)", "Automatique (Tiptronic)", "Robotisée", "CVT", "Direct Drive"];
export const VEHICLE_TYPES = ["Berline", "Coupé", "Cabriolet", "SUV", "4x4", "Break", "Monospace", "Citadine", "Sportive", "Supercar", "Pick-up", "Van", "Utilitaire"];
export const DOOR_COUNTS = ["2", "3", "4", "5"];
export const SEAT_COUNTS = ["2", "4", "5", "7"];
export const CONDITION_TYPES = ["Excellent", "Très bon état", "Bon état", "Usure normale", "À restaurer"];
export const CRIT_AIR_STICKERS = ["0 (Vert)", "1 (Violet)", "2 (Jaune)", "3 (Orange)", "4 (Rouge)", "5 (Gris)", "Non classé"];
