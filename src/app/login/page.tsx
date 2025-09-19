"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Form, FormProps, Input } from "antd";


import { ProForm, ProFormText } from "@ant-design/pro-components";
import { useAuth } from "@/contexts/authContext";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";

export type LoginBodyType = {
  email: string;
  password: string;
};

export default function Loginpage() {

  const { login } = useAuth();

  const [buttonText, setButtonText] = useState("เข้าสู่ระบบ");
  const [buttonDisable, setButtonDisable] = useState(false);
  const router = useRouter();
  const onFinish: FormProps["onFinish"] = async (values: LoginBodyType) => {
    setButtonText("กำลังเข้าสู่ระบบ");
    try {
      await login(values.email, values.password);
    } catch (error) {
      setButtonDisable(false);
      setButtonText("เข้าสู่ระบบ");
    } finally {
      setButtonDisable(false);
      setButtonText("เข้าสู่ระบบ");
    }
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    SwalCenter("error", "ท่านกรอกข้อมูลไม่ครบ", "กรุณาตรวจสอบอีกครั้ง");
  };


  const [formRef] = Form.useForm<LoginBodyType>();
  const values = Form.useWatch([], formRef);



  return (
    <div className="w-screen h-screen relative login-pattern">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full max-w-[450px] p-6  bg-white card-shadow rounded-2xl flex flex-col gap-5 items-center justify-center mobile:max-w-[90%]">
        <div className="flex flex-col gap-2 text-center">
          <p className="h5 font-bold text-3xl text-pink-400">เข้าสู่ระบบ</p>
        </div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<LoginBodyType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginBodyType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>


          <Form.Item label={null}>
            <button
              disabled={buttonDisable}
              className={`
        relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px] 
        border-pink-300 px-4 py-2 font-semibold
        uppercase text-pink-300 transition-all duration-500
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-pink-300
        before:transition-transform before:duration-1000
        before:content-[""]

        hover:scale-105 hover:text-neutral-900
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95`}
            >
              <FiLogIn />
              <span className="text-center">{buttonText}</span>
            </button>
          </Form.Item>
        </Form>

      </div>
    </div>
  )
}

