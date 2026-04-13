import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Products
  const products = [
    {
      slug: "noir-imperial",
      sku: "ZW-001",
      nameEn: "Noir Impérial",
      nameFr: "Noir Impérial",
      nameAr: "النوار الإمبراطوري",
      descriptionEn:
        "The Noir Impérial is the pinnacle of Ziziwatches craftsmanship. Its black PVD case houses a Swiss-inspired movement, with a sapphire crystal that reveals every detail of the midnight dial.",
      descriptionFr:
        "Le Noir Impérial représente le summum du savoir-faire Ziziwatches. Son boîtier en PVD noir abrite un mouvement d'inspiration suisse, avec un cristal saphir révélant chaque détail du cadran minuit.",
      descriptionAr:
        "النوار الإمبراطوري هو قمة الحرفية في زيزيووتشس. علبته السوداء PVD تحتضن حركة مستوحاة من السويسرية، مع كريستال الياقوت الذي يكشف كل تفاصيل المينا الليلية.",
      price: 24500,
      compareAtPrice: 29000,
      stock: 15,
      featured: true,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
          altFr: "Noir Impérial - Vue de face",
          altEn: "Noir Impérial - Front view",
          altAr: "النوار الإمبراطوري - منظر أمامي",
          position: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800",
          altFr: "Noir Impérial - Détail",
          altEn: "Noir Impérial - Detail",
          altAr: "النوار الإمبراطوري - تفاصيل",
          position: 1,
        },
      ],
      attributes: [
        { keyFr: "Diamètre", keyEn: "Diameter", keyAr: "القطر", valueFr: "42mm", valueEn: "42mm", valueAr: "٤٢ مم" },
        { keyFr: "Matériau boîtier", keyEn: "Case material", keyAr: "مادة العلبة", valueFr: "Acier inoxydable PVD noir", valueEn: "Black PVD stainless steel", valueAr: "فولاذ مقاوم للصدأ PVD أسود" },
        { keyFr: "Verre", keyEn: "Crystal", keyAr: "الزجاج", valueFr: "Cristal saphir", valueEn: "Sapphire crystal", valueAr: "كريستال الياقوت" },
        { keyFr: "Étanchéité", keyEn: "Water resistance", keyAr: "مقاومة الماء", valueFr: "5 ATM", valueEn: "5 ATM", valueAr: "٥ ATM" },
        { keyFr: "Bracelet", keyEn: "Strap", keyAr: "السوار", valueFr: "Cuir véritable noir", valueEn: "Black genuine leather", valueAr: "جلد طبيعي أسود" },
      ],
      tags: ["luxury", "black", "leather", "featured"],
    },
    {
      slug: "or-prestige",
      sku: "ZW-002",
      nameEn: "Or Prestige",
      nameFr: "Or Prestige",
      nameAr: "أور بريستيج",
      descriptionEn:
        "Or Prestige — where gold meets elegance. The sunray-brushed gold dial catches light from every angle, making it the statement piece for any occasion.",
      descriptionFr:
        "Or Prestige — là où l'or rencontre l'élégance. Le cadran doré brossé en rayons de soleil capture la lumière sous tous les angles, en faisant la pièce maîtresse de toute occasion.",
      descriptionAr:
        "أور بريستيج — حيث يلتقي الذهب بالأناقة. المينا الذهبية المصقولة تلتقط الضوء من كل زاوية، مما يجعلها القطعة المميزة لأي مناسبة.",
      price: 32000,
      compareAtPrice: null,
      stock: 8,
      featured: true,
      isNew: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800",
          altFr: "Or Prestige - Vue de face",
          altEn: "Or Prestige - Front view",
          altAr: "أور بريستيج - منظر أمامي",
          position: 0,
        },
      ],
      attributes: [
        { keyFr: "Diamètre", keyEn: "Diameter", keyAr: "القطر", valueFr: "40mm", valueEn: "40mm", valueAr: "٤٠ مم" },
        { keyFr: "Matériau boîtier", keyEn: "Case material", keyAr: "مادة العلبة", valueFr: "Acier doré", valueEn: "Gold-tone steel", valueAr: "فولاذ بلون ذهبي" },
        { keyFr: "Verre", keyEn: "Crystal", keyAr: "الزجاج", valueFr: "Cristal saphir", valueEn: "Sapphire crystal", valueAr: "كريستال الياقوت" },
        { keyFr: "Étanchéité", keyEn: "Water resistance", keyAr: "مقاومة الماء", valueFr: "3 ATM", valueEn: "3 ATM", valueAr: "٣ ATM" },
        { keyFr: "Bracelet", keyEn: "Strap", keyAr: "السوار", valueFr: "Bracelet milanais doré", valueEn: "Gold milanese bracelet", valueAr: "سوار ميلاني ذهبي" },
      ],
      tags: ["luxury", "gold", "milanese", "featured"],
    },
    {
      slug: "chrono-steel",
      sku: "ZW-003",
      nameEn: "Chrono Steel",
      nameFr: "Chrono Steel",
      nameAr: "كرونو ستيل",
      descriptionEn:
        "Built for precision and performance. The Chrono Steel features a triple-register chronograph with a steel bracelet that balances sporty aesthetics with urban elegance.",
      descriptionFr:
        "Conçu pour la précision et la performance. Le Chrono Steel dispose d'un chronographe à triple registre avec un bracelet en acier qui allie l'esthétique sportive à l'élégance urbaine.",
      descriptionAr:
        "مصمم للدقة والأداء. يتميز كرونو ستيل بكرونوغراف ثلاثي التسجيل مع سوار فولاذي يجمع بين الجمالية الرياضية والأناقة الحضرية.",
      price: 18900,
      compareAtPrice: 22000,
      stock: 20,
      featured: true,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800",
          altFr: "Chrono Steel - Vue de face",
          altEn: "Chrono Steel - Front view",
          altAr: "كرونو ستيل - منظر أمامي",
          position: 0,
        },
      ],
      attributes: [
        { keyFr: "Diamètre", keyEn: "Diameter", keyAr: "القطر", valueFr: "44mm", valueEn: "44mm", valueAr: "٤٤ مم" },
        { keyFr: "Matériau boîtier", keyEn: "Case material", keyAr: "مادة العلبة", valueFr: "Acier inoxydable 316L", valueEn: "316L stainless steel", valueAr: "فولاذ مقاوم للصدأ 316L" },
        { keyFr: "Verre", keyEn: "Crystal", keyAr: "الزجاج", valueFr: "Verre minéral durci", valueEn: "Hardened mineral glass", valueAr: "زجاج معدني مقوى" },
        { keyFr: "Étanchéité", keyEn: "Water resistance", keyAr: "مقاومة الماء", valueFr: "10 ATM", valueEn: "10 ATM", valueAr: "١٠ ATM" },
        { keyFr: "Bracelet", keyEn: "Strap", keyAr: "السوار", valueFr: "Bracelet acier oyster", valueEn: "Oyster steel bracelet", valueAr: "سوار فولاذي أويستر" },
      ],
      tags: ["sport", "chronograph", "steel", "featured"],
    },
    {
      slug: "heritage-classic",
      sku: "ZW-004",
      nameEn: "Heritage Classic",
      nameFr: "Héritage Classique",
      nameAr: "هيريتاج كلاسيك",
      descriptionEn:
        "Timeless sophistication. The Heritage Classic draws inspiration from the golden age of watchmaking — slim profile, Roman numerals, and a rich brown leather strap.",
      descriptionFr:
        "Sophistication intemporelle. L'Héritage Classique s'inspire de l'âge d'or de l'horlogerie — profil fin, chiffres romains et une riche courroie en cuir marron.",
      descriptionAr:
        "أناقة خالدة. يستوحي هيريتاج كلاسيك إلهامه من العصر الذهبي لصناعة الساعات — ملف رفيع وأرقام رومانية وحزام جلدي بني فاخر.",
      price: 15500,
      compareAtPrice: null,
      stock: 12,
      featured: false,
      isNew: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800",
          altFr: "Héritage Classique - Vue de face",
          altEn: "Heritage Classic - Front view",
          altAr: "هيريتاج كلاسيك - منظر أمامي",
          position: 0,
        },
      ],
      attributes: [
        { keyFr: "Diamètre", keyEn: "Diameter", keyAr: "القطر", valueFr: "38mm", valueEn: "38mm", valueAr: "٣٨ مم" },
        { keyFr: "Matériau boîtier", keyEn: "Case material", keyAr: "مادة العلبة", valueFr: "Acier inoxydable brossé", valueEn: "Brushed stainless steel", valueAr: "فولاذ مقاوم للصدأ مصقول" },
        { keyFr: "Verre", keyEn: "Crystal", keyAr: "الزجاج", valueFr: "Cristal saphir bombé", valueEn: "Domed sapphire crystal", valueAr: "كريستال ياقوت مقبب" },
        { keyFr: "Étanchéité", keyEn: "Water resistance", keyAr: "مقاومة الماء", valueFr: "3 ATM", valueEn: "3 ATM", valueAr: "٣ ATM" },
        { keyFr: "Bracelet", keyEn: "Strap", keyAr: "السوار", valueFr: "Cuir marron vieilli", valueEn: "Aged brown leather", valueAr: "جلد بني متقادم" },
      ],
      tags: ["classic", "leather", "roman", "elegant"],
    },
    {
      slug: "blanche-edition",
      sku: "ZW-005",
      nameEn: "Blanche Édition",
      nameFr: "Blanche Édition",
      nameAr: "بلانش إيديشن",
      descriptionEn:
        "Purity in motion. The Blanche Édition features a clean white dial with gold-toned hands, set against a polished steel case. Minimalism elevated to an art form.",
      descriptionFr:
        "La pureté en mouvement. La Blanche Édition présente un cadran blanc épuré avec des aiguilles dorées, dans un boîtier en acier poli. Le minimalisme élevé à la forme d'art.",
      descriptionAr:
        "النقاء في الحركة. تتميز بلانش إيديشن بمينا بيضاء نظيفة مع عقارب بلون ذهبي، محاطة بعلبة فولاذية مصقولة. البساطة ترقى إلى مستوى الفن.",
      price: 21000,
      compareAtPrice: null,
      stock: 7,
      featured: false,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800",
          altFr: "Blanche Édition - Vue de face",
          altEn: "Blanche Édition - Front view",
          altAr: "بلانش إيديشن - منظر أمامي",
          position: 0,
        },
      ],
      attributes: [
        { keyFr: "Diamètre", keyEn: "Diameter", keyAr: "القطر", valueFr: "39mm", valueEn: "39mm", valueAr: "٣٩ مم" },
        { keyFr: "Matériau boîtier", keyEn: "Case material", keyAr: "مادة العلبة", valueFr: "Acier inoxydable poli", valueEn: "Polished stainless steel", valueAr: "فولاذ مقاوم للصدأ مصقول" },
        { keyFr: "Cadran", keyEn: "Dial", keyAr: "المينا", valueFr: "Blanc nacré", valueEn: "Pearlescent white", valueAr: "أبيض لؤلؤي" },
        { keyFr: "Étanchéité", keyEn: "Water resistance", keyAr: "مقاومة الماء", valueFr: "3 ATM", valueEn: "3 ATM", valueAr: "٣ ATM" },
        { keyFr: "Bracelet", keyEn: "Strap", keyAr: "السوار", valueFr: "Cuir blanc crème", valueEn: "Cream white leather", valueAr: "جلد أبيض كريمي" },
      ],
      tags: ["classic", "white", "minimalist", "new"],
    },
  ];

  for (const p of products) {
    const { images, attributes, tags, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        images: { create: images },
        attributes: { create: attributes },
        tags: { create: tags.map((t) => ({ tag: t })) },
      },
    });
  }

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@ziziwatches.com" },
    update: {},
    create: {
      email: "admin@ziziwatches.com",
      name: "Admin",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  // Seed the Ziziwatches project in projects hub
  await prisma.project.upsert({
    where: { slug: "ziziwatches" },
    update: {},
    create: {
      name: "Ziziwatches",
      slug: "ziziwatches",
      description: "Boutique de montres de luxe",
      url: "https://ziziwatches.com",
      status: "ACTIVE",
      type: "STORE",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
