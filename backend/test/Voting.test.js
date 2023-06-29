const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", function () {
  let Voting;
  let voting;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.connect(owner).deploy();
    await voting.deployed();

    await voting.addVoter(owner.address);
  });

       /*
  ╔══════════════════════════════════════════════════════╗
  ║   === test function addVoter ===                     ║
  ╚══════════════════════════════════════════════════════╝
  */

  describe("addVoter function", function () {
    it("Should register a new voter", async function () {
      await voting.addVoter(addr1.address);
      const votingAsOwner = voting.connect(owner);
      const voter = await votingAsOwner.getVoter(addr1.address);
      expect(voter.isRegistered).to.equal(true);
    });
    
    it("Should emit a VoterRegistered event when a new voter is registered", async function () {
      await expect(voting.addVoter(addr1.address))
        .to.emit(voting, 'VoterRegistered')
        .withArgs(addr1.address);
    });
    
    it("Should revert if the voter is already registered", async function () {
      await voting.addVoter(addr1.address);
      await expect(voting.addVoter(addr1.address)).to.be.revertedWith('Already registered');
    });
  });

       /*
  ╔══════════════════════════════════════════════════════╗
  ║   === test function getVoter ===                     ║
  ╚══════════════════════════════════════════════════════╝
  */

  describe("getVoter function", function () {
    it("Should return the correct voter information", async function () {
      await voting.addVoter(addr1.address);
      const votingAsOwner = voting.connect(owner);
      const voter = await votingAsOwner.getVoter(addr1.address);
      expect(voter.isRegistered).to.equal(true);
      expect(voter.hasVoted).to.equal(false);
      expect(voter.votedProposalId).to.equal(0);
    });

    it("Should revert if the voter is not registered", async function () {
      const votingAsAddr2 = voting.connect(addr2);
      await expect(votingAsAddr2.getVoter(addr2.address)).to.be.revertedWith("You're not a voter");
    });

    it("Should return correct voter information for a voter who has voted", async function () {
      await voting.connect(owner).addVoter(addr1.address);
      await voting.startProposalsRegistering();
      await voting.connect(owner).addProposal("Test proposal");
      await voting.endProposalsRegistering();
      await voting.startVotingSession();
      const votingAsAddr1 = voting.connect(addr1);
      await votingAsAddr1.setVote(0);
      await voting.endVotingSession();
  
      const voter = await voting.getVoter(addr1.address);
  
      expect(voter.isRegistered).to.equal(true);
      expect(voter.hasVoted).to.equal(true);
      expect(voter.votedProposalId).to.equal(0);
    });
  });

         /*
  ╔══════════════════════════════════════════════════════╗
  ║   === test function addProposal ===                  ║
  ╚══════════════════════════════════════════════════════╝
  */

  describe("addProposal function", function () {
    beforeEach(async function () {
      await voting.startProposalsRegistering();
    });

    it("Should revert if the contract is not in ProposalsRegistrationStarted state", async function () {
      await voting.endProposalsRegistering(); 
      await expect(voting.addProposal("Test proposal")).to.be.revertedWith('Proposals are not allowed yet');
    });

    it("Should revert if the caller is not a registered voter", async function () {
      const votingAsAddr2 = voting.connect(addr2);
      await expect(votingAsAddr2.addProposal("Test proposal")).to.be.revertedWith("You're not a voter");
    });
  
    it("Should add a new proposal correctly", async function () {
      await voting.addProposal("Test proposal");
      const proposal = await voting.getOneProposal(1);
      expect(proposal.description).to.equal("Test proposal");
    });
  
    it("Should emit a ProposalRegistered event when a new proposal is added", async function () {
      await expect(voting.addProposal("Test proposal"))
        .to.emit(voting, 'ProposalRegistered')
        .withArgs(1);
    });
  });

       /*
  ╔══════════════════════════════════════════════════════╗
  ║   === test function getOneProposal ===               ║
  ╚══════════════════════════════════════════════════════╝
  */

  describe("getOneProposal function", function () {
    beforeEach(async function () {
      await voting.startProposalsRegistering();
      await voting.addProposal("Test proposal");
    });
  
    it("Should return a proposal correctly", async function () {
      const proposal = await voting.getOneProposal(1);
      expect(proposal.description).to.equal("Test proposal");
    });
  
    it("Should revert if the proposal id is not valid", async function () {
      await expect(voting.getOneProposal(999)).to.be.reverted;
    });
  
    it("Should revert if the caller is not a registered voter", async function () {
      const votingAsAddr2 = voting.connect(addr2);
      await expect(votingAsAddr2.getOneProposal(1)).to.be.revertedWith("You're not a voter");
    });
  });

  /*
╔══════════════════════════════════════════════════════╗
║   === test function setVote ===                      ║
╚══════════════════════════════════════════════════════╝
*/

describe("setVote function", function () {
  beforeEach(async function () {
    await voting.connect(owner).addVoter(addr1.address);
    await voting.startProposalsRegistering();
    
    await voting.connect(owner).addProposal("Test proposal");
    await voting.endProposalsRegistering();
    await voting.startVotingSession();
  });
  

  it("Should set a vote correctly", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await votingAsAddr1.setVote(0);

    const voter = await voting.getVoter(addr1.address);
    expect(voter.hasVoted).to.equal(true);
    expect(voter.votedProposalId).to.equal(0);
  });

  it("Should emit a Voted event when a vote is set", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.setVote(0))
      .to.emit(voting, 'Voted')
      .withArgs(addr1.address, 0);
  });

  it("Should revert if the caller is not a registered voter", async function () {
    const votingAsAddr2 = voting.connect(addr2);
    await expect(votingAsAddr2.setVote(0)).to.be.revertedWith("You're not a voter");
  });

  it("Should revert if the proposal id is not valid", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.setVote(999)).to.be.revertedWith("Proposal not found");
  });

  it("Should revert if the voter has already voted", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await votingAsAddr1.setVote(0);
    await expect(votingAsAddr1.setVote(0)).to.be.revertedWith("You have already voted");
  });
});

  /*
╔══════════════════════════════════════════════════════╗
║   === test function tallyVote ===                    ║
╚══════════════════════════════════════════════════════╝
*/

describe("tallyVotes function", function () {
  beforeEach(async function () {
    await voting.connect(owner).addVoter(addr1.address);
    await voting.connect(owner).addVoter(addr2.address);
    await voting.startProposalsRegistering();
    await voting.connect(owner).addProposal("Test proposal 1");
    await voting.connect(owner).addProposal("Test proposal 2");
    await voting.endProposalsRegistering();
    await voting.startVotingSession();
    await voting.connect(addr1).setVote(1);
    await voting.connect(addr2).setVote(1);
    await voting.endVotingSession();
  });

  it("Should calculate the winning proposal correctly", async function () {
    await voting.tallyVotes();
    const winningProposalID = await voting.winningProposalID();
    expect(winningProposalID).to.equal(1);
  });

  it("Should emit a WorkflowStatusChange event when votes are tallied", async function () {
    await expect(voting.tallyVotes())
      .to.emit(voting, 'WorkflowStatusChange')
      .withArgs(4, 5); 
  });

  it("Should revert if the caller is not the owner", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.tallyVotes()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if the contract status is not VotingSessionEnded", async function () {
    const votingNew = await Voting.connect(owner).deploy();
    await votingNew.deployed();
    await expect(votingNew.tallyVotes()).to.be.revertedWith("Current status is not voting session ended");
  });
});

/*
╔══════════════════════════════════════════════════════╗
║   === test function startProposalsRegistering ===    ║
╚══════════════════════════════════════════════════════╝
*/

describe("startProposalsRegistering function", function () {
  it("Should change the contract state to ProposalsRegistrationStarted", async function () {
    await voting.startProposalsRegistering();
    const status = await voting.workflowStatus();
    expect(status).to.equal(1); 
  });

  it("Should emit a WorkflowStatusChange event", async function () {
    await expect(voting.startProposalsRegistering())
      .to.emit(voting, 'WorkflowStatusChange')
      .withArgs(0, 1);
  });

  it("Should revert if the caller is not the owner", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.startProposalsRegistering()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if the contract status is not RegisteringVoters", async function () {
    await voting.startProposalsRegistering();
    await expect(voting.startProposalsRegistering()).to.be.revertedWith('Registering proposals cant be started now');
  });
});

/*
╔══════════════════════════════════════════════════════╗
║   === test function endProposalsRegistering ===      ║
╚══════════════════════════════════════════════════════╝
*/

describe("endProposalsRegistering function", function () {
  beforeEach(async function () {
    await voting.startProposalsRegistering();
  });

  it("Should change the contract state to ProposalsRegistrationEnded", async function () {
    await voting.endProposalsRegistering();
    const status = await voting.workflowStatus();
    expect(status).to.equal(2); 
  });

  it("Should emit a WorkflowStatusChange event", async function () {
    await expect(voting.endProposalsRegistering())
      .to.emit(voting, 'WorkflowStatusChange')
      .withArgs(1, 2);
  });

  it("Should revert if the caller is not the owner", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.endProposalsRegistering()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if the contract status is not ProposalsRegistrationStarted", async function () {
    await voting.endProposalsRegistering();
    await expect(voting.endProposalsRegistering()).to.be.revertedWith('Registering proposals havent started yet');
  });
});

/*
╔══════════════════════════════════════════════════════╗
║   === test function startVotingSession ===           ║
╚══════════════════════════════════════════════════════╝
*/

describe("startVotingSession function", function () {
  beforeEach(async function () {
    await voting.startProposalsRegistering();
    await voting.endProposalsRegistering();
  });

  it("Should change the contract state to VotingSessionStarted", async function () {
    await voting.startVotingSession();
    const status = await voting.workflowStatus();
    expect(status).to.equal(3); 
  });

  it("Should emit a WorkflowStatusChange event", async function () {
    await expect(voting.startVotingSession())
      .to.emit(voting, 'WorkflowStatusChange')
      .withArgs(2, 3); 
  });

  it("Should revert if the caller is not the owner", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.startVotingSession()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if the contract status is not ProposalsRegistrationEnded", async function () {
    await voting.startVotingSession();
    await expect(voting.startVotingSession()).to.be.revertedWith('Registering proposals phase is not finished');
});
});

/*
╔══════════════════════════════════════════════════════╗
║   === test function endVotingSession ===             ║
╚══════════════════════════════════════════════════════╝
*/

describe("endVotingSession function", function () {
  beforeEach(async function () {
    await voting.startProposalsRegistering();
    await voting.endProposalsRegistering();
    await voting.startVotingSession();
  });

  it("Should change the contract state to VotingSessionEnded", async function () {
    await voting.endVotingSession();
    const status = await voting.workflowStatus();
    expect(status).to.equal(4); 
  });

  it("Should emit a WorkflowStatusChange event", async function () {
    await expect(voting.endVotingSession())
      .to.emit(voting, 'WorkflowStatusChange')
      .withArgs(3, 4); 
  });

  it("Should revert if the caller is not the owner", async function () {
    const votingAsAddr1 = voting.connect(addr1);
    await expect(votingAsAddr1.endVotingSession()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if the contract status is not VotingSessionStarted", async function () {
    await voting.endVotingSession();
    await expect(voting.endVotingSession()).to.be.revertedWith('Voting session havent started yet');
  });
});

})

