import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';

import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Appearance from './Appearance';

// TODO
const UserInformation = () => {
  return <div>User Information</div>;
};
const ChangePassword = () => {
  return <div>Change Password</div>;
};

const tabsConfig = [
  { title: 'My profile', component: UserInformation },
  { title: 'Password', component: ChangePassword },
  { title: 'Appearance', component: Appearance },
];

export default function Profile() {
  const { user } = useAuth();
  const finalTabs = [...tabsConfig];

  // temporary information show up
  useEffect(() => {
    if (!user) {
      console.log('User not found');
    }
    console.log('rendering Profile for', user);
  }, []);

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        User Settings
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          {finalTabs.map((tab, index) => (
            <Tab key={index}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index}>
              <tab.component />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}
