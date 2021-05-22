export interface Contact {
    id: number;
    name: string;
    email: string;
}
export interface Groups {
    id: number,
    name: string,
    email: string
}

var id = 0;

// NOTE: Names generated using https://blog.reedsy.com/character-name-generator/language/english/
export var contacts: Contact[] = [
    {
        id: ++id,
        name: "role1",
        email: "jillian.poe@example.com"
    },
    {
        id: ++id,
        name: "role2",
        email: "jordan.wheatly@example.com"
    },
    {
        id: ++id,
        name: "role3",
        email: "thelma.wolfe@example.com"
    },
    {
        id: ++id,
        name: "role4",
        email: "mandy.burton@example.com"
    },
    {
        id: ++id,
        name: "role5",
        email: "carly.alvarez@example.com"
    },
    {
        id: ++id,
        name: "role6",
        email: "sebastian.aguilar@example.com"
    },
];

export let groups: Groups[] = [
    {
        id: 1,
        name: "group1",
        email: "jillian.poe@example.com"
    },
    {
        id: 2,
        name: "group2",
        email: "jordan.wheatly@example.com"
    },
    {
        id: 3,
        name: "group3",
        email: "thelma.wolfe@example.com"
    },
    {
        id: 4,
        name: "group4",
        email: "mandy.burton@example.com"
    },
    {
        id: 5,
        name: "group5",
        email: "carly.alvarez@example.com"
    },
    {
        id: 6,
        name: "group6",
        email: "sebastian.aguilar@example.com"
    },
];