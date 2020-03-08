import * as React from 'react';
import * as _ from 'lodash';
import { Text, TextVariants, Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { ExternalLink, resourcePath } from '@console/internal/components/utils';
import { LabelRow } from '../LabelRow/label-row';
import {
  SCHEDULING_ADD_LABEL,
  SCHEDULING_LABEL_KEY,
  SCHEDULING_LABEL_VALUE,
  SCHEDULING_LABEL_EFFECT,
} from '../consts';
import './labels-list.scss';

export const LabelsList: React.FC<LabelsListProps> = ({
  labels,
  onLabelAdd,
  onLabelChange,
  onLabelDelete,
  addRowText = SCHEDULING_ADD_LABEL,
  showEffect = false,
}) => (
  <>
    {_.size(labels) > 0 && [
      <div key="column-title" className="kv-labels-list__column-title">
        <Text className="kv-labels-list__key-title" component={TextVariants.h4}>
          {SCHEDULING_LABEL_KEY}
        </Text>
        <Text className="kv-labels-list__value-title" component={TextVariants.h4}>
          {SCHEDULING_LABEL_VALUE}
        </Text>
        {showEffect && (
          <Text className="kv-labels-list__effect-title" component={TextVariants.h4}>
            {SCHEDULING_LABEL_EFFECT}
          </Text>
        )}
      </div>,
      Object.entries(labels).map(([index, label]) => (
        <LabelRow
          key={index}
          index={index}
          label={label}
          showEffect={showEffect}
          onChange={onLabelChange}
          onDelete={onLabelDelete}
        />
      )),
    ]}

    <div className="kv-labels-list__buttons">
      <Button
        className="pf-m-link--align-left"
        id="vm-node-selector-add-btn"
        variant="link"
        onClick={onLabelAdd}
        icon={<PlusCircleIcon />}
      >
        {addRowText}
      </Button>
      <ExternalLink text={<div>Explore nodes list</div>} href={resourcePath('Node')} />
    </div>
  </>
);

type LabelsListProps = {
  showEffect?: boolean;
  addRowText?: string;
  labels: { [key: string]: { key?: string; value?: string; effect?: string } };
  onLabelAdd: () => void;
  onLabelChange: (index: string, key: string, value: string) => void;
  onLabelDelete: (index: string) => void;
};
