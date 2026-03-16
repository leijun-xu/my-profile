'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Bot } from "lucide-react";
import AIChat from "@/components/ai/ai-chat";

export default function Page() {
  return (

    <div className="relative text-gray-800 bg-gray-50">
      <header>
        <nav className="w-full">
          <div className="flex justify-end w-full px-16 py-8">
            <div>
              <ul className="flex flex-col md:flex-row items-end md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <li>
                  <a href="https://github.com/leijun-xu/my-profile" target="_blank" aria-label="Github"
                    className="hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="currentColor"
                      viewBox="0 0 16 16">
                      <path
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                  </a>
                </li>


                {/* <li>
                  <Link href={'/ai'} className="hover:text-blue-600 group">
                    <Bot className="w-9 h-9 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-x-0.5 group-hover:translate-x-0" />
                  </Link>
                </li> */}
                <li>
                  <Button onClick={e => signOut({ callbackUrl: '/auth/signin' })}><LogOut /> Sign out</Button>
                </li>


              </ul>
            </div>
          </div>
        </nav>
      </header>
      <AIChat />
      <section className="flex flex-col items-center justify-center h-screen  -my-20 md:-mt-48 px-8">
        <div className="flex flex-col items-center justify-center text-center h-screen-half">
          <h2 className="text-lg sm:text-sm lg:text-lg">Xu Leijun</h2>
          <h2 className="font-light text-lg sm:text-sm lg:text-lg">Business Manager</h2>
        </div>
      </section>
      <section className="flex items-center justify-between px-8 mb-20 tracking-wider">
        <div className="flex flex-col w-full md:w-1/3 space-y-12 text-center md:text-left">
          <div className="flex flex-col px-10 md:px-20">
            <h3 className="text-xl font-bold">Skills</h3>
            <br />
            <span className="text-lg">Management</span>
            <span className="text-lg">Collaboration</span>
            <span className="text-lg">Communication</span>
            <span className="text-lg">Microsoft Office</span>
          </div>
          <div className="px-10 md:px-20">
            <h3 className="text-xl font-bold">Summary</h3>
            <br />
            <p className="w-full md:w-2/3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius eaque delectus
              consequuntur harum doloremque assumenda omnis quibusdam quia neque, adipisci iste laborum sed
              nostrum.</p>
          </div>
          <div className="px-10 md:px-20">
            <br />
            <h3 className="text-xl font-bold">Contact</h3>
            <a className="text-xl hover:text-blue-600" href="mailto:test@nomail.com">test@email.com</a>
            <p>675 234 4323</p>
          </div>
        </div>

        <div className="hidden md:flex flex-col w-1/3 space-y-12 text-right">
          <div className="px-20">
            <h4 className="text-xl font-bold">Experience</h4>
            <br />
            <p className="text-6xl">+2</p>
          </div>
          <div className="px-20">
            <h4 className="text-xl font-bold">Projects</h4>
            <br />
            <p className="text-6xl">+25</p>
          </div>
          <div className="px-20">
            <h4 className="text-xl font-bold">Clients</h4>
            <br />
            <p className="text-6xl">+14</p>
          </div>
        </div>
      </section>
      <hr className="border-gray-400 mx-44" />
      <section className="px-20 mt-10">
        <h4 className="mb-8 text-3xl font-bold text-center md:text-left">Experience</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl font-bold">Full Stack Developer</h5>
            <h6 className="text-lg font-bold">Facebook</h6>
            <p>Jan 2015 - present</p>
          </div>
          <div className="flex flex-col col-span-4">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eveniet deleniti tempore veritatis
              adipisci accusantium voluptatibus vel aperiam ex alias officiis deserunt, ad, iste id cum minus sit
              laudantium ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi non incidunt
              voluptates molestiae delectus nulla quisquam aperiam voluptas tempora distinctio! Ipsa cupiditate
              harum voluptates praesentium. Suscipit itaque officiis odio ut!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl  font-bold">Software Developer</h5>
            <h6 className="text-lg font-bold">Google</h6>
            <p>Feb 2010 - Jan 2015</p>
          </div>
          <div className="flex flex-col col-span-4">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eveniet deleniti tempore veritatis
              adipisci accusantium voluptatibus vel aperiam ex alias officiis deserunt, ad, iste id cum minus sit
              laudantium ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi non incidunt
              voluptates molestiae delectus nulla quisquam aperiam voluptas tempora distinctio! Ipsa cupiditate
              harum voluptates praesentium. Suscipit itaque officiis odio ut!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl  font-bold">Web Developer</h5>
            <h6 className="text-lg font-bold">IBM</h6>
            <p>Apr 2008 - Feb 2010</p>
          </div>
          <div className="flex flex-col col-span-4">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eveniet deleniti tempore veritatis
              adipisci accusantium voluptatibus vel aperiam ex alias officiis deserunt, ad, iste id cum minus sit
              laudantium ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi non incidunt
              voluptates molestiae delectus nulla quisquam aperiam voluptas tempora distinctio! Ipsa cupiditate
              harum voluptates praesentium. Suscipit itaque officiis odio ut!</p>
          </div>
        </div>
      </section>
      <hr className="border-gray-400 mx-44" />
      <section className="px-20 mt-10">
        <h4 className="mb-8 text-3xl font-bold text-center md:text-left">Education</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 my-10">
          <div className="flex flex-col col-span-2 mb-4 md:mb-0">
            <h5 className="text-xl md:text-2xl  font-bold">B.S. Computer Science</h5>
            <h6 className="text-lg font-bold">Harward University</h6>
            <p>Jan 2015 - present</p>
          </div>
          <div className="flex flex-col col-span-4 ">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eveniet deleniti tempore veritatis
              adipisci accusantium voluptatibus vel aperiam ex alias officiis deserunt, ad, iste id cum minus sit
              laudantium ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi non incidunt
              voluptates molestiae delectus nulla quisquam aperiam voluptas tempora distinctio! Ipsa cupiditate
              harum voluptates praesentium. Suscipit itaque officiis odio ut!</p>
          </div>
        </div>
      </section>
      <footer className="absolute w-full h-36 bottom-0 p-8 px-16 bg-gray-800 text-gray-50 z-10">
        <p className="text-2xl">Thank you for checking out my resume</p>
        <a className="text-lg" href="mailto:765285102@qq.com">765285102@qq.com</a>
      </footer>
      <div className="h-80">
      </div>
    </div>
  )
}
