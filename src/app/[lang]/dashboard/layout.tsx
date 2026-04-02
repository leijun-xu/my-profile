import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDictionary } from "@/dictionaries";

export default async function DashboardRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <DashboardLayout dict={dict} lang={lang}>{children}</DashboardLayout>;
}
