import { Modal, Form, Input } from 'antd';

const ChatModal = ({ visible, onCreate, onCancel, displayStatus }) => {
    const [form] = Form.useForm();
    const submitFunction = () => {
        form.validateFields().then((values) => {
            form.resetFields();
            onCreate(values);
        }).catch((e) => {
            displayStatus({
                type: 'error',
                msg: JSON.stringify(e.errorFields[0].errors[0])
            });
        });
    }
    return (
        <Modal
            visible={visible}
            title='Create a new chat box'
            okText='Create' cancelText='Cancel'
            onCancel={onCancel}
            onOk={submitFunction}
        >
            <Form form={form} layout='vertical' name='form_in_modal'>
                <Form.Item
                    name='name' label='name'
                    rules={[{
                        required: true,
                        message: 'Error: please enter the name of person to chat',
                    },]}
                >
                    <Input onPressEnter={submitFunction} autoFocus/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChatModal;
