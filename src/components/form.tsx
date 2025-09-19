"use client"
import { TicketApi, ticketpayload } from "@/apis/ticket";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import { SwalTop } from "@/utils/sweetAlerttop";
import { Form, FormProps, Input, Select } from "antd";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Ticketform({ type }: { type: "create" | "edit" }) {
    const [buttonText, setButtonText] = useState("เข้าสู่ระบบ");
    const [buttonDisable, setButtonDisable] = useState(false);
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = parseInt(params.id);
    const [form] = Form.useForm<ticketpayload>();
    const { TextArea } = Input;

    const onFinish: FormProps["onFinish"] = async (values: ticketpayload) => {
        setButtonText("กำลังเข้าสู่ระบบ");
        try {
            if (type === "create") {
                const createdata = await TicketApi.create(values)
                if (createdata.status === 201) {
                    SwalTop("success", "สร้างสำเร็จ")
                    router.push("/tickets")
                }
            } else {
                const updatedata = await TicketApi.update(id, values)
                if (updatedata.status === 200) {
                    SwalTop("success", "แก้ไขสำเร็จ")
                    router.push("/tickets")
                }
            }

        } catch (error: any) {
            console.log(error);

            setButtonDisable(false);
            SwalTop("error", error?.response?.data?.message)
        }
    };

    useEffect(() => {
        if (type === "edit") {
            getdata()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])
    const getdata = async () => {
        try {
            const getinfo = await TicketApi.getById(id)
            if (getinfo.status === 200) {
                form.setFieldsValue({
                    title: getinfo.data.data.title,
                    description: getinfo.data.data.description,
                    status: getinfo.data.data.status,
                    priority: getinfo.data.data.priority,
                });
            }
        } catch (error) {
            SwalTop("error", "ดึงข้อมูลไม่สำเร็จ")
        }
    }
    const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
        SwalCenter("error", "ท่านกรอกข้อมูลไม่ครบ", "กรุณาตรวจสอบอีกครั้ง");
    };

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    const initialValues = useMemo<Partial<ticketpayload>>(
        () => (type === "create" ? { status: "OPEN", priority: "LOW" } : {}),
        [type]
    );
    return (
        <div className="p-4 w-full xl:w-3/4 mt-4 mx-auto h-screen overflow-auto bg-white">
            <p className="text-xl mb-4">สร้าง Ticket</p>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 600 }}
                initialValues={initialValues}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<ticketpayload>
                    label="ชื่อ"
                    name="title"
                    rules={[{ required: true, message: 'กรุณาใส่ชื่อ' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<ticketpayload>
                    label="คำอธิบาย"
                    name="description"
                    rules={[{ required: true, message: 'กรุณาใส่คำอธิบาย' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item<ticketpayload>
                    label="สถานะ"
                    name="status"
                >
                    <Select
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: 'OPEN', label: 'OPEN' },
                            { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
                            { value: 'RESOLVED', label: 'RESOLVED', disabled: type === "create" },
                        ]}
                    />
                </Form.Item>

                <Form.Item<ticketpayload>
                    label="ความสำคัญ"
                    name="priority"
                >
                    <Select
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: 'LOW', label: 'LOW' },
                            { value: 'MEDIUM', label: 'MEDIUM' },
                            { value: 'HIGH', label: 'HIGH' },
                        ]}
                    />
                </Form.Item>

                <Form.Item label={null}>
                    <button
                        className={`relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px]  border-pink-300 bg-pink-300 px-4 py-2 font-semibold`}
                    >
                        <span className="text-center">{type === "create" ? "สร้าง" : "แก้ไข"}</span>
                    </button>
                </Form.Item>
            </Form>
        </div>
    )
}
