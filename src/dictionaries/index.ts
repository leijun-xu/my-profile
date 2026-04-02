export type Dictionary = {
  file: {
    loadingText: string
    headTitle: string
    headDesc: string
    deleteConfirmText: string
    contentTitle: string
    contentDragText: string
    contentOr: string
    contentSelectBtn: string
    contentSelectDesc: string
    uploadFileStatusComplete: string
    uploadFileStatusFailed: string
    uploadFileStatusUploading: string
    uploadFileStatusPaused: string
    uploadFileStatusWaiting: string
    uploadBtnStart: string
    uploadBtnPause: string
    uploadBtnContinue: string
    uploadBtnRetry: string
    uploadBtnCancel: string
    computeMd5: string
    slice: string
    download: string
    downloading: string
    delete: string
    serverFiles: string
    loadingBtnText: string
    loadingBtnReflashText: string
    nofiles: string
  }
  setting: {
    headTitle: string
    headDesc: string
    profile: string
    username: string
    usernamePlaceholder: string
    email: string
    emailPlaceholder: string
    bio: string
    bioPlaceholder: string
    saveBtnText: string
  }
  webgis: {
    title: string
    datasource: string
  }
  dashboard: {
    filesTotal: string
    saveArea: string
    thisMounthUpload: string
    resumeView: string
    navigationDashboard: string
    navigationFiles: string
    navigationSetting: string
    navigationWebgis: string
    navigationResume: string
    myworkspace: string
    unlogin: string
    logout: string
  }
}

export type { ResumeDataType as ResumeData } from "@/dictionaries/prompt/zh"

export const locales = ["en", "zh"] // 支持的语言
export const defaultLocale = "zh"

export function getDictionary(locale: string): Promise<Dictionary> {
  return import(`./${locale}.json`).then((module) => module.default)
}

export function getPrompt(locale: string): Promise<{
  resumeData: typeof import("@/dictionaries/prompt/zh").resumeData
  systemPrompt: string
}> {
  if (locale === "en") {
    return import("@/dictionaries/prompt/en")
  }
  return import("@/dictionaries/prompt/zh")
}
