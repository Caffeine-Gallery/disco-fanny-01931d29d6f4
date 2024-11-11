import Bool "mo:base/Bool";
import Error "mo:base/Error";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

actor {
    public type Guest = {
        name: Text;
        attending: Bool;
        principal: Principal;
    };

    private stable var guestEntries : [(Text, Bool, Principal)] = [];
    private var guestBuffer = Buffer.Buffer<Guest>(0);

    system func preupgrade() {
        guestEntries := Array.map<Guest, (Text, Bool, Principal)>(
            Buffer.toArray(guestBuffer),
            func(guest: Guest) : (Text, Bool, Principal) {
                (guest.name, guest.attending, guest.principal)
            }
        );
    };

    system func postupgrade() {
        guestBuffer := Buffer.Buffer<Guest>(0);
        for ((name, attending, principal) in guestEntries.vals()) {
            guestBuffer.add({ name; attending; principal; });
        };
        guestEntries := [];
    };

    public shared(msg) func addGuest(name: Text, attending: Bool) : async Result.Result<Text, Text> {
        if (Text.size(name) == 0) {
            return #err("Name cannot be empty");
        };

        if (Principal.isAnonymous(msg.caller)) {
            return #err("Please connect your wallet first");
        };

        try {
            let newGuest : Guest = {
                name = name;
                attending = attending;
                principal = msg.caller;
            };
            
            guestBuffer.add(newGuest);
            #ok("Guest successfully added")
        } catch (e) {
            #err("Failed to add guest: " # Error.message(e))
        }
    };

    public query func getGuests() : async [Guest] {
        Buffer.toArray(guestBuffer)
    };

    public query func isAuthenticated(p : Principal) : async Bool {
        not Principal.isAnonymous(p)
    };
}
