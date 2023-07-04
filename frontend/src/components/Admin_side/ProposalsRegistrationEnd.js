import { Box, Heading, Text } from '@chakra-ui/react';

const ProposalsRegistrationEnd = () => {
  return (
    <Box maxW="700px" mx="auto" textAlign="center" p="4">
      <Heading as="h2" size="xl" mb="4">
        Proposals Registration Ended !
      </Heading>
      <Text fontSize="lg">
      The proposals registration phase has ended. Voters are no longer able to submit their proposals.
      </Text>
    </Box>
  );
};

export default ProposalsRegistrationEnd;