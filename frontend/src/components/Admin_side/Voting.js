import { Box, Heading, Text } from '@chakra-ui/react';

const Voting = () => {
  return (
    <Box maxW="700px" mx="auto" textAlign="center" p="4">
      <Heading as="h2" size="xl" mb="4">
        Voting Session
      </Heading>
      <Text fontSize="lg">
        The voting session has started. Voters can now cast their votes.
      </Text>
    </Box>
  );
};

export default Voting;