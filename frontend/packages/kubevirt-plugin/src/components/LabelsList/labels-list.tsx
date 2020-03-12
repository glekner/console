import * as React from 'react';
import {
  Grid,
  GridItem,
  Text,
  TextVariants,
  Button,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { ExternalLink, resourcePath } from '@console/internal/components/utils';
import { LabelRow } from './LabelRow/label-row';
import { ADD_LABEL, LABEL_KEY, LABEL_VALUE } from './consts';
import { IDLabel } from '../../hooks/use-id-labels';
import './labels-list.scss';

export const LabelsList = <T extends IDLabel>({
  labels,
  onLabelAdd,
  onLabelChange,
  onLabelDelete,
  newLabel = { id: -1, key: '', value: '' } as T,
  addRowText = ADD_LABEL,
}: LabelsListProps<T>) => (
  <>
    <Grid className="kv-scheduling-labels__grid">
      {labels.length > 0 && [
        <React.Fragment key="label-title-row">
          <GridItem span={7}>
            <Text component={TextVariants.h4}>{LABEL_KEY}</Text>
          </GridItem>
          <GridItem span={5}>
            <Text component={TextVariants.h4}>{LABEL_VALUE}</Text>
          </GridItem>
        </React.Fragment>,
        labels.map((label) => (
          <LabelRow<T>
            key={label.id}
            label={label}
            onChange={onLabelChange}
            onDelete={onLabelDelete}
          />
        )),
      ]}
    </Grid>
    <Split>
      <SplitItem>
        <Button
          className="pf-m-link--align-left"
          id="vm-node-selector-add-btn"
          variant="link"
          onClick={() => onLabelAdd(newLabel)}
          icon={<PlusCircleIcon />}
        >
          {labels.length > 0 ? addRowText : `${addRowText} to specify qualifying nodes`}
        </Button>
      </SplitItem>
      <SplitItem isFilled />
      <SplitItem>
        <ExternalLink text={<div>Explore nodes list</div>} href={resourcePath('Node')} />
      </SplitItem>
    </Split>
  </>
);

type LabelsListProps<T> = {
  labels: T[];
  newLabel?: T;
  addRowText?: string;
  onLabelAdd: (label: T) => void;
  onLabelChange: (label: T) => void;
  onLabelDelete: (id: number) => void;
};
