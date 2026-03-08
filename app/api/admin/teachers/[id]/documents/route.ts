import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { createTeacherDocument, getTeacherById, listTeacherDocuments } from "@/lib/server/adminRepository";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function parseTeacherId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function GET(_request: Request, context: RouteContext) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const teacherId = parseTeacherId(id);
  if (!teacherId) {
    return NextResponse.json({ ok: false, message: "Invalid teacher id." }, { status: 400 });
  }

  if (!getTeacherById(teacherId)) {
    return NextResponse.json({ ok: false, message: "Teacher not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, documents: listTeacherDocuments(teacherId) });
}

export async function POST(request: Request, context: RouteContext) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const teacherId = parseTeacherId(id);
  if (!teacherId) {
    return NextResponse.json({ ok: false, message: "Invalid teacher id." }, { status: 400 });
  }

  if (!getTeacherById(teacherId)) {
    return NextResponse.json({ ok: false, message: "Teacher not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const documentType = String(formData.get("documentType") ?? "").trim();

  if (!documentType) {
    return NextResponse.json({ ok: false, message: "Document type is required." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "File is required." }, { status: 400 });
  }

  if (file.size <= 0) {
    return NextResponse.json({ ok: false, message: "File cannot be empty." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ ok: false, message: "File exceeds 10MB limit." }, { status: 400 });
  }

  const originalName = file.name || "document";
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 80) || "document";
  const fileName = `${baseName}-${randomUUID()}${ext}`;
  const relativeDir = path.join("uploads", "teacher-documents", String(teacherId));
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(absoluteDir, fileName);
  const publicPath = `/${relativeDir.replace(/\\/g, "/")}/${fileName}`;

  await mkdir(absoluteDir, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  createTeacherDocument(teacherId, documentType, originalName, publicPath);
  return NextResponse.json({ ok: true, documents: listTeacherDocuments(teacherId) });
}
