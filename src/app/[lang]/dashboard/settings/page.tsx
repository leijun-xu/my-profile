import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDictionary } from "@/dictionaries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const session = await getServerSession(authOptions)
  const s = dict.setting

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{s.headTitle}</h1>
        <p className="mt-1 text-gray-600">{s.headDesc}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{s.profile}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {s.username}
            </label>
            <Input
              type="text"
              defaultValue={session?.user?.name || ""}
              placeholder={s.usernamePlaceholder}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {s.email}
            </label>
            <Input
              type="email"
              defaultValue={session?.user?.email || ""}
              placeholder={s.emailPlaceholder}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {s.bio}
            </label>
            <Input type="text" placeholder={s.bioPlaceholder} />
          </div>
          <Button>{s.saveBtnText}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
