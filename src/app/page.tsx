// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // This immediately sends anyone hitting the base URL (/) to the login page
  redirect("/login");
}
