import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import AddMultipleChoiceQuestion from './questions/AddMultipleChoiceQuestion';
import AddSingleChoiceQuestion from './questions/AddSingleChoiceQuestion';
import AddUserInputQuestion from './questions/AddUserInputQuestion';
import AddTrueFalseQuestion from './questions/AddTrueFalseQuestion';

const ViewQuestions = () => {
  return <div>List of Quiz and Tests</div>;
};

const tabsConfig = [
  { title: 'View Quiz Questions', component: ViewQuestions },
  { title: 'Add Multiple Choice', component: AddMultipleChoiceQuestion },
  { title: 'Add Single Choice', component: AddSingleChoiceQuestion },
  { title: 'Add User Input', component: AddUserInputQuestion },
  { title: 'Add True False', component: AddTrueFalseQuestion },
];

export default function Test() {
  return (
    <Tabs variant="enclosed">
      <TabList>
        {tabsConfig.map((tab, index) => (
          <Tab key={index}>{tab.title}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabsConfig.map((tab, index) => (
          <TabPanel key={index}>
            <tab.component />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
