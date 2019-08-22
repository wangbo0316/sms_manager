import {Button, Divider, Form, InputNumber, Select, Icon, Row, Col} from 'antd';
import React, {Fragment} from 'react';
import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {StateType} from '../../model';
import styles from './index.less';


const {Option} = Select;


interface Step1Props extends FormComponentProps {
  data?: StateType['step'];
  dispatch?: Dispatch<any>;
}

let id = 0;

const Step1: React.FC<Step1Props> = props => {


  const fieldsOption = {
    "部门": {
      "type": "category",
      "operator": ["="],
      "value": ["四方", "运营"]
    },
    "在投金额": {
      "type": "number",
      "operator": [">", "<", ">=", "<=", "="],
      "value": null
    },
    "账户余额": {
      "type": "number",
      "operator": [">", "<", ">=", "<=", "="],
      "value": null
    },
    "性别": {
      "type": "category",
      "operator": ["="],
      "value": ["男", "女"]
    },
    "年龄": {
      "type": "number",
      "operator": [">", "<", ">=", "<=", "="],
      "value": null
    },
    "是否在投": {
      "type": "category",
      "operator": ["="],
      "value": ["是", "否"]
    },
    "是否投资": {
      "type": "category",
      "operator": ["="],
      "value": ["是", "否"]
    },
    "是否使用体验金": {
      "type": "category",
      "operator": ["="],
      "value": ["是", "否"]
    },
    "是否开通存管": {
      "type": "category",
      "operator": ["="],
      "value": ["是", "否"]
    },
    "是否投资新手标": {
      "type": "category",
      "operator": ["="],
      "value": ["是", "否"]
    }
  };

  // @ts-ignore
  const remove = k => {
    const {form} = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  const add = () => {
    const {form} = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  const {form, dispatch, data} = props;
  if (!data) {
    return null;
  }
  const {getFieldDecorator, validateFields, getFieldValue, resetFields} = form;
  const onValidateForm = () => {
    validateFields((err: any, values: StateType['step']) => {
      if (!err && dispatch) {
        // dispatch({
        //   type: 'formStepForm/saveStepFormData',
        //   payload: values,
        // });
        console.log(values);
        dispatch({
          type: 'formStepForm/saveCurrentStep',
          payload: 'confirm',
        });
      }
    });
  };

  getFieldDecorator('keys', {initialValue: []});
  const keys = getFieldValue('keys');
  const formItems = keys.map((k) => (
    <Row>
      <Col span={9}>
        <Form.Item
          required={false}
          key={k}
        >
          {getFieldDecorator(`fields[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请选择一个字段进行筛选",
              },
            ],
          })(<Select  onChange={()=>resetFields([`values[${k}]`,`operator[${k}]`])} style={{width: '100%'}}>
            {
              Object.keys(fieldsOption).map((k) => (
                <Option value={k}>{k}</Option>
              ))
            }
          </Select>)}

        </Form.Item>
      </Col>
      <Col span={2} offset={1}>
        <Form.Item
          required={false}
          key={k}
        >
          {getFieldDecorator(`operator[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "!",
              },
            ],
          })(getFieldValue("fields")[k] ? <Select style={{width: '100%'}}>
            {
              fieldsOption[getFieldValue("fields")[k]]["operator"].map((k) => (
                <Option value={k}>{k}</Option>
              ))
            }
          </Select> : <div/>)}

        </Form.Item>
      </Col>
      <Col span={9} offset={1}>
        <Form.Item
          required={false}
          key={k}
        >
          {getFieldDecorator(`values[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入数值！",
              },
            ],
          })(getFieldValue("fields")[k] ? fieldsOption[getFieldValue("fields")[k]]["type"] === "number" ?
            <InputNumber style={{width: '100%'}}/> :
            <Select style={{width: '100%'}}>
              {
                fieldsOption[getFieldValue("fields")[k]]["value"].map((k) => (
                  <Option value={k}>{k}</Option>
                ))
              }
            </Select> : <div/>)}

        </Form.Item>
      </Col>
      <Col span={1} offset={1}>
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove(k)}
            style={{marginTop: "30%",textAlign:"right"}}
          />
        ) : null}
      </Col>
    </Row>
  ));
  return (
    <Fragment>

      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Row style={{marginBottom: "1%"}}>
          <Col span={9} style={{textAlign: "center"}}>
            筛选字段
          </Col>
          <Col span={2} offset={1} style={{textAlign: "center"}}>
            操作符
          </Col>
          <Col span={9} offset={1} style={{textAlign: "center"}}>
            数值
          </Col>
        </Row>
        {formItems}
        <Form.Item>
          <Button type="dashed" onClick={add} style={{width: '100%'}}>
            <Icon type="plus"/> 添加筛选条件
          </Button>
        </Form.Item>

        <Row>
          <Col span={6} offset={5}>
            <Button type="primary" onClick={onValidateForm} icon="arrow-right" style={{width:"100%"}}>
              下一步
            </Button>
          </Col>
          <Col span={6} offset={2}>
            <Button type="primary" icon="download" style={{width:"100%"}}>
              下载当前列表
            </Button>
          </Col>
        </Row>
      </Form>
      <Divider style={{margin: '40px 0 24px'}}/>
    </Fragment>
  );
};

export default connect(({formStepForm}: { formStepForm: StateType }) => ({
  data: formStepForm.step,
}))(Form.create<Step1Props>()(Step1));
