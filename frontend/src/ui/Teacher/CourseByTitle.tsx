import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

const QuizAndTests = () => {
  return <div>List of Qui and Tests</div>;
};
const CreateQuiz = () => {
  return <div>Create Quiz</div>;
};
const CreateTest = () => {
  return <div>Create Test</div>;
};

const tabsConfig = [
  { title: 'QuizAndTests', component: QuizAndTests },
  { title: 'Create Quiz', component: CreateQuiz },
  { title: 'Create Test', component: CreateTest },
];

export default function CourseByTitle() {
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
