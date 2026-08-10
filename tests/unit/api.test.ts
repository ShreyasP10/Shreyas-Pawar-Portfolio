import { describe, expect, it } from "vitest";
import { GET as getAbout } from "@/app/api/about/route";
import { GET as getProjects } from "@/app/api/projects/route";
import { GET as getExperience } from "@/app/api/experience/route";
import { GET as getHackathons } from "@/app/api/hackathons/route";
import { GET as getProfile } from "@/app/api/profile/route";
import { POST as postContact } from "@/app/api/contact/route";
import {
  profile,
  projects,
  experience,
  education,
  certifications,
  hackathons,
  skillGroups,
} from "@/lib/data";

const read = async (res: Response) => res.json();

function contactRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID_BODY = {
  name: "Shreyas Pawar",
  email: "shreyaspawar1011@gmail.com",
  message: "Hello, this is a valid test message.",
};

describe("UT-02 · API ↔ data agreement", () => {
  it("GET /api/projects matches lib/data.ts", async () => {
    const body = await read(await getProjects());
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(projects.length);
    expect(body.map((p: { id: number }) => p.id)).toEqual(projects.map((p) => p.id));
  });

  it("GET /api/experience matches lib/data.ts", async () => {
    const body = await read(await getExperience());
    expect(body).toHaveLength(experience.length);
  });

  it("GET /api/hackathons matches lib/data.ts", async () => {
    const body = await read(await getHackathons());
    expect(body).toHaveLength(hackathons.length);
  });

  it("GET /api/about matches lib/data.ts", async () => {
    const body = await read(await getAbout());
    expect(body.education).toHaveLength(education.length);
    expect(body.certifications).toHaveLength(certifications.length);
    expect(body.skillGroups).toHaveLength(skillGroups.length);
  });

  it("GET /api/profile matches lib/data.ts", async () => {
    const body = await read(await getProfile());
    expect(body.name).toBe(profile.name);
    expect(body.email).toBe(profile.email);
  });
});

describe("UT-03 · POST /api/contact validation", () => {
  it("rejects invalid JSON with 400", async () => {
    const res = await postContact(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{not json",
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).success).toBe(false);
  });

  it("rejects a short name with 400", async () => {
    const res = await postContact(contactRequest({ ...VALID_BODY, name: "S" }));
    expect(res.status).toBe(400);
  });

  it("rejects a malformed email with 400", async () => {
    const res = await postContact(
      contactRequest({ ...VALID_BODY, email: "not-an-email" })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a short message with 400", async () => {
    const res = await postContact(contactRequest({ ...VALID_BODY, message: "short" }));
    expect(res.status).toBe(400);
  });

  it("accepts a valid payload when no Resend key is set", async () => {
    const savedKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    try {
      const res = await postContact(contactRequest(VALID_BODY));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.mailto).toContain("mailto:shreyaspawar1011@gmail.com");
    } finally {
      if (savedKey !== undefined) process.env.RESEND_API_KEY = savedKey;
    }
  });
});
