import * as React from 'react';
import { TextContent, Text, TextVariants, Progress } from '@patternfly/react-core';
import { VMLikeEntityTabProps } from '../vms/types';
import { CDIUploadContext } from '@console/internal/components/cdi-upload-provider/cdi-upload-provider';
import { LoadingInline } from '@console/internal/components/utils';

export const UploadImage: React.FC = () => {
  const [isUploading, setIsUploading] = React.useState(false);
  const { upload, status, fileName, error, progress } = React.useContext(CDIUploadContext);

  const onUpload = (e) => {
    setIsUploading(true);
    upload(e.target.files[0]);
  };

  return (
    <div className="co-m-pane__body">
      <div>
        <input type="file" onChange={onUpload} />
      </div>
      <TextContent>
        <Text component={TextVariants.h4}>
          {`status: ${status}`} {isUploading && progress === 0 && <LoadingInline />}
        </Text>
        {error && <Text component={TextVariants.h4}>{`error: ${error}`}</Text>}
        <Progress value={progress} title={fileName} />
      </TextContent>
    </div>
  );
};

export const UploadImageFirehose: React.FC<VMLikeEntityTabProps> = () => {
  return <UploadImage />;
};
