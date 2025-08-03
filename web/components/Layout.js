import { Flex, Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box as="main" flex="1" p={{ base: 4, md: 8 }}>
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
