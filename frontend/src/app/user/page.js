"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { VStack, Text, Spinner, Button, Flex, Box } from '@chakra-ui/react';
import Header from '../../components/Common/Header/Header'
import Status from '../../components/Common/Status/Status'
import ProposalsRegistration from '../../components/User_side/ProposalsRegistration';
import Voting from '../../components/User_side/Voting';

const PageUser = () => {
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

    const getComponent = () => {
        switch (status) {
            case 0:
                return <Text>Voters Registration Phase</Text>;
            case 1:
                return <ProposalsRegistration />;
            case 2:
            case 3:
                return <Voting />;
            case 4:
                return <VoteResult />;
            default:
                return <Text>Workflow finished</Text>;
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
            <Box
                m="4"
                p="5"
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                backgroundColor="gray.50"
            >
                {getComponent()}
            </Box>
        </div>
    );
}

export default PageUser;
