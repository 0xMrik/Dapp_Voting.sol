import React, { useState, useEffect } from 'react';
import { VStack, Text } from '@chakra-ui/react';
import { useContract } from '../../hooks/useContract';

const VoteResult = () => {
    const { contract, error } = useContract();
    const [winningProposalId, setWinningProposalId] = useState(null);

    useEffect(() => {
        const fetchWinningProposalId = async () => {
            if (contract) {
                const winningProposalId = await contract.winningProposalId();
                setWinningProposalId(winningProposalId);
            }
        };
        fetchWinningProposalId();
    }, [contract]);

    if (winningProposalId === null) {
        return <Text>Loading...</Text>;
    }

    return (
        <VStack>
            <Text>The winning proposal ID is {winningProposalId}.</Text>
        </VStack>
    );
};

export default VoteResult;
