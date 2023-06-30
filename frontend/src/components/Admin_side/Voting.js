import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { VStack, Text, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const Voting = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, provider);
          const proposals = [];

  

          setProposals(proposals);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const closeVoting = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, signer);

        const transaction = await contract.endVotingSession();
        await transaction.wait();

        console.log('Voting session closed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <VStack spacing={4}>
      <Button onClick={closeVoting}>Close Voting</Button>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Proposal</Th>
            <Th>Votes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {proposals.map((proposal, index) => (
            <Tr key={index}>
              <Td>{proposal.description}</Td>
              <Td>{proposal.voteCount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default Voting;