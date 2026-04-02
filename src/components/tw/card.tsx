import Image from "next/image"
import Link from "next/link"
import { Eye } from "lucide-react"

interface ICardProps {
  gif: string
  title: string
  description: string
  href: string
  onImgClick?: (gif: string) => void
}
export default function page({
  gif,
  title,
  description,
  href,
  onImgClick,
}: ICardProps) {
  return (
    <>
      <div className="relative flex w-full max-w-104 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg">
        <div
          className="bg-blue-gray-500 shadow-blue-gray-500/40 relative mx-4 mt-4 aspect-5/3 overflow-hidden rounded-xl bg-clip-border text-white shadow-lg"
          onClick={() => {
            if (onImgClick && typeof onImgClick === "function") onImgClick(gif)
          }}
        >
          <Image
            src={gif}
            alt={title}
            width={500}
            height={300}
            className="h-full w-full cursor-pointer object-cover"
          />
          <div className="to-bg-black-10 pointer-events-none absolute inset-0 h-full w-full bg-linear-to-tr from-transparent via-transparent to-black/60"></div>
          <div className="absolute top-2 right-2 rounded-full bg-black/50 p-2 backdrop-blur-sm">
            <Eye className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h5 className="text-blue-gray-900 block font-sans text-xl leading-snug font-medium tracking-normal antialiased">
              {title}
            </h5>
            <p className="text-blue-gray-900 flex items-center gap-1.5 font-sans text-base leading-relaxed font-normal antialiased">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="-mt-0.5 h-5 w-5 text-yellow-700"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                ></path>
              </svg>
              5.0
            </p>
          </div>
          <div
            className="block h-50 overflow-y-auto font-sans text-base leading-relaxed font-light text-gray-700 antialiased select-none"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>
        <div className="p-6 pt-3">
          <Link href={href}>
            <button
              className="block w-full cursor-pointer rounded-lg bg-pink-500 px-7 py-3.5 text-center align-middle font-sans text-sm font-bold text-white uppercase shadow-md shadow-pink-500/20 transition-all select-none hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              data-ripple-light="true"
            >
              Review
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
