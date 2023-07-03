import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { VStack, Text, Alert, AlertIcon, Flex, Box, Button } from '@chakra-ui/react';

const VoteResult = () => {
  const [winningProposal, setWinningProposal] = useState(null);

  useEffect(() => {
    const tallyVotes = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, signer);
            await contract.tallyVotes();
            const winningProposalID = await contract.winningProposalID();
            const proposal = await contract.getOneProposal(winningProposalID);
            setWinningProposal(proposal.description);
        }
    }

    tallyVotes();
  }, []);  

  return (
    <Flex justify="center" align="center" direction="column" m="2" p="4">
      <Box p="4">
        <Text fontSize="2xl">Winning Proposal:</Text>
      </Box>
      <VStack spacing={4} align="center">
        {winningProposal !== null ? (
          <Alert status="info">
            <AlertIcon />
            {winningProposal}
          </Alert>
        ) : (
          <Text>Loading...</Text>
        )}
      </VStack>
    </Flex>
  );
};

export default VoteResult;