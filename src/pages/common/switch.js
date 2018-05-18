import { List, Switch } from 'antd-mobile';
import { createForm } from 'rc-form';

let SwitchExample = (props) => {
  const { getFieldProps } = props.form;
  return (
    <List
      renderHeader={() => '表单开关项'}
    >
      <List.Item
        extra={<Switch
          {...getFieldProps('Switch', {
            initialValue: true,
            valuePropName: 'checked',
          })}
        />}
      >默认开</List.Item>

    </List>
  );
};

SwitchExample = createForm()(SwitchExample);
