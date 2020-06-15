const kubeServerURL = window.SERVER_FLAGS?.kubeAPIServerURL?.match(
  /(?<=https:\/\/api.).+(?=:\d)/,
)[0];

export const UPLOAD_URL = `https://cdi-uploadproxy-cdi.apps.${kubeServerURL}/v1alpha1/upload-async`;
