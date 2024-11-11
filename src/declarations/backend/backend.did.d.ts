import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Guest { 'name' : string, 'attending' : boolean }
export interface _SERVICE {
  'addGuest' : ActorMethod<[string, boolean], boolean>,
  'getGuests' : ActorMethod<[], Array<Guest>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
