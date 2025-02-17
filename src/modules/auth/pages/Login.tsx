import { useState } from "react";
import { Button, Checkbox, Col, Flex, Form, Input, Row } from "antd";
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (values: { email: string; password: string }) => {
        
        console.log("Email:", values.email);
        console.log("Password:", values.password);
    };

    return (
        <Row className="login-page">
            <Col span={10} className="login-left">
                <img
                    src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    alt="#"
                    width="100px"
                    className="login-logo"
                />
                <h1 style={{
                }}>
                    Sign in to your account
                </h1>
                <Form
                    className="login-form"
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item name="email" label="Email address">
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input.Password type="password" />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a className="forgot-password" href="">
                                Forgot password?
                            </a>
                        </Flex>
                    </Form.Item>
                    <Button className="login-submit" htmlType="submit">
                        Sign in
                    </Button>
                </Form>
            </Col>
            <Col className="login-right" span={14}>
                <img
                    src="https://resources.owllabs.com/hubfs/Blog%20Images/Stock/Remote/Remote-2793651_1152px.jpg"
                    alt="#"
                    className="login-background"
                />
            </Col>
        </Row>
    );
};

export default Login;