import { atom } from "jotai";

type User = {
    email: string,
    firstName: string,
    lastName: string
}

const initUser: User = {
    email: '',
    firstName: '',
    lastName: ''
}

export const useAtom = atom(initUser)