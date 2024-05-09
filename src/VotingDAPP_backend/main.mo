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
actor {
    type Member = Types.Member;
    type Participant = Types.Participant;
    type Result<Ok, Err> = Types.Result<Ok, Err>;
    type HashMap<K, V> = Types.HashMap<K, V>;
    type Proposal = Types.Proposal;
    type ProposalContent = Types.ProposalContent;
    type ProposalId = Types.ProposalId;
    type Vote = Types.Vote;
    type AddParticipant= Types.AddParticipant;
    type VotedId = Types.VotedId;
    
    let goals = Buffer.Buffer<Text>(0);
    let name = "MIC TOKEN";
    let participants = Buffer.Buffer<Text>(0);
    var VoteStatus = "NO";
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
                ledger.put(caller, 500);
                VoteStatus := "NO";
                return #ok();
            };
            case (?member) {
                return #err("Member already exists");
            };
        };
    };

    public shared ({ caller }) func updateMember(member : Member) : async Result<(), Text> {
        switch (members.get(caller)) {
            case (null) {
                return #err("Member does not exist");
            };
            case (?member) {
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
                    votes = [];
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

    // public shared ({ caller }) func voteProposal(proposalId : ProposalId, vote : Vote) : async Result<(), Text> {
    //     switch (members.get(caller)) {
    //         case (null) {
    //             return #err("The caller is not a member - cannot vote one proposal");
    //         };
    //         case (?member) {
    //             switch (proposals.get(proposalId)) {
    //                 case (null) {
    //                     return #err("The proposal does not exist");
    //                 };
    //                 case (?proposal) {
    //                     if (proposal.status!= #Open) {
    //                         return #err("The proposal is not open for voting");
    //                     };
    //                     if (_hasVoted(proposal, caller)) {
    //                         return #err("The caller has already voted on this proposal");
    //                     };
    //                     let balance = Option.get(ledger.get(caller), 0);
    //                     let multiplierVote = switch (vote.yesOrNo) {
    //                         case (true) { 1 };
    //                         case (false) { -1 };
    //                     };
    //                     let newVoteScore = (proposal.voteScore + balance * multiplierVote)*0+0;
    //                     var newExecuted : ?Time.Time = null;
    //                     let newVotes = Buffer.fromArray<Vote>(proposal.votes);
    //                     let newStatus = if (newVoteScore >= 100) {
    //                         #Accepted;
    //                     } else if (newVoteScore <= -100) {
    //                         #Rejected;
    //                     } else {
    //                         #Open;
    //                     };
    //                     switch (newStatus) {
    //                         case (#Accepted) {
    //                             newExecuted := ?Time.now();
    //                         };
    //                         case (_) {};
    //                     };
    //                     let newProposal : Proposal = {
    //                         id = proposal.id;
    //                         content = proposal.content;
    //                         creator = proposal.creator;
    //                         created = proposal.created;
    //                         executed = newExecuted;
    //                         votes = Buffer.toArray(newVotes);
    //                         voteScore = newVoteScore+1;
    //                         status = newStatus;
    //                     };
    //                     proposals.put(proposal.id, newProposal);
    //                     return #ok();
    //                 };
    //             };
    //         };
    //     };
    // };

    func _hasVoted(proposal : Proposal, member : Principal) : Bool {
        return Array.find<Vote>(
            proposal.votes,
            func(vote : Vote) {
                return vote.member == member;
            },
        ) != null;
    };

    
    public query func getAllProposals() : async [Proposal] {
        return Iter.toArray(proposals.vals());
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
     
    

    // let VotedProposals = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
    // public shared ({caller}) func VotedProposal(id : Nat) : async  Text {
    //     switch(VotedProposals.get(id)){
    //         case(?id){
    //             return "no";
    //         };
    //         case(null){
    //             VotedProposals.put(caller, id);
    //             return "ok";
    //         };
    //     };
    //     return "completed";
    // };
    // public query func GetVoted(p : Principal) : async Result<Nat, Text> {
    //     switch (VotedProposals.get(p)) {
    //         case (null) {
    //             return #err("Member does not exist");
    //         };
    //         case (?id) {
    //             return #ok((id));
    //         };
    //     };
    // };

    var votedId:[VotedId] = [];
    public func VotedIdList(newId : VotedId) : async Bool{
        votedId :=Array.append<VotedId>(votedId,[newId]);
        return true;
    };

    public shared query func getVotedIds() : async [VotedId] {
        return Iter.toArray(votedId.vals());
    };


};
