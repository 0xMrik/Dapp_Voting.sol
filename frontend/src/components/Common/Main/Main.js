import { Flex, Text, Input, Button } from "@chakra-ui/react"
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useState, useEffect } from 'react'
import Contract from '../../../../../backend/artifacts/contracts/Voting.sol/Voting.json'

const Main = () => {

    const { address, isConnected } = useAccount()
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    
    const [proposalId, setProposalId] = useState(null)
    const [votedProposalId, setVotedProposalId] = useState(null)

    const voteForProposal = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "setVote",
                args: [proposalId]
            });
            const { hash } = await writeContract(request);
            await getDatas()
            return hash;
        } catch (err) {
            console.log(err.message)
        }
    }

    const getDatas = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getVoter",
                args: [address] // assuming the connected wallet address is the voter's address
            });
            setVotedProposalId(data.votedProposalId.toString())
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        if(isConnected) {
            getDatas()
        }
    }, [isConnected])

    return (
        <Flex p="2rem" width="100%" height="85vh" justifyContent="center" alignItems="center">
            {isConnected ? (
                <Flex direction="column" width="100%">
                    <Flex>
                        <Input onChange={e => setProposalId(e.target.value)} placeholder="Proposal ID to vote for" />
                        <Button onClick={() => voteForProposal()} colorScheme="purple">Vote for Proposal</Button>
                    </Flex>
                    <Flex alignItems="center" justifyContent="center" mt="2rem">
                        <Text>Your voted proposal ID : {votedProposalId}</Text>
                    </Flex> 
                </Flex>
            ) : (
                <Flex p="2rem" justifyContent="center" alignItems="center">
                    <Text>Please connect your Wallet.</Text>
                </Flex>
            )}
        </Flex>
    )
}

export default Main;