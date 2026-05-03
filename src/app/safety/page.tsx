import { redirect } from "next/navigation";

export default function SafetyRedirectPage() {
  redirect("/how-it-works");
}
