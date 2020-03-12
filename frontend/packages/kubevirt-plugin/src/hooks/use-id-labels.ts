import * as React from 'react';

export const useIDLabels = <T extends IDLabel>(
  initialLabels: T[],
): [
  T[], // labels
  React.Dispatch<React.SetStateAction<T[]>>, // setLabels()
  (newLabel: T) => void, // addLabel()
  (updatedLabel: T) => void, // changeLabel()
  (idToDelete: number) => void, // deleteLabel()
] => {
  const [labels, setLabels] = React.useState<T[]>(initialLabels);

  const onLabelAdd = React.useCallback(
    (newLabel: T) => {
      const id = labels[labels.length - 1]?.id + 1 || 0;
      setLabels([...labels, { ...newLabel, id }]);
    },
    [labels],
  );

  const onLabelChange = React.useCallback(
    (updatedLabel: T) =>
      setLabels(
        labels.map((label) => {
          if (label.id === updatedLabel.id) {
            return updatedLabel;
          }
          return label;
        }),
      ),
    [labels],
  );

  const onLabelDelete = React.useCallback(
    (idToDelete: number) => {
      setLabels(labels.filter(({ id }) => id !== idToDelete));
    },
    [labels],
  );

  return [labels, setLabels, onLabelAdd, onLabelChange, onLabelDelete];
};

export type IDLabel = {
  id: number;
  key: string;
  value: string;
};
