import * as React from 'react';
import { getName } from '@console/shared';
import { getActiveNamespace } from '@console/internal/actions/ui';
import { StorageClassModel } from '@console/internal/models';
import { Firehose, FirehoseResult } from '@console/internal/components/utils';
import { DataVolumeModel } from '@console/kubevirt-plugin/src/models';
import { V1alpha1DataVolume } from '@console/kubevirt-plugin/src/types/vm/disk/V1alpha1DataVolume';
import { useImageUpload } from './use-upload-pvc';

export const CDIUploadContext = React.createContext<CDIUploadContextProps>({
  isUploading: false,
  fileName: '',
  progress: 0,
  error: '',
  status: '',
  pvcName: '',
  upload: () => {},
  cancelUpload: () => {},
});

export const CDIUpload: React.FC<UploadImageProps> = ({
  dataVolumes,
  namespace,
  storageClasses,
  children,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const config = { namespace, size: '1Gi', storageClassName: getName(storageClasses?.data?.[0]) };

  const { init, error, status, progress, pvcName } = useImageUpload(dataVolumes, config);

  const uploadFile = (file: File) => {
    setIsUploading(true);
    setFileName(file?.name);
    init(file);
  };

  return (
    <CDIUploadContext.Provider
      value={{
        isUploading,
        fileName,
        progress,
        error,
        status,
        pvcName,
        upload: uploadFile,
        cancelUpload: () => {},
      }}
    >
      {children}
    </CDIUploadContext.Provider>
  );
};

type UploadImageProps = {
  dataVolumes?: FirehoseResult<V1alpha1DataVolume[]>;
  storageClasses?: FirehoseResult;
  namespace: string;
};

export const CDIUploadProvider: React.FC = ({ children }) => {
  const namespace = getActiveNamespace();

  const resources = [
    {
      kind: DataVolumeModel.kind,
      namespace,
      isList: true,
      prop: 'dataVolumes',
    },
    {
      kind: StorageClassModel.kind,
      isList: true,
      prop: 'storageClasses',
    },
  ];

  return (
    <Firehose resources={resources}>
      <CDIUpload namespace={namespace}>{children}</CDIUpload>
    </Firehose>
  );
};

type CDIUploadContextProps = {
  isUploading: boolean;
  fileName: string;
  progress: number;
  error: string;
  status: string;
  pvcName: string;
  upload: (file: File) => void;
  cancelUpload: (uploadID: string) => void;
};
