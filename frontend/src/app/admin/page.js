"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import RegisterVoter from '../../components/Admin_side/registerVoter';
import ProposalsRegistration from '../../components/Admin_side/ProposalsRegistration';
import Voting from '../../components/Admin_side/Voting';
import Header from '../../components/Common/Header/Header';
import Status from '../../components/Common/Status/Status';
import VoteResult from '../../components/Common/Result/VoteResult';
import { Text, Spinner, Button, Flex, Box } from '@chakra-ui/react';
import Link from 'next/link';

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

  async function advanceWorkflow() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        VotingContract.abi,
        signer
      );
  
      let transaction;
      if (status < 5) {
        switch (status) {
          case 0: // WorkflowStatus.RegisteringVoters
            transaction = await contract.startProposalsRegistering();
            break;
          case 1: // WorkflowStatus.ProposalsRegistrationStarted
            transaction = await contract.endProposalsRegistering();
            break;
          case 2: // WorkflowStatus.ProposalsRegistrationEnded
            if (await contract.workflowStatus() === 2) {
              transaction = await contract.startVotingSession();
            }
            break;
          case 3: // WorkflowStatus.VotingSessionStarted
            transaction = await contract.endVotingSession();
            break;
          case 4: // WorkflowStatus.VotingSessionEnded
            if (await contract.workflowStatus() === 4) {
              transaction = await contract.tallyVotes();
            }
            break;
          default:
            console.log('The workflow is already finished.');
            break;
        }
      }
  
      if (transaction) {
        await transaction.wait();
        setStatus((prevStatus) => prevStatus + 1);
      }
    }
  }

  const getComponent = () => {
    switch (status) {
      case 0: // WorkflowStatus.RegisteringVoters
        return <RegisterVoter advanceWorkflow={advanceWorkflow} />;
      case 1: // WorkflowStatus.ProposalsRegistrationStarted
      case 2: // WorkflowStatus.ProposalsRegistrationEnded
        return <ProposalsRegistration advanceWorkflow={advanceWorkflow} />;
      case 3: // WorkflowStatus.VotingSessionStarted
      case 4: // WorkflowStatus.VotingSessionEnded
        return <Voting advanceWorkflow={advanceWorkflow} />;
      case 5: // WorkflowStatus.VotesTallied
        return <VoteResult />;
      default:
        return (
          <div>
            <Text>Workflow finished</Text>
            <Link href="/">
              <Button colorScheme="blue" mt={4}>
                Go Back
              </Button>
            </Link>
          </div>
        );
    }
  };

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
      <Flex justifyContent="center" mt="4" p="2">
        <Button colorScheme="green" onClick={advanceWorkflow}>
          Advance Workflow
        </Button>
      </Flex>
      <Box m="4" p="5" borderWidth="1px" borderRadius="lg" boxShadow="md" backgroundColor="gray.50">
        {getComponent()}
      </Box>
    </div>
  );
};

export default Page;