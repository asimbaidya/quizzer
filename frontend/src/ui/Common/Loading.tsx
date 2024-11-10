import { Spinner, AbsoluteCenter, Center } from '@chakra-ui/react';

function Loading() {
  return (
    <Center minH="100%">
      <Spinner
        width={200}
        height={200}
        thickness="5px"
        speed=".75s"
        size="xl"
        color="teal.500"
      />
    </Center>
  );
}

export default Loading;
