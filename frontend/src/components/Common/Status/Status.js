import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { VStack, Text, Alert, AlertIcon, Flex, Box } from '@chakra-ui/react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const Status = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingContract.abi, provider);
        const status = await contract.workflowStatus();
        setStatus(status);
      }
    };

    fetchStatus();
  }, []);  

  const statusMapping = {
    0: 'Registering Voters',
    1: 'Proposals Registration Started',
    2: 'Proposals Registration Ended',
    3: 'Voting Session Started',
    4: 'Voting Session Ended',
    5: 'Votes Tallied'
  };

  return (
    <Flex justify="center" align="center" direction="column" m="2" p="4">
      <Box p="4">
        <Text fontSize="2xl">Current Workflow Status:</Text>
      </Box>
      <VStack spacing={4} align="center">
        {status !== null ? (
          <Alert status="info">
            <AlertIcon />
            {statusMapping[status]}
          </Alert>
        ) : (
          <Text>Loading...</Text>
        )}
      </VStack>
    </Flex>
  );
};

export default Status;