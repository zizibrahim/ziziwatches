import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, city, contact } = await req.json();

    if (!name?.trim() || !city?.trim() || !contact?.trim()) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    await prisma.vipSignup.create({
      data: { name: name.trim(), city: city.trim(), contact: contact.trim() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
