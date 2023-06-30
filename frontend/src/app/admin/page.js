"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import RegisterVoter from '../../components/Admin_side/registerVoter';
import ProposalsRegistration from '../../components/Admin_side/ProposalsRegistration';
import Voting from '../../components/Admin_side/Voting';
import Header from '../../components/Common/Header/Header';
import Status from '../../components/Common/Status/Status';
import { VStack, Text, Spinner, Button, Flex, Divider, Box } from '@chakra-ui/react';

const Page = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, provider);
          const status = await contract.workflowStatus();

          setStatus(status);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const advanceWorkflow = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, signer);

      let transaction;
      switch (status) {
        case 0:
          transaction = await contract.startProposalsRegistering();
          break;
        case 1:
          transaction = await contract.endProposalsRegistering();
          break;
        case 2:
          transaction = await contract.startVotingSession();
          break;
        case 3:
          transaction = await contract.endVotingSession();
          break;
        case 4:
          transaction = await contract.tallyVotes();
          break;
        default:
          console.log("The workflow is already finished.");
      }

      if (transaction) {
        await transaction.wait();
        setStatus(status + 1);
      }
    }
  };

  let component;
  
  switch (status) {
    case 0:
      component = <RegisterVoter />;
      break;
    case 1:
      component = <ProposalsRegistration />;
      break;
    case 2:
    case 3:
      component = <Voting />;
      break;
    default:
      component = <Text>Workflow finished</Text>;
  }

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <div>
      <Header />
      <Status />
      <Flex justifyContent="center" mt="4" p="2" >
        <Button colorScheme="green" onClick={advanceWorkflow}>Advance Workflow</Button>
      </Flex>
      <Box 
        m="4" 
        p="5" 
        borderWidth="1px" 
        borderRadius="lg" 
        boxShadow="md" 
        backgroundColor="gray.50"
      >
      {component}
      </Box>
    </div>
  );
}

export default Page;