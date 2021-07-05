import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ResourceDropdownField } from '@console/dynamic-plugin-sdk';
import { formikFormProps } from '@console/dynamic-plugin-sdk/src/shared/test-utils/formik-props-utils';
import {
  ModalTitle,
  ModalBody,
  ModalSubmitFooter,
} from '@console/internal/components/factory/modal';
import { ServiceModel } from '../../../models';
import SinkPubsubModal from '../SinkPubsubModal';

type SinkPubsubModalProps = React.ComponentProps<typeof SinkPubsubModal>;

jest.mock('react-i18next', () => {
  const reactI18next = require.requireActual('react-i18next');
  return {
    ...reactI18next,
    useTranslation: () => ({ t: (key) => key }),
  };
});

describe('SinkPubsubModal Form', () => {
  let formProps: SinkPubsubModalProps;
  let sinkPubsubeModalWrapper: ShallowWrapper<SinkPubsubModalProps>;
  const formValues = {
    ref: {
      apiVersion: `${ServiceModel.apiGroup}/${ServiceModel.apiVersion}`,
      kind: ServiceModel.kind,
      name: 'event-greeter',
    },
  };
  beforeEach(() => {
    formProps = {
      ...formikFormProps,
      values: formValues,
      resourceName: 'myapps',
      initialValues: formValues,
      resourceDropdown: [],
      labelTitle: 'Move Subscription',
    };
    sinkPubsubeModalWrapper = shallow(<SinkPubsubModal {...formProps} />);
  });

  it('should render ModalTitle, body and footer', () => {
    expect(sinkPubsubeModalWrapper.find(ModalTitle)).toHaveLength(1);
    expect(sinkPubsubeModalWrapper.find(ModalBody)).toHaveLength(1);
    expect(sinkPubsubeModalWrapper.find(ModalSubmitFooter)).toHaveLength(1);
  });
  it('should render ResourceDropdownField for service', () => {
    const serviceDropDown = sinkPubsubeModalWrapper.find(ResourceDropdownField);
    expect(serviceDropDown).toHaveLength(1);
    expect(serviceDropDown.get(0).props.name).toBe('ref.name');
    expect(serviceDropDown.get(0).props.selectedKey).toBe('event-greeter');
  });

  it('should call validateForm, setFieldValue onChange', () => {
    const modal = sinkPubsubeModalWrapper.find(ResourceDropdownField);
    modal.props().onChange('event-greeter');
    expect(formProps.setFieldTouched).toHaveBeenCalled();
    expect(formProps.setFieldValue).toHaveBeenCalled();
    expect(formProps.validateForm).toHaveBeenCalled();
  });

  it('should call handleSubmit on form submit', () => {
    sinkPubsubeModalWrapper.simulate('submit');
    expect(formProps.handleSubmit).toHaveBeenCalled();
  });

  it('Save should be disabled if value is not changed', () => {
    const modalSubmitFooter = sinkPubsubeModalWrapper.find(ModalSubmitFooter);
    expect(modalSubmitFooter.get(0).props.submitDisabled).toBe(true);
  });

  it('Save should be enabled if value is  changed', () => {
    const sinkValues = {
      ref: {
        apiVersion: `${ServiceModel.apiGroup}/${ServiceModel.apiVersion}`,
        kind: ServiceModel.kind,
        name: 'event-greeter-new',
      },
    };
    formProps = {
      ...formProps,
      values: {
        ...formProps.values,
        ...sinkValues,
      },
      resourceDropdown: [],
      labelTitle: 'Move Subscription',
    };
    sinkPubsubeModalWrapper = shallow(<SinkPubsubModal {...formProps} />);
    const modalSubmitFooter = sinkPubsubeModalWrapper.find(ModalSubmitFooter);
    expect(modalSubmitFooter.get(0).props.submitDisabled).toBe(false);
  });
});
