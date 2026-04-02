import ResumeContentWrapper from "@/components/resume/ResumeContentWrapper";

export default async function ResumeDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const label = lang === "zh" ? "我的简历" : "My Resume";
  const desc =
    lang === "zh"
      ? "查看和管理您的个人信息"
      : "View and manage your profile";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{label}</h1>
        <p className="mt-1 text-gray-600">{desc}</p>
      </div>
      <ResumeContentWrapper />
    </div>
  );
}
