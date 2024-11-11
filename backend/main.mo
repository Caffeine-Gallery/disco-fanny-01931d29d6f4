import Bool "mo:base/Bool";
import Error "mo:base/Error";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";

actor {
    // Define the Guest type
    public type Guest = {
        name: Text;
        attending: Bool;
    };

    // Create a stable variable for guests
    private stable var guestEntries : [(Text, Bool)] = [];
    private var guestBuffer = Buffer.Buffer<Guest>(0);

    // System functions for upgrade persistence
    system func preupgrade() {
        guestEntries := Array.map<Guest, (Text, Bool)>(
            Buffer.toArray(guestBuffer),
            func(guest: Guest) : (Text, Bool) {
                (guest.name, guest.attending)
            }
        );
    };

    system func postupgrade() {
        guestBuffer := Buffer.Buffer<Guest>(0);
        for ((name, attending) in guestEntries.vals()) {
            guestBuffer.add({ name = name; attending = attending; });
        };
        guestEntries := [];
    };

    // Add a new guest
    public shared func addGuest(name: Text, attending: Bool) : async Result.Result<Text, Text> {
        if (Text.size(name) == 0) {
            return #err("Name cannot be empty");
        };

        try {
            let newGuest : Guest = {
                name = name;
                attending = attending;
            };
            
            guestBuffer.add(newGuest);
            #ok("Guest successfully added")
        } catch (e) {
            #err("Failed to add guest: " # Error.message(e))
        }
    };

    // Get all guests
    public query func getGuests() : async [Guest] {
        Buffer.toArray(guestBuffer)
    };
}
