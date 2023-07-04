import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { VStack, Text, Alert, AlertIcon, Flex, Box, Button } from '@chakra-ui/react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const VoteResult = () => {
  const [winningProposal, setWinningProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinningProposal = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingContract.abi, signer);
            const workflowStatus = await contract.workflowStatus();
            if (workflowStatus === 5) { // Check if workflow status is VotesTallied
              const winningProposalID = await contract.winningProposalID();
              const proposal = await contract.getOneProposal(winningProposalID);
              setWinningProposal(proposal.description);
            }
            setLoading(false);
        }
    }

    fetchWinningProposal().catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);    

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

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
          <Text>No winning proposal yet.</Text>
        )}
      </VStack>
    </Flex>
  );
};

export default VoteResult;