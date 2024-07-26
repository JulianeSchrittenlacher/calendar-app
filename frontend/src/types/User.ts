import {Role} from "./Role.ts";

export type User = {
    id: string;
    name: string;
    role: Role;
    familyId: string;
}