import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, Flex, Heading, Spacer, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Login from './Login';
import Register from './Register';

import CreateAd from './CreateAd';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <Box>
      <Flex bg="teal.500" p={4} color="white" alignItems="center">
        <Heading size="md">AdvertGum</Heading>
        <Spacer />
        {user && <Button onClick={logout}>Logout</Button>}
      </Flex>
      <Container maxW="container.xl" mt={4}>
        {user ? (
          <Tabs>
            <TabList>
              <Tab>Dashboard</Tab>
              <Tab>Create Ad</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{children}</TabPanel>
              <TabPanel><CreateAd /></TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Box maxW="md" mx="auto" mt={10}>
            <Tabs isFitted variant="enclosed">
              <TabList>
                <Tab>Login</Tab>
                <Tab>Register</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Register />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Layout;
