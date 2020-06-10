import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getName } from '@console/shared';
import { k8sCreate } from '@console/internal/module/k8s';
import { FirehoseResult } from '@console/internal/components/utils';
import { getLoadedData } from '@console/kubevirt-plugin/src/utils';
import { DataVolumeModel, UploadTokenRequestModel } from '@console/kubevirt-plugin/src/models';
import { V1alpha1DataVolume } from '@console/kubevirt-plugin/src/types/vm/disk/V1alpha1DataVolume';
import { getAvailableDVName } from './helpers';
import { UPLOAD_URL } from './consts';

export const useImageUpload = (
  dvs: FirehoseResult<V1alpha1DataVolume[]>,
  config: useImageUploadConfig,
) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [pvcName, setPVCName] = useState('');
  const [image, setImage] = useState<Blob>(new Blob());
  const [createdDV, setCreatedDV] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [progress, setProgress] = useState(0);
  const initUpload = useRef(false);

  const { namespace, storageClassName, size } = config;

  const init = async (initImage: Blob) => {
    setImage(initImage);
    const loadedDataVolumes = getLoadedData(dvs, []);
    const dataVolumeName = getAvailableDVName(loadedDataVolumes);
    setPVCName(dataVolumeName);

    const dataVolume = {
      apiVersion: 'cdi.kubevirt.io/v1alpha1',
      kind: DataVolumeModel.kind,
      metadata: {
        name: dataVolumeName,
        namespace,
      },
      spec: {
        source: {
          upload: {},
        },
        pvc: {
          storageClassName,
          accessModes: ['ReadWriteOnce'],
          resources: {
            requests: {
              storage: size, // based on file size?
            },
          },
        },
      },
    };

    await k8sCreate(DataVolumeModel, dataVolume)
      .then(() => setCreatedDV(true))
      .catch((err) => setError(err));
  };

  // update status
  useEffect(() => {
    if (createdDV) {
      const loadedDataVolumes = getLoadedData(dvs, []);
      const dv = loadedDataVolumes.find((datavolume) => getName(datavolume) === pvcName);
      if (dv) {
        setStatus(dv?.status?.phase);
      }
    }
  }, [createdDV, pvcName, dvs]);

  // create token
  useEffect(() => {
    if (status === 'UploadReady' && !token) {
      const tokenRequest = {
        apiVersion: 'upload.cdi.kubevirt.io/v1alpha1',
        kind: UploadTokenRequestModel.kind,
        metadata: {
          name: pvcName,
          namespace,
        },
        spec: {
          pvcName,
        },
      };

      const createToken = async () => {
        await k8sCreate(UploadTokenRequestModel, tokenRequest)
          .then((res) => setToken(res?.status?.token))
          .catch((err) => setError(err));
      };

      createToken();
    }
  }, [pvcName, namespace, status, token]);

  // upload image
  useEffect(() => {
    if (image && token && !initUpload.current) {
      initUpload.current = true;
      const reader = new FileReader();
      reader.onloadend = (ev) => {
        axios
          .post(config?.url || UPLOAD_URL, ev.target.result, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (e) => setProgress(Math.floor((e.loaded / image.size) * 100)),
          })
          .then(() => setProgress(100))
          .catch((err) => setError(err));
      };
      reader.readAsArrayBuffer(image);
    }
  }, [config, image, token]);

  return { init, status, progress, pvcName, error };
};

type useImageUploadConfig = {
  namespace: string;
  storageClassName: string;
  size: string;
  url?: string;
};

/* 
1. Create a Data Volume
2. Wait for PVC to be bounded to it
3. Request Upload Token
4. Upload file
*/
