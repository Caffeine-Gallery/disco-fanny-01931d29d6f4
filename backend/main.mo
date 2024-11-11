import Bool "mo:base/Bool";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";

actor {
  // Define the Guest type
  public type Guest = {
    name: Text;
    attending: Bool;
  };

  // Stable variable to store guests
  private stable var guestList : [Guest] = [];
  
  // Add a new guest
  public shared func addGuest(name: Text, attending: Bool) : async Bool {
    let newGuest : Guest = {
      name = name;
      attending = attending;
    };
    
    let buffer = Buffer.fromArray<Guest>(guestList);
    buffer.add(newGuest);
    guestList := Buffer.toArray(buffer);
    return true;
  };

  // Get all guests
  public query func getGuests() : async [Guest] {
    return guestList;
  };
}
