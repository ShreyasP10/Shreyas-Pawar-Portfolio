import { NextResponse } from "next/server";
import {
  getCertifications,
  getEducation,
  getSkillGroups,
} from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    education: getEducation(),
    certifications: getCertifications(),
    skillGroups: getSkillGroups(),
  });
}
