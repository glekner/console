import * as React from 'react';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { TextInput, Button } from '@patternfly/react-core';
import './label-row.scss';

export const LabelRow: React.FC<LabelRowProps> = ({
  index,
  label: { key, value, effect = '' },
  showEffect = false,
  onChange,
  onDelete,
}) => {
  return (
    <div className="kv-label__row">
      <TextInput
        className="kv-label__key"
        placeholder="key"
        isRequired
        type="text"
        value={key}
        onChange={(v) => onChange(index, v, value)}
        aria-label="selector key"
      />
      <TextInput
        className="kv-label__value"
        placeholder="value"
        isRequired
        isDisabled={!key}
        type="text"
        value={value}
        onChange={(v) => onChange(index, key, v)}
        aria-label="selector value"
      />
      {showEffect && (
        <TextInput
          className="kv-label__effect"
          placeholder="effect"
          isRequired
          isDisabled={!key}
          type="text"
          value={effect}
          onChange={(v) => onChange(index, key, value, v)}
          aria-label="selector value"
        />
      )}
      <div className="kv-label__delete">
        <Button onClick={() => onDelete(index)} variant="plain">
          <MinusCircleIcon />
        </Button>
      </div>
    </div>
  );
};

type LabelRowProps = {
  index: string;
  showEffect?: boolean;
  label: { key?: string; value?: string; effect?: string };
  onChange: (index: string, name: string, value: string, effect?: string) => void;
  onDelete: (index: any) => void;
};
