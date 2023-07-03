# Contrat de vote

## Structure du contrat
Le contrat est structuré autour de plusieurs structures et énumérations :
- `Voter` : représente un électeur, qui possède un booléen indiquant s'il est inscrit, s'il a déjà voté et l'ID de la proposition pour laquelle il a voté.
- `Proposal` : représente une proposition, qui a une description et un décompte de votes.
- `WorkflowStatus` : une énumération représentant l'état actuel du système de vote.

De plus, le contrat inclut un certain nombre de variables d'état pour suivre le vote en cours, y compris le décompte des votes pour chaque proposition, l'électeur qui a voté pour chaque proposition, et l'état actuel du vote.

## Fonctionnalités du contrat
Le contrat fournit plusieurs fonctions pour gérer le processus de vote :
- `getVoter(address _addr)` : renvoie les détails d'un électeur spécifique.
- `getOneProposal(uint _id)` : renvoie les détails d'une proposition spécifique.
- `addVoter(address _addr)` : enregistre un nouvel électeur.
- `addProposal(string calldata _desc)` : ajoute une nouvelle proposition.
- `setVote( uint _id)` : enregistre le vote d'un électeur pour une proposition spécifique.
- `startProposalsRegistering()` : commence la phase d'enregistrement des propositions.
- `endProposalsRegistering()` : termine la phase d'enregistrement des propositions.
- `startVotingSession()` : commence la phase de vote.
- `endVotingSession()` : termine la phase de vote.
- `tallyVotes()` : compte les votes et détermine la proposition gagnante.

Chaque fonction est protégée par des vérifications appropriées pour s'assurer que le vote est dans l'état correct et que seuls les électeurs inscrits peuvent voter.

## Événements du contrat
Le contrat émet plusieurs événements pour suivre l'évolution du vote :
- `VoterRegistered(address voterAddress)` : un nouvel électeur a été enregistré.
- `WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus)` : le statut du flux de travail a changé.
- `ProposalRegistered(uint proposalId)` : une nouvelle proposition a été enregistrée.
- `Voted (address voter, uint proposalId)` : un électeur a voté pour une proposition.

## Usage du contrat
Pour utiliser le contrat, un utilisateur doit d'abord être ajouté en tant qu'électeur. Une fois inscrit, l'électeur peut proposer des propositions pendant la phase d'enregistrement des propositions. Une fois la phase d'enregistrement terminée, les électeurs peuvent voter pour une proposition pendant la phase de vote. Enfin, une fois la phase de vote terminée, les votes sont comptés et la proposition gagnante est déterminée.

