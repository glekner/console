import * as React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { Firehose, FirehoseResult } from '@console/internal/components/utils';
import { DataVolumeModel } from '../../models';
import { VMLikeEntityTabProps } from '../vms/types';
import { useUploadPVC } from './use-upload-pvc';
import { getNamespace } from '@console/shared';
import { V1alpha1DataVolume } from '../../types/vm/disk/V1alpha1DataVolume';

export const UploadImage: React.FC<UploadImageProps> = ({ dataVolumes, namespace }) => {
  const { init, status, error, progress } = useUploadPVC(dataVolumes, namespace, 'rook-ceph');

  const onUpload = (e) => {
    init(e.target.files[0]);
  };

  return (
    <div className="co-m-pane__body">
      <div>
        <input type="file" onChange={onUpload} />
      </div>
      <TextContent>
        <Text component={TextVariants.h4}>{`Status: ${status?.phase}`}</Text>
        <Text component={TextVariants.h4}>{`Progress: ${progress}`}</Text>
        <Text component={TextVariants.h4}>{`error: ${error}`}</Text>
      </TextContent>
    </div>
  );
};

type UploadImageProps = {
  dataVolumes?: FirehoseResult<V1alpha1DataVolume[]>;
  namespace: string;
};

export const UploadImageFirehose: React.FC<VMLikeEntityTabProps> = ({ obj: vmLikeEntity }) => {
  const namespace = getNamespace(vmLikeEntity);

  const resources = [
    {
      kind: DataVolumeModel.kind,
      namespace,
      isList: true,
      prop: 'dataVolumes',
    },
  ];

  return (
    <Firehose resources={resources}>
      <UploadImage namespace={namespace} />
    </Firehose>
  );
};
