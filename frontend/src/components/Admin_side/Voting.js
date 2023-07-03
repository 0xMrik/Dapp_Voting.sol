import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { VStack, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import {useContract} from '../../hooks/useContract';

const Voting = () => {
  const contract = useContract();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (contract) {
          const proposalCount = await contract.proposalsArray.length;
          const proposals = [];
          
          for (let i = 0; i < proposalCount; i++) {
            const proposal = await contract.getOneProposal(i);
            proposals.push(proposal);
          }

          setProposals(proposals);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [contract]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <VStack spacing={4}>
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
              <Td>{proposal.voteCount.toString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default Voting;