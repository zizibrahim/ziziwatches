import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  type: z.enum(["STORE", "LANDING", "APP"]).default("STORE"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const slug = slugify(data.name, { lower: true, strict: true });

    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        url: data.url || null,
        type: data.type,
        status: data.status,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
