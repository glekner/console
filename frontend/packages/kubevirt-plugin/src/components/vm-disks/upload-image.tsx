import * as React from 'react';
import { Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { Firehose, FirehoseResult, LoadingInline } from '@console/internal/components/utils';
import { DataVolumeModel } from '../../models';
import { VMLikeEntityTabProps } from '../vms/types';
import { useUploadPVC } from './use-upload-pvc';
import { getNamespace } from '@console/shared';
import { V1alpha1DataVolume } from '../../types/vm/disk/V1alpha1DataVolume';

export const UploadImage: React.FC<UploadImageProps> = ({ dataVolumes, namespace }) => {
  const { init, status, error, token } = useUploadPVC(dataVolumes, namespace, 'rook-ceph');
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const createDataVolume = async () => {
    setLoading(true);
    await init();
  };

  const onUpload = (e) => {
    const file = e.target.files[0];
    const url = 'https://cdi-uploadproxy-cdi.apps.ostest.test.metalkube.org/v1alpha1/upload-async';

    const reader = new FileReader();
    reader.onloadend = (ev) => {
      fetch(url, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: ev.target.result,
      })
        .then((res) => res.json())
        .then((res) => res.text())
        // eslint-disable-next-line no-alert
        .catch((err) => alert(err));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="co-m-pane__body">
      <div>
        <Button isDisabled={loading && !token} onClick={() => createDataVolume()}>
          Allocate PVC
        </Button>
        {loading && !token && <LoadingInline />}
      </div>
      <div>
        <input disabled={!token} type="file" onChange={onUpload} />
      </div>
      <TextContent>
        <Text component={TextVariants.h4}>{`Status: ${status?.phase}`}</Text>
        <Text component={TextVariants.h4}>{`Progress: ${progress}`}</Text>
        <Text component={TextVariants.h4}>{`TOKEN: ${token}`}</Text>
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
