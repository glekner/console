import * as React from 'react';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { TextInput, Button } from '@patternfly/react-core';

export const NodeSelectorRow: React.FC<NodeSelectorRowProps> = ({
  index,
  label: { key, value },
  onChange,
  onDelete,
}) => {
  return (
    <div className="kubevirt-node-selector__selector-row">
      <TextInput
        className="kubevirt-node-selector__selector-row-key"
        placeholder="key"
        isRequired
        type="text"
        value={key}
        onChange={(v) => onChange(index, v, value)}
        aria-label="selector key"
      />
      <TextInput
        className="kubevirt-node-selector__selector-row-value"
        placeholder="value"
        isRequired
        isDisabled={!key}
        type="text"
        value={value}
        onChange={(v) => onChange(index, key, v)}
        aria-label="selector value"
      />
      <div className="kubevirt-node-selector__selector-delete">
        <Button onClick={() => onDelete(index)} variant="plain">
          <MinusCircleIcon />
        </Button>
      </div>
    </div>
  );
};

type NodeSelectorRowProps = {
  index: string;
  label: { key?: string; value?: string };
  onChange: (index: string, name: string, value: string) => void;
  onDelete: (index: any) => void;
};
