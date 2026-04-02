import { getDictionary } from "@/dictionaries"
import FilesContentWrapper from "@/components/files/FilesContentWrapper"

export default async function FilesDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {dict.file.headTitle}
        </h1>
        <p className="mt-1 text-gray-600">{dict.file.headDesc}</p>
      </div>
      <FilesContentWrapper dict={dict} />
    </div>
  )
}
