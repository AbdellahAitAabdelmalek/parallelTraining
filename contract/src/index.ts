import { initContract } from "@ts-rest/core";
import { cim10Contract } from "./cim10";
import { usersContract } from "./users";

const c = initContract();

export const contract = c.router({
  cim10: cim10Contract,
  users: usersContract,
});

export * from "./cim10";
export * from "./users";
