import React, { useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { Button, Input, VStack, useToast } from '@chakra-ui/react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const ProposalsRegistration = () => {
    const [description, setDescription] = useState('');
    const toast = useToast();

    const addProposal = async () => {
        try {
            if (!description) {
                toast({
                    title: 'Erreur',
                    description: 'Veuillez entrer une description pour votre proposition.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingContract.abi, signer);
                const transaction = await contract.addProposal(description);
                await transaction.wait();
                toast({
                    title: 'Succès',
                    description: `Proposition '${description}' enregistrée.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setDescription(''); // Clear the input field
            }
        } catch (err) {
            console.error(err);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de l\'ajout de votre proposition.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack>
            <Input
                placeholder="Entrez votre proposition ici..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <Button onClick={addProposal}>Ajouter la proposition</Button>
        </VStack>
    );
};

export default ProposalsRegistration;