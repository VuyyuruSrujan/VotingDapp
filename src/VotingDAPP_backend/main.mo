import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Types "types";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
actor {
    type Member = Types.Member;
    type Participant = Types.Participant;
    type Result<Ok, Err> = Types.Result<Ok, Err>;
    type HashMap<K, V> = Types.HashMap<K, V>;
    type Proposal = Types.Proposal;
    type ProposalContent = Types.ProposalContent;
    type ProposalId = Types.ProposalId;
    type AddParticipant= Types.AddParticipant;
    type VotedData = Types.VotedData;
    type FinalResult = Types.FinalResult;

    let goals = Buffer.Buffer<Text>(0);
    let name = "MIC TOKEN";
    let participants = Buffer.Buffer<Text>(0);
    public shared query func getName() : async Text {
        return name;
    };

    
    public func addGoal(newGoal : Text) : async () {
        goals.add(newGoal);
        return;
    };

    public shared query func getGoals() : async [Text] {
        Buffer.toArray(goals);
    };


    let members = HashMap.HashMap<Principal, Member>(0, Principal.equal, Principal.hash);
    
    public shared ({ caller }) func addMember(member : Member) : async Result<(), Text> {
        switch (members.get(caller)) {
            case (null) {
                members.put(caller, member);
                ledger.put(caller, 100);
                return #ok();
            };
            case (?member) {
                return #err("Member already exists");
            };
        };
    };
    

    public shared ({ caller }) func updateMember(member : Member) : async Result<(), Text> {
        var isExist = members.get(caller);
        switch (isExist) {
            case (null) {
                return #err("Member does not exist");
            };
            case (?isExist) {
                members.put(caller, member);
                return #ok();
            };
        };
    };

    public shared ({ caller }) func removeMember() : async Result<(), Text> {
        switch (members.get(caller)) {
            case (null) {
                return #err("Member does not exist");
            };
            case (?member) {
                members.delete(caller);
                return #ok();
            };
        };
    };

    public query func getMember(p : Principal) : async Result<Member, Text> {
        switch (members.get(p)) {
            case (null) {
                return #err("Member does not exist");
            };
            case (?member) {
                return #ok((member));
            };
        };
    };


    public query func getAllMembers() : async [Member] {
        return Iter.toArray(members.vals());
    };

    public query func numberOfMembers() : async Nat {
        return members.size();
    };

    
    let ledger = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);

    public query func tokenName() : async Text {
        return "MIC Token";
    };

    public query func tokenSymbol() : async Text {
        return "MIC";
    };

    public func mint(owner : Principal, amount : Nat) : async Result<(), Text> {
        let balance = Option.get(ledger.get(owner), 0);
        ledger.put(owner, balance + amount);
        return #ok();
    };

    public func burn(owner : Principal, amount : Nat) : async Result<(), Text> {
        let balance = Option.get(ledger.get(owner), 0);
        if (balance < amount) {
            return #err("Insufficient balance to burn");
        };
        ledger.put(owner, balance - amount);
        return #ok();
    };

    func _burn(owner : Principal, amount : Nat) : () {
        let balance = Option.get(ledger.get(owner), 0);
        ledger.put(owner, balance - amount);
        return;
    };

    public shared ({ caller }) func transfer(from : Principal, to : Principal, amount : Nat) : async Result<(), Text> {
        let balanceFrom = Option.get(ledger.get(from), 0);
        let balanceTo = Option.get(ledger.get(to), 0);
        if (balanceFrom < amount) {
            return #err("Insufficient balance to transfer");
        };
        ledger.put(from, balanceFrom - amount);
        ledger.put(to, balanceTo + amount);
        return #ok();
    };

    public query func balanceOf(owner : Principal) : async Nat {
        return (Option.get(ledger.get(owner), 0));
    };

    public query func totalSupply() : async Nat {
        var total = 0;
        for (balance in ledger.vals()) {
            total += balance;
        };
        return total;
    };
    
    var nextProposalId : Nat64 = 0;
    let proposals = HashMap.HashMap<ProposalId, Proposal>(0, Nat64.equal, Nat64.toNat32);

    public shared ({ caller }) func createProposal(content : ProposalContent) : async Result<ProposalId, Text> {
        switch (members.get(caller)) {
            case (null) {
                return #err("The caller is not a member - cannot create a proposal");
            };
            case (?member) {
                let balance = Option.get(ledger.get(caller), 0);
                if (balance < 1) {
                    return #err("The caller does not have enough tokens to create a proposal");
                };
                // Create the proposal and burn the tokens
                let proposal : Proposal = {
                    id = nextProposalId;
                    content = content;
                    creator = caller;
                    created = Time.now();
                    executed = null;
                    voteScore = 0;
                    status = #Open;
                };
                proposals.put(nextProposalId, proposal);
                nextProposalId += 1;
                _burn(caller, 1);
                return #ok(nextProposalId - 1);
            };
        };
    };

    public query func getProposal(proposalId : ProposalId) : async ?Proposal {
        return proposals.get(proposalId);
    };

    public query func getAllProposals() : async [Proposal] {
        return Iter.toArray(proposals.vals());
    };

    public query func getProposalsByPrincipal(caller:Principal): async [Proposal] {
        return Iter.toArray(
            Iter.filter<Proposal>(
                proposals.vals(),
                func (proposal: Proposal): Bool {
                    proposal.creator == ?(caller)
                }
            )
        );
    };

    var addparticipant:[AddParticipant] =[];

    public func AddParticipant(newPart : AddParticipant) : async Bool{
        addparticipant :=Array.append<AddParticipant>(addparticipant,[newPart]);
        return true;
    };

    public shared query func getParticipants() : async [AddParticipant] {
        return Iter.toArray(addparticipant.vals());
    };

    public shared query func getParticipantsById(proposalid:Text) : async ?AddParticipant {
        return Array.find<AddParticipant>(addparticipant, func x = x.proposalid == proposalid);
    };

    /////////////////////Voting verification
    public shared ({ caller }) func GetPrincipal() : async Principal {
        return caller;
    };
    
    var votedvotes:[VotedData] = [];
    
    public func VotedList(voteddata : VotedData) : async Bool{
        votedvotes :=Array.append<VotedData>(votedvotes,[voteddata]);
        return true;
    };
     
     public shared query func GetVotedListByPrincipal(caller:Principal) : async [VotedData] {
        return Array.filter<VotedData>(votedvotes, func x = x.caller == caller);
    };
      
    var finalResult:[FinalResult] = [];

    public func finalRes(names : FinalResult) : async Bool{
        finalResult :=Array.append<FinalResult>(finalResult,[names]);
        return true;
    };

     public shared query func GetresultByProposalId(votingProposalId:Nat64) : async [FinalResult] {
        return Array.filter<FinalResult>(finalResult, func x = x.votingProposalId == votingProposalId);
    };

 };

