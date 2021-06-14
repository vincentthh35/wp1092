import {Modal, Form, Input} from "antd";

const ChatModal = ({visible, onCreate, onCancel, displayStatus}) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title={"Create a new chat room"}
            okText={"Create"}
            cancelText={"Cancel"}
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then((values) => {
                    form.resetFields();
                    onCreate(values);
                }).catch((e) => {
                    // window.alert(e.errorFields[0].errors);
                    displayStatus({
                        type: 'error',
                        msg : e.errorFields[0].errors
                    })
                });
            }}
        >
            <Form
                form={form}
                layout={"vertical"}
                name={"form_in_modal"}
            >
                    <Form.Item
                        name={"name"}
                        label={"Name"}
                        rules={[{
                            required: true,
                            message: "Error: Please enter the name of the person to chat!",
                        },]}>
                            <Input />
                    </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChatModal;