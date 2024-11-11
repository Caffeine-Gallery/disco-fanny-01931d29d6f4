import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Guest {
  'principal' : Principal,
  'name' : string,
  'attending' : boolean,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'addGuest' : ActorMethod<[string, boolean], Result>,
  'getGuests' : ActorMethod<[], Array<Guest>>,
  'isAuthenticated' : ActorMethod<[Principal], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
