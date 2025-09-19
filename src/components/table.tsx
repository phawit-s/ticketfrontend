"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input, PaginationProps, Select, Table, TableProps, Tag } from "antd";
import { useAuth } from "@/contexts/authContext";
import { SweetAlertConfirm } from "@/utils/sweetAlertConfirm";
import { TicketApi, ticketform } from "@/apis/ticket";
import { DeleteButton, EditButton } from "@/components/button";
import { useRouter } from "next/navigation";
import dayjs from "@/const/day";

const { Search } = Input;


const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;

const TicketTable: React.FC = () => {
    const { isMobile } = useAuth();
    const router = useRouter();

    const [data, setData] = useState<ticketform[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [priority, setPriority] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [searchDebounced, setSearchDebounced] = useState(search);
    useEffect(() => {
        const t = setTimeout(() => setSearchDebounced(search.trim()), 800);
        return () => clearTimeout(t);
    }, [search]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = {
                status,
                priority,
                search: searchDebounced || undefined,
                page,
                pageSize,
                sortBy,
                sortOrder,
            };
            const response = await TicketApi.getAll(params);
            setData(response.data.data ?? []);
            setTotal(response.data.total ?? 0);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, priority, searchDebounced, page, pageSize, sortBy, sortOrder]);

    const onPaginationChange: PaginationProps["onChange"] = (p, ps) => {
        setPage(p);
        setPageSize(ps);
    };

    const onTableChange: TableProps<ticketform>["onChange"] = (
        pagination,
        _filters,
        sorter
    ) => {
        if (pagination?.current) setPage(pagination.current);
        if (pagination?.pageSize) setPageSize(pagination.pageSize);
        const s = Array.isArray(sorter) ? sorter[0] : sorter;
        if (s && s.field && s.order) {
            setSortBy(String(s.field));
            setSortOrder(s.order === "ascend" ? "asc" : "desc");
        } else {
            setSortBy("createdAt");
            setSortOrder("desc");
        }
    };

    const deletelesson = async (id: number) => {
        const confirm = await SweetAlertConfirm("ยืนยันการลบ?", "", "#d33");
        if (confirm.isConfirmed) {
            const response = await TicketApi.delete(id);
            if (response.status === 200) {
                setData(prev => prev.filter(item => item.id !== id));
                setTotal(prev => Math.max(0, prev - 1));
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "blue";
            case "IN_PROGRESS":
                return "yellow";
            case "RESOLVED":
                return "green";
            default:
                return "gray";
        }
    };
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW":
                return "green";
            case "MEDIUM":
                return "yellow";
            case "HIGH":
                return "red";
            default:
                return "gray";
        }
    };
    const columns: TableProps<ticketform>["columns"] = useMemo(
        () => [
            {
                title: "#",
                key: "index",
                align: "center",
                width: 70,
                render: (_: any, __: any, index: number) => (page - 1) * pageSize + index + 1,
            },
            {
                title: "ชื่อ",
                dataIndex: "title",
                key: "title",
                align: "left",
                sorter: true,
            },
            {
                title: "สถานะ",
                dataIndex: "status",
                key: "status",
                align: "center",
                sorter: true,
                render: (value: string) => <Tag color={getStatusColor(value)}>{value}</Tag>,
            },
            {
                title: "ความสำคัญ",
                dataIndex: "priority",
                key: "priority",
                align: "center",
                sorter: true,
                render: (value: string) => <Tag color={getPriorityColor(value)}>{value}</Tag>,
            },
            {
                title: "สร้างเมื่อ",
                dataIndex: "createdAt",
                key: "createdAt",
                align: "center",
                sorter: true,
                render: (v: string | Date) =>
                    dayjs(v).format("DD/MM/BBBB HH:mm")
            },
            {
                title: "แก้ไขเมื่อ",
                dataIndex: "updatedAt",
                key: "updatedAt",
                align: "center",
                sorter: true,
                render: (v: string | Date) =>
                    dayjs(v).format("DD/MM/BBBB HH:mm")
            },
            {
                title: "",
                key: "action",
                align: "center",
                fixed: "right",
                width: 120,
                render: (_: any, record: ticketform) => (
                    <div className="flex gap-4 items-center justify-center">
                        <EditButton onClick={() => router.push(`/tickets/${record.id}`)} />
                        <DeleteButton onClick={() => deletelesson(record.id)} />
                    </div>
                ),
            },
        ],
        [page, pageSize, router]
    );

    return (
        <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">ระบบจัดการตั๋ว</p>
            <div className="flex justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                    <Search
                        placeholder="ค้นหา ชื่อ/สถานะ"
                        allowClear
                        onChange={e => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        style={{ width: 260 }}
                    />
                    <Select
                        allowClear
                        placeholder="สถานะ"
                        style={{ width: 160 }}
                        options={STATUS_OPTIONS.map(s => ({ label: s, value: s }))}
                        value={status}
                        onChange={val => {
                            setPage(1);
                            setStatus(val);
                        }}
                    />
                    <Select
                        allowClear
                        placeholder="ความสำคัญ"
                        style={{ width: 160 }}
                        options={PRIORITY_OPTIONS.map(p => ({ label: p, value: p }))}
                        value={priority}
                        onChange={val => {
                            setPage(1);
                            setPriority(val);
                        }}
                    />
                    <button
                        className="px-4 py-1 bg-[#fdb7b5] hover:bg-gray-300 rounded text-white"
                        onClick={() => {
                            // reset all
                            setStatus(undefined);
                            setPriority(undefined);
                            setSearch("");
                            setPage(1);
                            setPageSize(10);
                            setSortBy("createdAt");
                            setSortOrder("desc");
                        }}
                    >
                        ล้าง
                    </button>
                </div>
                <div>
                    <button
                        className="px-4 py-1 bg-[#fdb7b5] hover:bg-gray-300 rounded text-white"
                        onClick={() => {
                            router.push("/tickets/create")
                        }}
                    >
                        สร้าง
                    </button>
                </div>
            </div>

            <Table<ticketform>
                columns={columns}
                rowKey={"id"}
                dataSource={data}
                loading={isLoading}
                onChange={onTableChange}
                components={{
                    header: {
                        cell: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
                            <th
                                {...props}
                                style={{
                                    backgroundColor: "#fdb7b5",
                                    color: "#000",
                                    fontSize: "15px",
                                    textAlign: "center",
                                }}
                            />
                        ),
                    },
                }}
                pagination={{
                    total,
                    current: page,
                    pageSize,
                    onChange: onPaginationChange,
                    showSizeChanger: true,
                    showTotal: !isMobile ? (t) => `ทั้งหมด ${t} รายการ` : undefined,
                    simple: isMobile,
                }}
                scroll={{ x: 900 }}
            />
        </div>
    );
};

export default TicketTable;
