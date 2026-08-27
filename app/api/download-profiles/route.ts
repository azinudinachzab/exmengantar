import { getProfiles } from "@/lib/db";

function escapeHtml(value: unknown): string {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cell(value: unknown): string {
  return `<td>${escapeHtml(value)}</td>`;
}

function joinList(value: string[] | undefined): string {
  return (value ?? []).join("; ");
}

export async function GET() {
  const profiles = await getProfiles();

  const header = [
    "Name",
    "Title",
    "Previous Company",
    "Location",
    "Bio",
    "Skills",
    "Open To Roles",
    "Layoff Date",
    "Email",
    "LinkedIn",
    "Portfolio",
    "Photo URL",
  ]
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("");

  const rows = profiles
    .map((p) => {
      return `<tr>${[
        cell(p.name),
        cell(p.title),
        cell(joinList(p.previousCompany)),
        cell(p.location),
        cell(p.bio),
        cell(joinList(p.skills)),
        cell(joinList(p.openToRoles)),
        cell(p.layoffDate),
        cell(p.email),
        cell(p.linkedin),
        cell(p.portfolio),
        cell(p.photoUrl),
      ].join("")}</tr>`;
    })
    .join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": 'attachment; filename="exmengantar_profiles.xls"',
    },
  });
}
