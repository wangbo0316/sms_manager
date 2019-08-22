import { Button,  Divider, Switch, Form, Select, Col, Row} from 'antd';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import React, {Fragment} from 'react';
import { connect } from 'dva';
import { StateType } from '../../model';
import styles from './index.less';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;


const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
interface Step2Props extends FormComponentProps {
  data?: StateType['step'];
  dispatch?: Dispatch<any>;
  submitting?: boolean;
}

const Step2: React.FC<Step2Props> = props => {
  const { form, data, dispatch, submitting } = props;
  if (!data) {
    return null;
  }
  const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue } = form;
  const onPrev = () => {
    if (dispatch) {
      const values = getFieldsValue();
      dispatch({
        type: 'formStepForm/saveStepFormData',
        payload: {
          ...data,
          ...values,
        },
      });
      dispatch({
        type: 'formStepForm/saveCurrentStep',
        payload: 'info',
      });
    }
  };
  const onValidateForm = (e: React.FormEvent) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (dispatch) {
          dispatch({
            type: 'formStepForm/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      }
    });
  };

  return (
    <Fragment>
    <Form style={{marginTop:"5%"}} layout="horizontal" labelAlign={"left"} className={styles.stepForm} hideRequiredMark>
      <Form.Item {...formItemLayout} style={{textAlign: 'right'}} label="是否重复" required={false}>
        {getFieldDecorator('is_repetition',{initialValue:true})
        (<Switch style={{width:'10%'}}  defaultChecked/>)}
      </Form.Item>
      {getFieldValue("is_repetition")?
        <div>

          <Form.Item {...formItemLayout} style={{textAlign: 'right'}} label="发送时间" required={false}>
            {getFieldDecorator('push_time')
            (<Select style={{width:'20%'}}>
              {
                Array.apply(null, Array(24)).map((v,index)=>
                  (
                    <Select.Option value={index} key={index}>
                      {`每天${index}点`}
                    </Select.Option>
                  )
                )
              }
            </Select>)}
          </Form.Item>

          <Form.Item {...formItemLayout}  style={{textAlign: 'right'}} label="持续期" required={false}>
            {getFieldDecorator('date_range')
            (<RangePicker style={{width:'100%'}} />)}
          </Form.Item>
        </div>
        :null}

      <Row style={{marginTop:"10%"}}>
        <Col span={6} offset={5}>
          <Button type="primary" onClick={onValidateForm} icon="arrow-right" style={{width:"100%"}}>
            下一步
          </Button>
        </Col>
        <Col span={6} offset={2}>
          <Button type="primary" onClick={onPrev} icon="arrow-left" style={{width:"100%"}}>
            上一步
          </Button>
        </Col>
      </Row>
    </Form>
      <Divider style={{margin: '40px 0 24px'}}/>
    </Fragment>
  );
};
export default connect(
  ({
    formStepForm,
    loading,
  }: {
    formStepForm: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    submitting: loading.effects['formStepForm/submitStepForm'],
    data: formStepForm.step,
  }),
)(Form.create<Step2Props>()(Step2));
