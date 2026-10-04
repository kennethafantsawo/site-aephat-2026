import type { Metadata } from "next";
import AdminCmsClient from "./AdminCmsClient";

export const metadata: Metadata = {
  title: "Administration du contenu — AEPHAT",
  description: "Panneau Decap CMS : publications, santé, bureau, images, sondages et membres.",
  robots: { index: false, follow: false },
};

export default function AdminCmsPage() {
  return <AdminCmsClient />;
}
