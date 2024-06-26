import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Nat64 "mo:base/Nat64";
module {
  
  public type Result<Ok, Err> = Result.Result<Ok, Err>;
  public type HashMap<Ok, Err> = HashMap.HashMap<Ok, Err>;
  public type Member = {
    name : Text;
    age : Nat;
    mail:Text;
    creator:Principal;
  };

public type savePrin = {
    caller : Principal;
};
public type VotedData = {
  caller:Principal;
  Id:Nat64;
};
  public type Participant = {
    Pname:Text;
  };
  
  public type ProposalId = Nat64;
  public type ProposalContent = {
    AddGoal : Text;
    creator:Principal;
  };

  public type AddParticipant = {
    Addpart:[Text];
    proposalid:Text;
  };

  public type ProposalStatus = {
    #Open;
    #Accepted;
    #Rejected;
  };

  public type FinalResult = {
    votingProposalId:Nat64;
    VotedName:Text;
  };
  
  public type Proposal = {
    id : Nat64; // The id of the proposal
    content : ProposalContent; // The content of the proposal
    creator : Principal; // The member who created the proposal
    created : Time.Time; // The time the proposal was created
    executed : ?Time.Time; // The time the proposal was executed or null if not executed
    // votes : [Vote]; // The votes on the proposal so far
    voteScore : Int; // A score based on the votes
    status : ProposalStatus; // The current status of the proposal
  };


};