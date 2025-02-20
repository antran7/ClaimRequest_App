import { Button, Checkbox, Col, Flex, Form, Input, Row } from "antd";
import "./Login.css";
import { Role } from "../../../shared/constants/roles";
import { useAuth } from "../../../shared/hooks/useAuth";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      console.log("Thanh cong!");
    } catch (error) {
      console.error(error);
    }

    const role = localStorage.getItem("userRole");
    console.log("Role la: ", role);
    switch (role) {
      case Role.ADMIN:
        navigate("/admin/dashboard");
        break;
      case Role.USER:
        navigate("/user/dashboard");
        break;
      case Role.APPROVER:
        navigate("/approval/dashboard");
        break;
      case Role.FINANCE:
        navigate("/finance/claims");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Row className="login-page">
      <Col span={10} className="login-left">
        <Link to='/' style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '15px',
          fontWeight: '600',
          color: '#000',
        }}>
          HOME.
        </Link>
        <img
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="#"
          width="100px"
          className="login-logo"
        />
        <h1 style={{
          fontSize: '27px',
          fontWeight: '700'
        }}>
          Sign in to your account
        </h1>
        <Form className="login-form" onFinish={handleSubmit} layout="vertical">
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
        <div className="login-background"></div>
      </Col>
    </Row>
  );
};

export default Login;
