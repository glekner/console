export const centOS7 = {
  apiVersion: 'template.openshift.io/v1',
  kind: 'Template',
  metadata: {
    annotations: {
      'defaults.template.kubevirt.io/disk': 'rootdisk',
      description:
        'This template can be used to create a VM suitable for CentOS 7 and newer. The template assumes that a PVC is available which is providing the necessary CentOS disk image.',
      iconClass: 'icon-centos',
      'name.os.template.kubevirt.io/centos7.0': 'CentOS 7',
      'openshift.io/display-name': 'CentOS 7.0+ VM',
      'openshift.io/documentation-url': 'https://github.com/kubevirt/common-templates',
      'openshift.io/provider-display-name': 'KubeVirt',
      'openshift.io/support-url': 'https://github.com/kubevirt/common-templates/issues',
      tags: 'kubevirt,virtualmachine,linux,centos',
      'template.kubevirt.io/editable':
        '/objects[0].spec.template.spec.domain.cpu.sockets\n/objects[0].spec.template.spec.domain.cpu.cores\n/objects[0].spec.template.spec.domain.cpu.threads\n/objects[0].spec.template.spec.domain.resources.requests.memory\n/objects[0].spec.template.spec.domain.devices.disks\n/objects[0].spec.template.spec.volumes\n/objects[0].spec.template.spec.networks\n',
      'template.kubevirt.io/version': 'v1alpha1',
      'template.openshift.io/bindable': 'false',
      validations:
        '[\n  {\n    "name": "minimal-required-memory",\n    "path": "jsonpath::.spec.domain.resources.requests.memory",\n    "rule": "integer",\n    "message": "This VM requires more memory.",\n    "min": 1073741824\n  }\n]\n',
    },
    creationTimestamp: '2019-12-17T13:59:32Z',
    labels: {
      'flavor.template.kubevirt.io/small': 'true',
      'os.template.kubevirt.io/centos7.0': 'true',
      'template.kubevirt.io/type': 'base',
      'template.kubevirt.io/version': 'v0.8.1',
      'workload.template.kubevirt.io/server': 'true',
    },
    name: 'centos7-server-small-v0.7.0',
    namespace: 'openshift-cnv',
    resourceVersion: '48308',
    selfLink:
      '/apis/template.openshift.io/v1/namespaces/openshift/templates/centos7-server-small-v0.7.0',
    uid: 'e3b8c906-5522-4da8-9a85-0b45e37ac9af',
  },
  objects: [
    {
      apiVersion: 'kubevirt.io/v1alpha3',
      kind: 'VirtualMachine',
      metadata: {
        labels: {
          app: 'mock',
          'vm.kubevirt.io/template': 'centos7-server-small',
          'vm.kubevirt.io/template.revision': '1',
          'vm.kubevirt.io/template.version': 'v0.8.1',
        },
        name: 'centos7-template',
      },
      spec: {
        running: false,
        template: {
          metadata: {
            labels: {
              'kubevirt.io/domain': 'mock',
              'kubevirt.io/size': 'small',
            },
          },
          spec: {
            domain: {
              cpu: {
                cores: 1,
                sockets: 1,
                threads: 1,
              },
              devices: {
                disks: [
                  {
                    disk: {
                      bus: 'virtio',
                    },
                    name: 'rootdisk',
                  },
                  {
                    disk: {
                      bus: 'virtio',
                    },
                    name: 'cloudinitdisk',
                  },
                ],
                interfaces: [
                  {
                    masquerade: {},
                    name: 'default',
                  },
                ],
                networkInterfaceMultiqueue: true,
                rng: {},
              },
              resources: {
                requests: {
                  memory: '2G',
                },
              },
            },
            networks: [
              {
                name: 'default',
                pod: {},
              },
            ],
            terminationGracePeriodSeconds: 0,
            volumes: [
              {
                name: 'rootdisk',
                persistentVolumeClaim: {
                  claimName: 'pvcName',
                },
              },
              {
                cloudInitNoCloud: {
                  userData: '#cloud-config\npassword: centos\nchpasswd: { expire: False }',
                },
                name: 'cloudinitdisk',
              },
            ],
          },
        },
      },
    },
  ],
  parameters: [
    {
      description: 'VM name',
      from: 'centos7-[a-z0-9]{16}',
      generate: 'expression',
      name: 'NAME',
    },
    {
      description: 'Name of the PVC with the disk image',
      name: 'PVCNAME',
      required: true,
    },
  ],
};

export const nativeTemplates = [centOS7];
