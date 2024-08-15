import {Role} from "./Role.ts";

export type User = {
    id: string;
    username: string;
    password: string;
    role: Role;
    familyId: string;
}