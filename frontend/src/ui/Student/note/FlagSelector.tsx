import { memo } from 'react';
import { FLAG_SCHEMES } from './flag_schemes';

import { HStack, IconButton } from '@chakra-ui/react';
import { FaFlag } from 'react-icons/fa';
import { LuFlagOff } from 'react-icons/lu';

// update flagselector to include flag 0 with
const FlagSelector = memo(
  ({
    isVisible,
    currentFlag,
    onSelectFlag,
  }: {
    isVisible: boolean;
    currentFlag: number;
    onSelectFlag: (flag: number) => void;
  }) => {
    if (!isVisible) return null;

    return (
      <HStack spacing={1} onClick={(e) => e.stopPropagation()}>
        <IconButton
          aria-label="No Flag"
          icon={<LuFlagOff />}
          size="sm"
          variant={currentFlag === 0 ? 'solid' : 'outline'}
          onClick={() => onSelectFlag(0)}
        />
        {Object.entries(FLAG_SCHEMES).map(([flag, { scheme }]) => (
          <IconButton
            key={flag}
            aria-label={`Flag ${flag}`}
            icon={<FaFlag />}
            size="sm"
            variant={currentFlag === Number(flag) ? 'solid' : 'outline'}
            colorScheme={scheme}
            onClick={() => onSelectFlag(Number(flag))}
          />
        ))}
      </HStack>
    );
  }
);

export default FlagSelector;
